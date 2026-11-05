import dictionaryService, { DictionarySearchParams } from "@services/dictionary";
import { useQuery } from "@tanstack/react-query";

// Search results are the same for everyone; search history is per user and is
// cleared on logout together with the rest of ["dictionary", ...] (clearUserCache)
export const dictionaryKeys = {
  all: ["dictionary"] as const,
  search: (params: DictionarySearchParams) => ["dictionary", "search", params] as const,
  word: (wordId: string | null) => ["dictionary", "word", wordId] as const,
  searchHistory: (params?: { currentPage?: number; pageSize?: number }) =>
    ["dictionary", "search-history", params] as const,
};

// Hook for dictionary search
export const useDictionarySearch = (params: DictionarySearchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: dictionaryKeys.search(params),
    queryFn: () => dictionaryService.search(params),
    select: (result) => result.data,
    enabled: enabled && !!params.query && params.query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for word details
export const useWordDetails = (wordId: string | null) => {
  return useQuery({
    queryKey: dictionaryKeys.word(wordId),
    queryFn: () => dictionaryService.getWordDetails(wordId!),
    select: (result) => result.data,
    enabled: !!wordId,
  });
};

// Hook for search history from server
export const useSearchHistory = (params?: { currentPage?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: dictionaryKeys.searchHistory(params),
    queryFn: () => dictionaryService.getSearchHistory(params),
    select: (result) => result.data,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
