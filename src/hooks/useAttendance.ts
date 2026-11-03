import { useAuth } from "@hooks/useAuth";
import attendanceService from "@services/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch attendance summary
 */
export const useAttendanceSummary = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["attendance-summary", user?.data?.id],
    queryFn: attendanceService.getAttendanceSummary,
    select: (result) => result.data,
    enabled: !!user?.data?.id,
  });
};

/**
 * Hook to check in for attendance
 */
export const useCheckIn = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-summary", user?.data?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["wallet-user"] });
    },
  });
};

/**
 * Hook to fetch attendance configuration (coin rewards per day)
 */
export const useAttendanceConfig = () => {
  return useQuery({
    queryKey: ["attendance-config"],
    queryFn: attendanceService.getAttendanceConfig,
    select: (result) => result.data.results,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since config rarely changes
  });
};
