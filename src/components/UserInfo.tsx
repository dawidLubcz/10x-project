import { type FC } from "react";
import type { UserDto } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface UserInfoProps {
  user: UserDto | null;
  isLoading: boolean;
}

/**
 * Komponent wyświetlający podstawowe informacje o użytkowniku
 */
const UserInfo: FC<UserInfoProps> = ({ user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Informacje o profilu</h2>
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
        <p className="text-red-500">Nie udało się załadować danych profilu.</p>
      </div>
    );
  }

  // Formatowanie daty utworzenia konta
  const createdDate = new Date(user.created_at);
  const formattedDate = createdDate.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">Informacje o profilu</h2>
      <div className="space-y-3">
        <div className="flex flex-col">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Email</span>
          <span className="text-zinc-900 dark:text-zinc-50">{user.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Data utworzenia konta</span>
          <span className="text-zinc-900 dark:text-zinc-50">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 