import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../pages/lib/api";

const useAuthUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,            
    staleTime: 5 * 60 * 1000, 
    select: (data) => data?.user
  });

  return {
    authUser: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useAuthUser;
