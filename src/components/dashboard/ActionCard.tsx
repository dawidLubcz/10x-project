import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import type { ActionCardProps } from "../../lib/types/dashboard";

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, linkTo, variant = 'default' }) => {
  const variantClasses = {
    default: "border-zinc-200 dark:border-zinc-800 hover:border-primary/40",
    primary: "border-primary/40 hover:border-primary",
    secondary: "border-secondary/40 hover:border-secondary"
  };

  const getIconElement = () => {
    return (
      <div className={`p-2 rounded-full flex items-center justify-center ${
        variant === 'primary' 
          ? 'bg-primary text-primary-foreground' 
          : variant === 'secondary'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
      }`}>
        <span className="w-6 h-6 flex items-center justify-center font-bold">{icon.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full transition-all hover:shadow-md ${variantClasses[variant]}`}>
      <CardHeader className="bg-card text-card-foreground">
        <div className="flex items-center space-x-2">
          {getIconElement()}
          <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Możliwa dodatkowa zawartość */}
      </CardContent>
      <CardFooter className="bg-card">
        <Button asChild variant={variant === 'default' ? 'outline' : variant === 'primary' ? 'default' : 'secondary'} className="w-full">
          <a href={linkTo}>Przejdź</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionCard; 