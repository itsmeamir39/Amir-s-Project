'use client';
export const dynamic = 'force-dynamic';

import * as React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { logAdminAction } from '@/lib/audit';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type CirculationRuleRow = {
  id?: number;
  role: string;
  loan_period_days: number | null;
  borrow_limit: number | null;
  fine_amount_per_day: number | null;
  renewal_limit: number | null;
};

type GlobalSettings = {
  id?: number;
  maintenance_mode: boolean;
  allow_self_registration: boolean;
};

type AuditLogRow = {
  id: number;
  actor: string | null;
  action: string | null;
  details: string | null;
  created_at: string;
};

export default function AdminSettingsPage() {
  const supabase = createClientComponentClient<any>();

  const [rules, setRules] = React.useState<CirculationRuleRow[]>([]);
  const [rulesSaving, setRulesSaving] = React.useState(false);
  const [rulesMessage, setRulesMessage] = React.useState<string | null>(null);

  const [settings, setSettings] = React.useState<GlobalSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = React.useState(false);

  const [auditLogs, setAuditLogs] = React.useState<AuditLogRow[]>([]);
  const [totalUnpaidFines, setTotalUnpaidFines] = React.useState<number | null>(
    null
  );

  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const ensureDefaultRoles = React.useCallback(
    (existing: CirculationRuleRow[]): CirculationRuleRow[] => {
      const roles = ['Student', 'Faculty', 'Staff'];
      const byRole = new Map(existing.map((r) => [r.role, r]));

      return roles.map((role) => {
        const row = byRole.get(role);
        return (
          row ?? {
            role,
            loan_period_days: 14,
            borrow_limit: 5,
            fine_amount_per_day: 0.25,
            renewal_limit: 2,
          }
        );
      });
    },
    []
  );

  React.useEffect(() => {
    const load = async () => {
      try {
        // Circulation rules
        const { data: rulesData, error: rulesError } = await supabase
          .from('circulation_rules')
          .select(
            'id, role, loan_period_days, borrow_limit, fine_amount_per_day, renewal_limit'
          );

        if (rulesError) throw rulesError;

        setRules(
          ensureDefaultRoles((rulesData as CirculationRuleRow[]) ?? [])
        );

        // Global settings (assume a singleton row)
        const { data: settingsData, error: settingsError } = await supabase
          .from('global_settings')
          .select('id, maintenance_mode, allow_self_registration')
          .maybeSingle();

        if (settingsError) throw settingsError;

        setSettings(
          settingsData
            ? (settingsData as GlobalSettings)
            : {
                maintenance_mode: false,
                allow_self_registration: true,
              }
        );

        // Audit logs (latest 20)
        const { data: logsData, error: logsError } = await supabase
          .from('audit_logs')
          .select('id, actor, action, details, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        if (logsError) throw logsError;
        setAuditLogs((logsData as AuditLogRow[]) ?? []);

        // Fines overview
        const { data: finesData, error: finesError } = await supabase
          .from('fines')
          .select('amount, status');

        if (finesError) throw finesError;

        const total = (finesData ?? [])
          .filter((f: any) => f.status === 'Unpaid')
          .reduce((sum: number, f: any) => sum + (f.amount ?? 0), 0);

        setTotalUnpaidFines(total);
      } catch (e: any) {
        console.error(e);
        setLoadError(
          e?.message ?? 'Unable to load settings. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ensureDefaultRoles, supabase]);

  React.useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      setLoading(false);
      setLoadError('Loading is taking too long. Please refresh.');
    }, 10000);
    return () => clearTimeout(t);
  }, [loading]);

  const updateRuleField = (
    role: string,
    field: keyof Omit<
      CirculationRuleRow,
      'id' | 'role' | 'fine_amount_per_day'
    >,
    value: string
  ) => {
    setRules((prev) =>
      prev.map((r) =>
        r.role === role
          ? {
              ...r,
              [field]: value === '' ? null : Number(value),
            }
          : r
      )
    );
  };

  const updateFineField = (role: string, value: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.role === role
          ? {
              ...r,
              fine_amount_per_day: value === '' ? null : Number(value),
            }
          : r
      )
    );
  };

  const handleSaveRules = async () => {
    setRulesSaving(true);
    setRulesMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('You must be signed in as an admin to update rules.');
      }

      const payload = rules.map((r) => ({
        id: r.id,
        role: r.role,
        loan_period_days: r.loan_period_days,
        borrow_limit: r.borrow_limit,
        fine_amount_per_day: r.fine_amount_per_day,
        renewal_limit: r.renewal_limit,
      }));

      const { error } = await supabase
        .from('circulation_rules')
        .upsert(payload as any[], { onConflict: 'role' });

      if (error) throw error;

      // Log admin rule update
      await logAdminAction(
        supabase,
        user.id,
        'RULE_UPDATE',
        { updatedRules: payload }
      );

      setRulesMessage('Rules updated successfully.');
    } catch (e: any) {
      console.error(e);
      setRulesMessage(
        e?.message ?? 'Unable to save rules. Please try again later.'
      );
    } finally {
      setRulesSaving(false);
    }
  };

  const handleToggleSetting = async (key: keyof GlobalSettings) => {
    if (!settings) return;

    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setSettingsSaving(true);

    try {
      const { error } = await supabase
        .from('global_settings')
        .upsert(
          {
            id: next.id,
            maintenance_mode: next.maintenance_mode,
            allow_self_registration: next.allow_self_registration,
          } as any,
          { onConflict: 'id' }
        );

      if (error) throw error;
    } catch (e) {
      console.error(e);
      // Revert on error
      setSettings(settings);
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8 lg:px-10">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 flex-col gap-4 rounded-2xl bg-slate-900/80 p-5 ring-1 ring-slate-800/70 lg:flex">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin
            </p>
            <h1 className="text-lg font-semibold text-slate-50">
              Settings & policies
            </h1>
            <p className="text-xs text-slate-500">
              Configure circulation rules, system behavior, and review recent
              changes.
            </p>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <button className="flex w-full items-center justify-between rounded-xl bg-slate-800 px-3 py-2 text-left text-slate-50">
              <span>Circulation rules</span>
              <Badge className="border-0 bg-emerald-500/90 text-[10px] font-semibold text-emerald-950">
                Active
              </Badge>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-400 hover:bg-slate-800/60 hover:text-slate-50">
              <span>Access & roles</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-slate-400 hover:bg-slate-800/60 hover:text-slate-50">
              <span>Notifications</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Circulation settings
              </h2>
              <p className="text-xs text-slate-400">
                Fine-tune how your library lends, renews, and manages items.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              {settings?.maintenance_mode ? (
                <Badge className="border-0 bg-amber-500/90 text-[11px] font-semibold text-amber-950">
                  Maintenance mode enabled
                </Badge>
              ) : (
                <Badge className="border-0 bg-emerald-500/90 text-[11px] font-semibold text-emerald-950">
                  System online
                </Badge>
              )}
              {totalUnpaidFines != null && (
                <span>
                  Total unpaid fines:{' '}
                  <span className="font-medium text-slate-50">
                    ${totalUnpaidFines.toFixed(2)}
                  </span>
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400">Loading settings…</p>
          ) : loadError ? (
            <p className="text-sm text-rose-400">{loadError}</p>
          ) : (
            <>
              {/* Top grid: Rules + Global + Fines */}
              <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
                <Card className="border-slate-800 bg-slate-900/80">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-sm">
                        Circulation rules by role
                      </CardTitle>
                      <p className="mt-1 text-xs text-slate-400">
                        Adjust loan periods, borrowing limits, and fines for
                        each patron group.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-emerald-500 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
                      onClick={handleSaveRules}
                      disabled={rulesSaving}
                    >
                      {rulesSaving ? 'Saving…' : 'Save changes'}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="overflow-hidden rounded-xl border border-slate-800/80">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800/80 bg-slate-900">
                            <TableHead className="w-28 text-xs text-slate-300">
                              Role
                            </TableHead>
                            <TableHead className="text-xs text-slate-300">
                              Loan period (days)
                            </TableHead>
                            <TableHead className="text-xs text-slate-300">
                              Borrow limit
                            </TableHead>
                            <TableHead className="text-xs text-slate-300">
                              Fine / day ($)
                            </TableHead>
                            <TableHead className="text-xs text-slate-300">
                              Renewal limit
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rules.map((rule) => (
                            <TableRow
                              key={rule.role}
                              className="border-slate-800/80"
                            >
                              <TableCell className="text-xs font-medium text-slate-100">
                                {rule.role}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min={0}
                                  value={rule.loan_period_days ?? ''}
                                  onChange={(e) =>
                                    updateRuleField(
                                      rule.role,
                                      'loan_period_days',
                                      e.target.value
                                    )
                                  }
                                  className="h-8 w-24 bg-slate-950/60 border-slate-700/70 text-xs"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min={0}
                                  value={rule.borrow_limit ?? ''}
                                  onChange={(e) =>
                                    updateRuleField(
                                      rule.role,
                                      'borrow_limit',
                                      e.target.value
                                    )
                                  }
                                  className="h-8 w-24 bg-slate-950/60 border-slate-700/70 text-xs"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  value={rule.fine_amount_per_day ?? ''}
                                  onChange={(e) =>
                                    updateFineField(rule.role, e.target.value)
                                  }
                                  className="h-8 w-24 bg-slate-950/60 border-slate-700/70 text-xs"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min={0}
                                  value={rule.renewal_limit ?? ''}
                                  onChange={(e) =>
                                    updateRuleField(
                                      rule.role,
                                      'renewal_limit',
                                      e.target.value
                                    )
                                  }
                                  className="h-8 w-24 bg-slate-950/60 border-slate-700/70 text-xs"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {rulesMessage && (
                      <p className="text-xs text-slate-300">{rulesMessage}</p>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="border-slate-800 bg-slate-900/80">
                    <CardHeader>
                      <CardTitle className="text-sm">Global settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-100">
                            System maintenance mode
                          </p>
                          <p className="text-slate-500">
                            Temporarily disable patron-facing activity while
                            you perform maintenance.
                          </p>
                        </div>
                        <Switch
                          checked={settings?.maintenance_mode ?? false}
                          onCheckedChange={() =>
                            handleToggleSetting('maintenance_mode')
                          }
                          disabled={settingsSaving}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-100">
                            Allow self-registration
                          </p>
                          <p className="text-slate-500">
                            Permit new patrons to create accounts without staff
                            intervention.
                          </p>
                        </div>
                        <Switch
                          checked={settings?.allow_self_registration ?? false}
                          onCheckedChange={() =>
                            handleToggleSetting('allow_self_registration')
                          }
                          disabled={settingsSaving}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-800 bg-slate-900/80">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        Fine & fees overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p className="text-slate-400">
                        Total unpaid fines across the collection:
                      </p>
                      <p className="text-2xl font-semibold text-emerald-300">
                        {totalUnpaidFines != null
                          ? `$${totalUnpaidFines.toFixed(2)}`
                          : '—'}
                      </p>
                      <p className="text-slate-500">
                        Use this to monitor outstanding balances and plan
                        outreach.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Audit log feed */}
              <Card className="border-slate-800 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-sm">
                    Recent configuration changes
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-72 space-y-3 overflow-y-auto text-xs">
                  {auditLogs.length === 0 ? (
                    <p className="text-slate-500">
                      No configuration changes have been recorded yet.
                    </p>
                  ) : (
                    auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-2.5"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-slate-100">
                            {log.actor || 'System'}
                          </p>
                          <p className="text-slate-300">
                            {log.action || 'Updated settings'}
                          </p>
                          {log.details && (
                            <p className="text-[11px] text-slate-500">
                              {log.details}
                            </p>
                          )}
                        </div>
                        <p className="whitespace-nowrap text-[11px] text-slate-500">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
