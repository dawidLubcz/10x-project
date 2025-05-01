import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAccountDeletion } from "@/lib/hooks/useAccountDeletion";

interface DeleteAccountSectionProps {
  onAccountDeleted?: () => void;
}

const CONFIRMATION_TEXT = "USUŃ";

/**
 * Sekcja umożliwiająca usunięcie konta użytkownika
 */
const DeleteAccountSection: FC<DeleteAccountSectionProps> = ({ onAccountDeleted }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const { 
    deleteAccount, 
    isSubmitting, 
    error, 
    showConfirmation, 
    openConfirmation, 
    closeConfirmation 
  } = useAccountDeletion();

  // Walidacja tekstu potwierdzającego
  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT;

  // Obsługa usuwania konta
  const handleDeleteAccount = async () => {
    if (!isConfirmationValid) return;
    
    const success = await deleteAccount({ confirmationText });
    
    if (success && onAccountDeleted) {
      onAccountDeleted();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Usunięcie konta</h2>
      
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        Usunięcie konta spowoduje trwałe usunięcie wszystkich Twoich danych, w tym fiszek i postępów nauki.
        Ta operacja jest nieodwracalna.
      </p>

      {error && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        variant="destructive" 
        onClick={openConfirmation}
        className="w-full"
      >
        Usuń konto
      </Button>

      <Dialog open={showConfirmation} onOpenChange={closeConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Potwierdź usunięcie konta</DialogTitle>
            <DialogDescription>
              Ta operacja jest <span className="font-bold">nieodwracalna</span>. Wszystkie Twoje dane zostaną trwale usunięte.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
              Aby potwierdzić usunięcie konta, wpisz tekst "{CONFIRMATION_TEXT}" w polu poniżej:
            </p>
            
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Wpisz ${CONFIRMATION_TEXT}`}
              className={`border ${!isConfirmationValid && confirmationText ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
            />
            
            {!isConfirmationValid && confirmationText && (
              <p className="text-sm text-red-500 mt-1">
                Wpisany tekst nie jest poprawny.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={closeConfirmation}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={!isConfirmationValid || isSubmitting}
            >
              {isSubmitting ? "Usuwanie..." : "Potwierdzam usunięcie konta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAccountSection; 