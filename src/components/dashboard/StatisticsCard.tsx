import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useFlashcardStatistics } from "../../lib/hooks/useFlashcardStatistics";
import { Button } from "../ui/button";

const StatisticItem: React.FC<{
  label: string;
  value: number | string;
  loading: boolean;
}> = ({ label, value, loading }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground dark:text-zinc-400">{label}</p>
    {loading ? (
      <Skeleton className="h-8 w-16" />
    ) : (
      <p className="text-2xl font-bold text-foreground dark:text-zinc-100">{value}</p>
    )}
  </div>
);

const StatisticsCard: React.FC = () => {
  const { statistics, loading, error, refreshStatistics } = useFlashcardStatistics();

  return (
    <Card className="border-zinc-200 dark:border-zinc-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="dark:text-zinc-100">Twoje statystyki</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshStatistics}
          disabled={loading}
          className="h-8 px-2 flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Odśwież</span>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center space-x-2 text-destructive p-4 rounded-md bg-destructive/10 dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle className="h-5 w-5" />
            <p>Wystąpił błąd podczas pobierania statystyk</p>
            <button 
              onClick={refreshStatistics}
              className="text-sm underline ml-2 dark:text-red-300"
            >
              Odśwież
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatisticItem 
              label="Wszystkie fiszki" 
              value={statistics?.totalFlashcards ?? 0} 
              loading={loading} 
            />
            <StatisticItem 
              label="Wygenerowane przez AI" 
              value={statistics?.aiGeneratedFlashcards ?? 0} 
              loading={loading} 
            />
            <StatisticItem 
              label="Utworzone ręcznie" 
              value={statistics?.manualFlashcards ?? 0} 
              loading={loading} 
            />
            <StatisticItem 
              label="Do powtórzenia" 
              value={statistics?.flashcardsToReview ?? 0} 
              loading={loading} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 