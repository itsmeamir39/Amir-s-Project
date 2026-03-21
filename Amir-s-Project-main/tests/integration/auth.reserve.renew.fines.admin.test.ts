import { describe, expect, it, vi } from "vitest";

import { getCurrentUser, getUserRole } from "@/services/auth";
import { reserveIfAllowed } from "@/services/catalog";
import { renewLoan } from "@/services/loans";
import { requestFinePayment } from "@/services/fines";
import { PUT as updateAdminSettings } from "@/app/api/admin/settings/route";

function makeBuilder(result: { data?: unknown; error?: { message: string } | null }) {
  const builder: any = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    or: vi.fn(() => builder),
    in: vi.fn(() => builder),
    lt: vi.fn(() => builder),
    limit: vi.fn(async () => result),
    order: vi.fn(async () => result),
    maybeSingle: vi.fn(async () => result),
    single: vi.fn(async () => result),
    insert: vi.fn(async () => result),
    update: vi.fn(() => builder),
    upsert: vi.fn(async () => result),
  };
  return builder;
}

vi.mock("@/lib/server-auth", () => ({
  requireRole: vi.fn(async () => ({
    ok: true,
    user: { id: "admin-1" },
    role: "Admin",
    supabase: {
      from: vi.fn((table: string) => {
        if (table === "circulation_rules") return makeBuilder({ data: [], error: null });
        if (table === "global_settings") return makeBuilder({ data: [], error: null });
        return makeBuilder({ data: [], error: null });
      }),
    },
  })),
}));

describe("integration journeys", () => {
  it("auth: resolves current user and role", async () => {
    const client: any = {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: { id: "u-1" } }, error: null })),
      },
      from: vi.fn(() => makeBuilder({ data: { role: "Patron" }, error: null })),
    };

    const user = await getCurrentUser(client);
    const role = await getUserRole(client, "u-1");

    expect(user?.id).toBe("u-1");
    expect(role).toBe("Patron");
  });

  it("reserve: inserts hold when user is eligible", async () => {
    const client: any = {
      from: vi.fn((table: string) => {
        if (table === "fines") return makeBuilder({ data: [{ amount: 2 }], error: null });
        if (table === "users") return makeBuilder({ data: { role: "Patron" }, error: null });
        if (table === "circulation_rules") {
          return makeBuilder({
            data: {
              role: "Patron",
              borrow_limit: 5,
              loan_period_days: 14,
              renewal_limit: 2,
              fine_amount_per_day: 0.25,
              max_fine_amount: 25,
              grace_period_days: 2,
            },
            error: null,
          });
        }
        if (table === "holds") {
          const holdsBuilder = makeBuilder({ data: [{ id: 1 }], error: null });
          holdsBuilder.insert = vi.fn(async () => ({ data: null, error: null }));
          return holdsBuilder;
        }
        return makeBuilder({ data: null, error: null });
      }),
    };

    await expect(reserveIfAllowed(client, "u-1", 10)).resolves.toBeUndefined();
  });

  it("renew: extends due date and increments renewals", async () => {
    const client: any = {
      from: vi.fn((table: string) => {
        if (table === "users") return makeBuilder({ data: { role: "Patron" }, error: null });
        if (table === "circulation_rules") {
          return makeBuilder({
            data: {
              role: "Patron",
              borrow_limit: 5,
              loan_period_days: 14,
              renewal_limit: 3,
              fine_amount_per_day: 0.25,
              max_fine_amount: 25,
              grace_period_days: 2,
            },
            error: null,
          });
        }
        if (table === "loans") {
          const builder = makeBuilder({ data: null, error: null });
          builder.update = vi.fn(() => builder);
          builder.eq = vi.fn(async () => ({ data: null, error: null }));
          return builder;
        }
        return makeBuilder({ data: null, error: null });
      }),
    };

    await expect(
      renewLoan(client, "u-1", {
        id: 11,
        user_id: "u-1",
        biblio_id: 22,
        borrowed_at: new Date().toISOString(),
        due_date: new Date().toISOString(),
        renewals_used: 1,
        status: "CheckedOut",
      })
    ).resolves.toBeUndefined();
  });

  it("pay: sends checkout request and parses success", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true, providerRef: "mockpay_1", eventId: "evt_1", status: "pending" }),
    }));

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await requestFinePayment(1);
    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("admin config: rejects invalid payload with 400", async () => {
    const req = new Request("http://localhost/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bad: true }),
    });

    const res = await updateAdminSettings(req);
    expect(res.status).toBe(400);
  });
});
