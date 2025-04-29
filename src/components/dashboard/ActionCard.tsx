import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import type { ActionCardProps } from "../../lib/types/dashboard";

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, linkTo, variant = 'default' }) => {
  const variantClasses = {
    default: "hover:border-primary/40",
    primary: "border-primary/40 hover:border-primary",
    secondary: "border-secondary/40 hover:border-secondary"
  };

  const getIconElement = () => {
    // Prosta implementacja ikony jako div z tekstem
    return (
      <div className={`p-2 rounded-full flex items-center justify-center ${
        variant === 'primary' 
          ? 'bg-primary text-primary-foreground' 
          : variant === 'secondary'
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-muted'
      }`}>
        <span className="w-6 h-6 flex items-center justify-center">{icon.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full transition-all hover:shadow-md ${variantClasses[variant]}`}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {getIconElement()}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Możliwa dodatkowa zawartość */}
      </CardContent>
      <CardFooter>
        <Button asChild variant={variant === 'default' ? 'outline' : variant === 'primary' ? 'default' : 'secondary'} className="w-full">
          <a href={linkTo}>Przejdź</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActionCard; 