import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import type { AuthTabsProps } from './types';

export function AuthTabs({ defaultTab = "login" }: AuthTabsProps) {
  const handleSuccess = () => {
    // In a real application, we would redirect to the dashboard or homepage
    window.location.href = '/';
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