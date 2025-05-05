import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import type { ActionCardProps } from "../../lib/types/dashboard";

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo, 
  variant = 'default',
  disabled = false,
  tooltip
}) => {
  const variantClasses = {
    default: "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 hover:border-primary/40",
    primary: "bg-white border-primary/40 dark:bg-zinc-800 dark:border-primary/60 hover:border-primary",
    secondary: "bg-white border-secondary/40 dark:bg-zinc-800 dark:border-secondary/60 hover:border-secondary"
  };

  const getIconElement = () => {
    return (
      <div className={`p-2 rounded-full flex items-center justify-center ${
        variant === 'primary' 
          ? 'bg-primary text-primary-foreground' 
          : variant === 'secondary'
            ? 'bg-secondary text-secondary-foreground dark:text-white'
            : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
      }`}>
        <span className="w-6 h-6 flex items-center justify-center font-bold">{icon.charAt(0).toUpperCase()}</span>
      </div>
    );
  };

  const cardClassName = `flex flex-col h-full transition-all ${
    disabled ? "opacity-80 cursor-not-allowed" : "hover:shadow-md"
  } ${variantClasses[variant]}`;

  const renderButton = () => {
    const buttonVariant = variant === 'default' ? 'outline' : variant === 'primary' ? 'primary' : 'secondary';
    
    if (disabled) {
      return (
        <div className="relative group">
          <Button 
            variant={buttonVariant} 
            className="w-full cursor-not-allowed opacity-70 dark:border-zinc-700 dark:text-zinc-400 dark:bg-zinc-800" 
            disabled={true}
          >
            Przejdź
          </Button>
          {tooltip && (
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
              {tooltip}
            </span>
          )}
        </div>
      );
    }
    
    if (linkTo === null) {
      return (
        <div className="relative group w-full">
          <Button 
            variant={buttonVariant} 
            className="w-full cursor-not-allowed opacity-70 dark:border-zinc-700 dark:text-zinc-400 dark:bg-zinc-800"
            disabled
          >
            Niedostępne
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none z-10">
            Funkcjonalność niedostępna w MVP
          </span>
        </div>
      );
    }
    
    return (
      <div className="w-full">
        <a href={linkTo} className="w-full inline-block">
          <Button 
            variant={buttonVariant} 
            className={`w-full ${variant === 'default' ? 'dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-100' : variant === 'primary' ? 'dark:text-zinc-900' : 'dark:text-zinc-900'}`}
          >
            Przejdź
          </Button>
        </a>
      </div>
    );
  };

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {getIconElement()}
          <CardTitle className="text-zinc-900 dark:text-zinc-100">{title}</CardTitle>
        </div>
        <CardDescription className="dark:text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Możliwa dodatkowa zawartość */}
      </CardContent>
      <CardFooter>
        {renderButton()}
      </CardFooter>
    </Card>
  );
};

export default ActionCard; 