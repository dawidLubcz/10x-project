import { type FC } from "react";
import { useProfile } from "../../lib/hooks/useProfile";
import UserInfo from "../UserInfo";

/**
 * Komponent-kontener, który pobiera dane profilu i przekazuje je do komponentu prezentacyjnego
 */
const UserInfoContainer: FC = () => {
  const { profile, isLoading, error } = useProfile();
  
  return <UserInfo user={profile} isLoading={isLoading} />;
};

export default UserInfoContainer; 