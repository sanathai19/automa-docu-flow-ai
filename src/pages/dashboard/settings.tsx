
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profileForm, setProfileForm] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Corporation",
    role: "Administrator"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    documentProcessed: true,
    weeklyReports: true,
    systemUpdates: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile settings saved successfully");
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profileForm.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileForm.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        value={profileForm.company} 
                        onChange={(e) => setProfileForm({...profileForm, company: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input 
                        id="role" 
                        value={profileForm.role} 
                        onChange={(e) => setProfileForm({...profileForm, role: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="mt-6 bg-purple-600 hover:bg-purple-700"
                  >
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to maintain account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input id="current_password" type="password" required />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <div className="h-px w-full bg-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input id="new_password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm Password</Label>
                      <Input id="confirm_password" type="password" required />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="mt-6 bg-purple-600 hover:bg-purple-700"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("Password updated successfully");
                    }}
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email_notifications" className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important events
                        </p>
                      </div>
                      <Switch 
                        id="email_notifications" 
                        checked={notificationSettings.emailNotifications} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})} 
                      />
                    </div>
                    <div className="h-px w-full bg-border" />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="document_processed" className="text-base">Document Processed</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when documents are processed
                        </p>
                      </div>
                      <Switch 
                        id="document_processed" 
                        checked={notificationSettings.documentProcessed} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, documentProcessed: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly_reports" className="text-base">Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly summary of document processing activity
                        </p>
                      </div>
                      <Switch 
                        id="weekly_reports" 
                        checked={notificationSettings.weeklyReports} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="system_updates" className="text-base">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about system updates and maintenance
                        </p>
                      </div>
                      <Switch 
                        id="system_updates" 
                        checked={notificationSettings.systemUpdates} 
                        onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemUpdates: checked})} 
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Save Notification Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Manage your API keys and access tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="api_key" 
                        value="••••••••••••••••••••••••••••••" 
                        readOnly 
                        className="font-mono"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => toast.success("API key copied to clipboard")}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Never share your API key. You can regenerate it if needed.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Access Tokens</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4">
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No access tokens created yet
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => toast.info("Token creation not implemented in MVP")}
                          >
                            Create Token
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Webhooks</Label>
                    <Card className="border shadow-none">
                      <CardContent className="p-4">
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No webhooks configured yet
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => toast.info("Webhook configuration not implemented in MVP")}
                          >
                            Configure Webhook
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
