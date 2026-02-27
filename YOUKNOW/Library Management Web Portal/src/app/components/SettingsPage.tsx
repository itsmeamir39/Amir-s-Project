import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Save, 
  Clock, 
  BookOpen, 
  DollarSign, 
  Settings as SettingsIcon, 
  Database,
  Bell,
  Shield,
  Download,
  Upload
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [loanSettings, setLoanSettings] = useState({
    standardPeriod: "14",
    premiumPeriod: "21",
    studentPeriod: "14",
    seniorPeriod: "21",
  });

  const [borrowLimits, setBorrowLimits] = useState({
    standard: "2",
    premium: "5",
    student: "3",
    senior: "3",
  });

  const [fineSettings, setFineSettings] = useState({
    dailyFineAmount: "1.00",
    maxFineAmount: "50.00",
    gracePeriodDays: "2",
  });

  const [systemSettings, setSystemSettings] = useState({
    libraryName: "LibraryHub",
    libraryEmail: "admin@library.com",
    libraryPhone: "+1 (555) 000-0000",
    operatingHours: "9:00 AM - 8:00 PM",
  });

  const [notifications, setNotifications] = useState({
    dueDateReminders: true,
    overdueNotices: true,
    newBookAlerts: false,
    systemUpdates: true,
  });

  const handleSaveLoanSettings = () => {
    console.log("Saving loan settings:", loanSettings);
    // Show success message
  };

  const handleSaveBorrowLimits = () => {
    console.log("Saving borrow limits:", borrowLimits);
    // Show success message
  };

  const handleSaveFineSettings = () => {
    console.log("Saving fine settings:", fineSettings);
    // Show success message
  };

  const handleSaveSystemSettings = () => {
    console.log("Saving system settings:", systemSettings);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure library policies and system preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="loan-periods" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="loan-periods" className="gap-2">
            <Clock className="w-4 h-4" />
            Loan Periods
          </TabsTrigger>
          <TabsTrigger value="borrow-limits" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Borrow Limits
          </TabsTrigger>
          <TabsTrigger value="fine-management" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Fine Management
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="w-4 h-4" />
            Backup & Recovery
          </TabsTrigger>
        </TabsList>

        {/* Loan Periods Tab */}
        <TabsContent value="loan-periods" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Configure Loan Periods</CardTitle>
              <CardDescription>
                Set borrowing duration for different membership types (in days)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="standard-period">Standard Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="standard-period"
                        type="number"
                        value={loanSettings.standardPeriod}
                        onChange={(e) => setLoanSettings({ ...loanSettings, standardPeriod: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 14 days</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premium-period">Premium Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="premium-period"
                        type="number"
                        value={loanSettings.premiumPeriod}
                        onChange={(e) => setLoanSettings({ ...loanSettings, premiumPeriod: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 21 days</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-period">Student Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="student-period"
                        type="number"
                        value={loanSettings.studentPeriod}
                        onChange={(e) => setLoanSettings({ ...loanSettings, studentPeriod: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 14 days</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senior-period">Senior Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="senior-period"
                        type="number"
                        value={loanSettings.seniorPeriod}
                        onChange={(e) => setLoanSettings({ ...loanSettings, seniorPeriod: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 21 days</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveLoanSettings} className="bg-accent hover:bg-accent/90 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Loan Settings */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Renewal & Extension Policies</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Book Renewals</Label>
                    <p className="text-sm text-muted-foreground">Members can extend their loan period</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Maximum Renewals</Label>
                    <p className="text-sm text-muted-foreground">Number of times a book can be renewed</p>
                  </div>
                  <Select defaultValue="2">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 time</SelectItem>
                      <SelectItem value="2">2 times</SelectItem>
                      <SelectItem value="3">3 times</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borrow Limits Tab */}
        <TabsContent value="borrow-limits" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Maximum Books Per User</CardTitle>
              <CardDescription>
                Set the maximum number of books each membership type can borrow simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="standard-limit">Standard Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="standard-limit"
                        type="number"
                        value={borrowLimits.standard}
                        onChange={(e) => setBorrowLimits({ ...borrowLimits, standard: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">books</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 2 books</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premium-limit">Premium Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="premium-limit"
                        type="number"
                        value={borrowLimits.premium}
                        onChange={(e) => setBorrowLimits({ ...borrowLimits, premium: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">books</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 5 books</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-limit">Student Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="student-limit"
                        type="number"
                        value={borrowLimits.student}
                        onChange={(e) => setBorrowLimits({ ...borrowLimits, student: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">books</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 3 books</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senior-limit">Senior Membership</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="senior-limit"
                        type="number"
                        value={borrowLimits.senior}
                        onChange={(e) => setBorrowLimits({ ...borrowLimits, senior: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">books</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Default: 3 books</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveBorrowLimits} className="bg-accent hover:bg-accent/90 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reservation Settings */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Reservation Policies</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Book Reservations</Label>
                    <p className="text-sm text-muted-foreground">Members can reserve checked-out books</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reservation-hold">Reservation Hold Period</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="reservation-hold"
                      type="number"
                      defaultValue="3"
                      className="w-[100px]"
                    />
                    <span className="text-sm text-muted-foreground">days to pickup after availability</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fine Management Tab */}
        <TabsContent value="fine-management" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Fine Configuration</CardTitle>
              <CardDescription>
                Set daily fine amounts and maximum limits for overdue books
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="daily-fine">Daily Fine Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        id="daily-fine"
                        type="number"
                        step="0.01"
                        value={fineSettings.dailyFineAmount}
                        onChange={(e) => setFineSettings({ ...fineSettings, dailyFineAmount: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">per day</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Charged for each day a book is overdue</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-fine">Maximum Fine Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        id="max-fine"
                        type="number"
                        step="0.01"
                        value={fineSettings.maxFineAmount}
                        onChange={(e) => setFineSettings({ ...fineSettings, maxFineAmount: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">total</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Maximum fine per book regardless of days overdue</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grace-period">Grace Period</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="grace-period"
                        type="number"
                        value={fineSettings.gracePeriodDays}
                        onChange={(e) => setFineSettings({ ...fineSettings, gracePeriodDays: e.target.value })}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Days before fines start accumulating</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveFineSettings} className="bg-accent hover:bg-accent/90 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fine Payment Settings */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Fine Payment Policies</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Calculate Fines</Label>
                    <p className="text-sm text-muted-foreground">Automatically calculate fines for overdue books</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Block Checkouts on Outstanding Fines</Label>
                    <p className="text-sm text-muted-foreground">Prevent borrowing with unpaid fines over threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fine-threshold">Fine Threshold for Blocking</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <Input
                      id="fine-threshold"
                      type="number"
                      step="0.01"
                      defaultValue="10.00"
                      className="w-[120px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Send Overdue Reminders</Label>
                    <p className="text-sm text-muted-foreground">Email notifications for overdue books</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Configuration Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Library Information</CardTitle>
              <CardDescription>
                Basic library details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="library-name">Library Name</Label>
                    <Input
                      id="library-name"
                      value={systemSettings.libraryName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, libraryName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="library-email">Library Email</Label>
                    <Input
                      id="library-email"
                      type="email"
                      value={systemSettings.libraryEmail}
                      onChange={(e) => setSystemSettings({ ...systemSettings, libraryEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="library-phone">Phone Number</Label>
                    <Input
                      id="library-phone"
                      value={systemSettings.libraryPhone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, libraryPhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="operating-hours">Operating Hours</Label>
                    <Input
                      id="operating-hours"
                      value={systemSettings.operatingHours}
                      onChange={(e) => setSystemSettings({ ...systemSettings, operatingHours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveSystemSettings} className="bg-accent hover:bg-accent/90 text-white gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Due Date Reminders</Label>
                    <p className="text-sm text-muted-foreground">Notify members 2 days before due date</p>
                  </div>
                  <Switch 
                    checked={notifications.dueDateReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, dueDateReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Overdue Notices</Label>
                    <p className="text-sm text-muted-foreground">Send notifications for overdue books</p>
                  </div>
                  <Switch 
                    checked={notifications.overdueNotices}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, overdueNotices: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>New Book Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notify members about new acquisitions</p>
                  </div>
                  <Switch 
                    checked={notifications.newBookAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newBookAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications about system maintenance</p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Logout</Label>
                    <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="session-timeout"
                      type="number"
                      defaultValue="30"
                      className="w-[100px]"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Tab */}
        <TabsContent value="backup" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Data Backup</CardTitle>
              <CardDescription>
                Manage your library database backups and recovery options
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Last Backup</Label>
                  <p className="text-sm text-muted-foreground">February 27, 2026 at 3:00 AM</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
                    <Download className="w-4 h-4" />
                    Create Backup Now
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Restore from Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup History */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-xl">Recent Backups</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { date: "Feb 27, 2026 - 3:00 AM", size: "245 MB", status: "Success" },
                  { date: "Feb 26, 2026 - 3:00 AM", size: "243 MB", status: "Success" },
                  { date: "Feb 25, 2026 - 3:00 AM", size: "241 MB", status: "Success" },
                  { date: "Feb 24, 2026 - 3:00 AM", size: "239 MB", status: "Success" },
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{backup.date}</p>
                        <p className="text-xs text-muted-foreground">{backup.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {backup.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card className="border-border border-destructive/50 bg-destructive/5">
            <CardHeader className="border-b border-destructive/20">
              <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Export All Data</Label>
                    <p className="text-sm text-muted-foreground">Download complete database in CSV format</p>
                  </div>
                  <Button variant="outline">Export Data</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-destructive">Reset System</Label>
                    <p className="text-sm text-muted-foreground">Clear all data and restore to factory settings</p>
                  </div>
                  <Button variant="destructive">Reset</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
