import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks/useLogout";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LogoutButtonProps {
  onLogout?: () => void;
}

/**
 * Przycisk umożliwiający wylogowanie użytkownika
 */
const LogoutButton: FC<LogoutButtonProps> = ({ onLogout }) => {
  const { logout, isLoggingOut, error } = useLogout();

  const handleLogout = async () => {
    const success = await logout();
    if (success && onLogout) {
      onLogout();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Wylogowanie</h2>
      
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Kliknij przycisk poniżej, aby wylogować się z systemu.
      </p>

      {error && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        variant="outline" 
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full"
      >
        {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
      </Button>
    </div>
  );
};

export default LogoutButton; 