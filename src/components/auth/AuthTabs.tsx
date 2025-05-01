import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { AuthTabsProps } from './types';

export function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const handleSuccess = () => {
    // Sprawdź, czy istnieje parametr redirect w URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    // Przekieruj do podanej ścieżki lub na stronę główną
    window.location.href = redirectPath || '/';
  };
  
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Logowanie</TabsTrigger>
        <TabsTrigger value="register">Rejestracja</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-4">
        <LoginForm onSuccess={handleSuccess} />
      </TabsContent>
      <TabsContent value="register" className="mt-4">
        <RegisterForm onSuccess={handleSuccess} />
      </TabsContent>
    </Tabs>
  );
}

export default AuthTabs; 