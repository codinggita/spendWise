import { useState, useEffect } from 'react';
import { Moon, Sun, User, Trash2, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/context/ThemeContext';
import { CSVUploader } from '@/components/CSVUploader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { updateProfile, deleteAccount, clearError } from '@/store/slices/authSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(user?.monthlyBudget || 0);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setMonthlyBudget(user.monthlyBudget);
      setPreferredLanguage(user.preferredLanguage);
    }
  }, [user]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({ title: 'Theme updated', description: `Theme set to ${newTheme}` });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(
      updateProfile({
        name,
        monthlyBudget: Number(monthlyBudget),
        preferredLanguage: preferredLanguage as 'en' | 'hi',
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved successfully.',
      });
    } else {
      toast({
        title: 'Update failed',
        description: (result.payload as string) || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;

    const result = await dispatch(deleteAccount());
    if (deleteAccount.fulfilled.match(result)) {
      toast({
        title: 'Account deleted',
        description: 'Your account and data have been permanently removed.',
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: 'Deletion failed',
        description: (result.payload as string) || 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground font-['Lexend'] uppercase tracking-tight">
          Settings
        </h1>
        <p className="text-sm mt-2 text-muted-foreground font-['Public_Sans']">
          Customize your experience and manage your data
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-card border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg sm:text-xl font-bold text-primary font-['Lexend'] uppercase tracking-wider mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Details
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest font-['Lexend']">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neo-input w-full"
                placeholder="Priya Sharma"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest font-['Lexend']">
                Monthly Budget (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="neo-input w-full pl-8"
                  placeholder="50000"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest font-['Lexend']">
              Preferred Language
            </label>
            <div className="flex gap-4">
              {['en', 'hi'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreferredLanguage(lang as 'en' | 'hi')}
                  className={`flex-1 py-3 px-4 font-['Lexend'] font-bold uppercase tracking-wider transition-all border-2 border-black ${
                    preferredLanguage === lang
                      ? 'bg-tertiary text-tertiary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                      : 'bg-background text-foreground hover:bg-surface-high'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Hindi'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-btn bg-primary text-primary-foreground w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Appearance Section */}
      <div className="bg-card border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg sm:text-xl font-bold text-secondary font-['Lexend'] uppercase tracking-wider mb-6 flex items-center gap-2">
          <Sun className="h-5 w-5" />
          Appearance
        </h2>
        <div className="space-y-4">
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest font-['Lexend']">
            Theme Mode
          </label>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: User, label: 'System' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id as any)}
                className={`flex-1 min-w-[100px] py-3 px-4 border-2 border-black font-['Lexend'] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  theme === t.id
                    ? 'bg-secondary text-secondary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-background text-foreground hover:bg-surface-high'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Import Section */}
      <CSVUploader />

      {/* Danger Zone */}
      <div className="bg-card border-4 border-destructive p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-destructive/20">
        <h2 className="text-lg sm:text-xl font-bold text-destructive font-['Lexend'] uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground font-['Public_Sans'] mb-6">
          Irreversible actions. Please proceed with caution.
        </p>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-destructive/10 text-destructive border-2 border-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-['Lexend'] font-bold uppercase py-3 px-6 rounded-none">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </DialogTrigger>
          <DialogContent className="bg-background border-4 border-black text-foreground p-8 rounded-none max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-['Lexend'] uppercase text-destructive mb-4">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-['Public_Sans'] text-base leading-relaxed">
                This action cannot be undone. All your transactions, categories, and account data will be
                <span className="text-foreground font-bold"> permanently deleted</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest font-['Lexend']">
                Type <span className="text-destructive">DELETE</span> to confirm
              </p>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
                placeholder="DELETE"
                className="neo-input bg-background border-2 border-black text-foreground px-4 py-6 font-mono text-center text-xl tracking-[0.5em]"
              />
            </div>
            <DialogFooter className="sm:justify-start gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || loading}
                className={`flex-1 py-4 font-['Lexend'] font-bold uppercase tracking-wider transition-all border-2 border-black ${
                  deleteConfirm === 'DELETE'
                    ? 'bg-destructive text-destructive-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                {loading ? 'Deleting...' : 'Permanently Delete My Data'}
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 py-4 font-['Lexend'] font-bold uppercase border-2 border-black bg-surface text-foreground hover:bg-surface-high"
              >
                Cancel
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;