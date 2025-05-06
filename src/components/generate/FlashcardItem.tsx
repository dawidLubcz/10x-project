import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Edit } from "lucide-react";
import type { FlashcardViewModel } from "../types/generateView";

interface FlashcardItemProps {
  flashcard: FlashcardViewModel;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
}

export const FlashcardItem = ({
  flashcard,
  onAccept,
  onReject,
  onEdit
}: FlashcardItemProps) => {
  const { front, back, status, isProcessing } = flashcard;

  // Define card state variant
  const getCardVariant = () => {
    switch (status) {
      case 'accepted':
        return "border-green-500 bg-green-50/50 dark:bg-green-900/10";
      case 'rejected':
        return "border-red-500 bg-red-50/50 dark:bg-red-900/10";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  const isPending = status !== 'accepted' && status !== 'rejected';

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden flex flex-row h-full bg-white dark:bg-gray-800 ${getCardVariant()} transition-all hover:shadow-md`}>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/70">
          <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{front}</p>
        </div>

        <div className="px-4 py-3 flex-grow">
          <p className="text-gray-700 dark:text-gray-300 text-sm italic">{back}</p>
        </div>

        {/* Status indicator at the bottom */}
        {status === 'accepted' && (
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-green-50/50 dark:bg-green-900/10">
            <p className="text-green-600 dark:text-green-500 text-xs flex items-center">
              <CheckCircle className="h-3 w-3 mr-1.5" />
              Zaakceptowana
            </p>
          </div>
        )}
        
        {status === 'rejected' && (
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-red-50/50 dark:bg-red-900/10">
            <p className="text-red-500 text-xs flex items-center">
              <XCircle className="h-3 w-3 mr-1.5" />
              Odrzucona
            </p>
          </div>
        )}
      </div>

      {/* Actions column */}
      {isPending && (
        <div className="flex-none w-14 flex flex-col border-l border-gray-100 dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 rounded-none text-green-600 dark:text-green-500 hover:text-green-700 hover:bg-green-50/70 dark:hover:bg-green-900/20 transition-colors"
            onClick={onAccept}
            disabled={isProcessing}
            title="Akceptuj"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 rounded-none border-y border-gray-100 dark:border-gray-700 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50/70 dark:hover:bg-blue-900/20 transition-colors"
            onClick={onEdit}
            disabled={isProcessing}
            title="Edytuj"
          >
            <Edit className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="flex-1 rounded-none text-red-500 hover:text-red-600 hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-colors"
            onClick={onReject}
            disabled={isProcessing}
            title="Odrzuć"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}; 