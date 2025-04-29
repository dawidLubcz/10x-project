import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useFlashcardStatistics } from "../../lib/hooks/useFlashcardStatistics";

const StatisticItem: React.FC<{
  label: string;
  value: number | string;
  loading: boolean;
}> = ({ label, value, loading }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    {loading ? (
      <Skeleton className="h-8 w-16" />
    ) : (
      <p className="text-2xl font-bold text-foreground">{value}</p>
    )}
  </div>
);

const StatisticsCard: React.FC = () => {
  const { statistics, loading, error } = useFlashcardStatistics();

  return (
    <Card className="bg-card border-zinc-200 dark:border-zinc-800">
      <CardHeader className="bg-card">
        <CardTitle className="text-xl text-card-foreground">Twoje statystyki</CardTitle>
      </CardHeader>
      <CardContent className="bg-card">
        {error ? (
          <div className="flex items-center space-x-2 text-destructive p-4 rounded-md bg-destructive/10">
            <AlertCircle className="h-5 w-5" />
            <p>Wystąpił błąd podczas pobierania statystyk</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm underline ml-2"
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