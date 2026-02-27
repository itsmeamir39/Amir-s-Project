'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminPage() {
  const supabase = createClientComponentClient<any>();
  
  // State for circulation rules
  const [rules, setRules] = useState<any[]>([
    { role: 'student', loan_period_days: 14, borrow_limit: 5, fine_amount_per_day: 0.50 },
    { role: 'teacher', loan_period_days: 30, borrow_limit: 10, fine_amount_per_day: 0.00 }
  ]);

  const [loading, setLoading] = useState(false);

  // Function to save rules to Supabase
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = rules.map((r) => ({
        role: r.role,
        loan_period_days: r.loan_period_days,
        borrow_limit: r.borrow_limit,
        fine_amount_per_day: r.fine_amount_per_day,
      }));

      // @ts-ignore
      const { error } = await supabase
        .from('circulation_rules')
        .upsert(payload, { onConflict: 'role' });

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (error: any) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Library Admin Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Circulation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-end border-b pb-4">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input value={rule.role} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium">Loan Days</label>
                  <Input 
                    type="number" 
                    value={rule.loan_period_days} 
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].loan_period_days = parseInt(e.target.value);
                      setRules(newRules);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Borrow Limit</label>
                  <Input 
                    type="number" 
                    value={rule.borrow_limit}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].borrow_limit = parseInt(e.target.value);
                      setRules(newRules);
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fine/Day ($)</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={rule.fine_amount_per_day}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].fine_amount_per_day = parseFloat(e.target.value);
                      setRules(newRules);
                    }}
                  />
                </div>
              </div>
            ))}
            
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full mt-4"
            >
              {loading ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
