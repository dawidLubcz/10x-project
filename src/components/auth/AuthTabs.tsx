import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { CheckCircle } from "lucide-react";
import type { AuthTabsProps } from './types';

type TabValue = "login" | "register";

export function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab as TabValue);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const handleLoginSuccess = () => {
    // Sprawdź, czy istnieje parametr redirect w URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    // Przekieruj do podanej ścieżki lub na stronę główną
    window.location.href = redirectPath || '/';
  };
  
  const handleRegistrationSuccess = () => {
    // Pokaż komunikat o sukcesie i zmień zakładkę na logowanie
    setRegistrationSuccess(true);
    setActiveTab("login");
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Logowanie</TabsTrigger>
        <TabsTrigger value="register">Rejestracja</TabsTrigger>
      </TabsList>
      
      {registrationSuccess && (
        <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">Rejestracja zakończona pomyślnie!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Twoje konto zostało utworzone. Możesz teraz się zalogować używając swoich danych.
          </AlertDescription>
        </Alert>
      )}
      
      <TabsContent value="login" className="mt-4">
        <LoginForm onSuccess={handleLoginSuccess} />
      </TabsContent>
      <TabsContent value="register" className="mt-4">
        <RegisterForm onSuccess={handleRegistrationSuccess} />
      </TabsContent>
    </Tabs>
  );
}

export default AuthTabs; 