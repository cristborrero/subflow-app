import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import {
  Sun,
  Moon,
  Bell,
  ShieldCheck,
  LayoutDashboard,
  Users,
  Settings,
  Lock,
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      alert('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize your SubFlow experience
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {/* Appearance */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-500/20 text-primary-500 rounded-lg flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Theme
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
              </div>
              <Switch
                defaultChecked={true}
                // onCheckedChange={setDarkMode}
              />
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Auto-switch based on system
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically switch between light and dark mode based on your
                    device settings
                  </p>
                </div>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Payment reminders
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified before subscription payments
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Security alerts
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts for suspicious activity
                  </p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Monthly reports
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive spending summary via email
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Profile</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                  </div>
                  <div className="flex gap-3 max-w-sm">
                    <Input 
                      placeholder="Full Name" 
                      value={fullName} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} 
                    />
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdatingProfile || fullName === (user?.user_metadata?.full_name || '')}
                    >
                      {isUpdatingProfile ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Data & Privacy
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Export data, delete account, manage permissions
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Change Password</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                  </div>
                  <div className="space-y-3 max-w-sm">
                    <Input 
                      type="password" 
                      placeholder="New Password" 
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <Input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    />
                    <Button 
                      onClick={handleUpdatePassword} 
                      disabled={isUpdatingPassword || !password || !confirmPassword}
                    >
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            These actions are permanent and cannot be undone.
          </p>
          <Button variant="destructive" className="w-full">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
