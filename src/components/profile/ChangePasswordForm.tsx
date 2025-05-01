import { useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useId } from "react";

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

/**
 * Formularz umożliwiający zmianę hasła użytkownika
 */
const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ onSuccess }) => {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState<PasswordChangeRequest>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Walidacja pola formularza
  const validateField = (name: keyof PasswordChangeRequest, value: string) => {
    let fieldError = "";

    switch (name) {
      case "currentPassword":
        if (!value) fieldError = "Aktualne hasło jest wymagane";
        break;
      case "newPassword":
        if (!value) {
          fieldError = "Nowe hasło jest wymagane";
        } else if (value.length < 6) {
          fieldError = "Hasło musi mieć co najmniej 6 znaków";
        }
        break;
      case "confirmNewPassword":
        if (!value) {
          fieldError = "Potwierdzenie hasła jest wymagane";
        } else if (value !== formData.newPassword) {
          fieldError = "Hasła nie są identyczne";
        }
        break;
    }

    return fieldError;
  };

  // Obsługa zmiany pola formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Walidacja pola w czasie rzeczywistym
    const fieldError = validateField(name as keyof PasswordChangeRequest, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    // Jeśli zmieniamy nowe hasło, sprawdzamy też potwierdzenie hasła
    if (name === "newPassword" && formData.confirmNewPassword) {
      const confirmError = value !== formData.confirmNewPassword ? "Hasła nie są identyczne" : "";
      setErrors(prev => ({
        ...prev,
        confirmNewPassword: confirmError
      }));
    }
  };

  // Walidacja całego formularza
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Sprawdzenie wszystkich pól
    Object.entries(formData).forEach(([key, value]) => {
      const fieldName = key as keyof PasswordChangeRequest;
      const fieldError = validateField(fieldName, value);
      
      if (fieldError) {
        newErrors[key] = fieldError;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Wysłanie formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Nie udało się zmienić hasła');
      }
      
      // Sukces
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Zmiana hasła</h2>
      
      {success && (
        <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <AlertDescription className="text-green-700 dark:text-green-300">
            Hasło zostało pomyślnie zmienione.
          </AlertDescription>
        </Alert>
      )}
      
      {submitError && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {submitError}
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={currentPasswordId} className="text-zinc-900 dark:text-zinc-50">
            Aktualne hasło
          </Label>
          <Input
            id={currentPasswordId}
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Aktualne hasło"
            className={`border ${errors.currentPassword ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
            disabled={isSubmitting}
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-500">{errors.currentPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={newPasswordId} className="text-zinc-900 dark:text-zinc-50">
            Nowe hasło
          </Label>
          <Input
            id={newPasswordId}
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nowe hasło"
            className={`border ${errors.newPassword ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
            disabled={isSubmitting}
          />
          {errors.newPassword && (
            <p className="text-sm text-red-500">{errors.newPassword}</p>
          )}
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Hasło musi mieć co najmniej 6 znaków.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={confirmPasswordId} className="text-zinc-900 dark:text-zinc-50">
            Potwierdź nowe hasło
          </Label>
          <Input
            id={confirmPasswordId}
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            placeholder="Potwierdź nowe hasło"
            className={`border ${errors.confirmNewPassword ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
            disabled={isSubmitting}
          />
          {errors.confirmNewPassword && (
            <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Zmieniam hasło..." : "Zmień hasło"}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm; 