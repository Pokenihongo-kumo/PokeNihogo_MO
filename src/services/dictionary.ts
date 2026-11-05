import { axiosPrivate } from "@configs/axios";
import {
  SearchHistoryPageSchema,
  VocabularyDetailSchema,
  VocabularySearchPageSchema,
} from "@models/dictionary/dictionary.response";
import { toApiResult } from "@utils/api-response.utils";

// Dictionary search params
interface DictionarySearchParams {
  query: string;
  currentPage?: number;
  pageSize?: number;
}

// Search row as the dictionary screen renders it
interface DictionaryResult {
  id: string;
  word: string;
  reading?: string;
  romaji?: string;
  meaning: string;
  type?: string;
}

const dictionaryService = {
  // Search vocabulary by keyword (Japanese, reading or meaning)
  search: async (params: DictionarySearchParams) => {
    const { query, currentPage = 1, pageSize = 10 } = params;

    const response = await axiosPrivate.get("/vocabulary/search", {
      params: {
        keyword: query,
        currentPage,
        pageSize,
      },
    });
    const result = toApiResult(response, VocabularySearchPageSchema);

    // Map API rows to DictionaryResult format
    const results: DictionaryResult[] = result.data.results.map((item) => ({
      id: item.id.toString(),
      word: item.wordJp,
      reading: item.reading,
      meaning: item.meaning,
    }));

    return { ...result, data: { results, pagination: result.data.pagination } };
  },

  // Get word details by ID
  getWordDetails: async (wordId: string) => {
    const response = await axiosPrivate.get(`/vocabulary/search/${wordId}`);
    return toApiResult(response, VocabularyDetailSchema);
  },

  // Get search history from server
  getSearchHistory: async (params?: { currentPage?: number; pageSize?: number }) => {
    const { currentPage = 1, pageSize = 20 } = params || {};

    const response = await axiosPrivate.get("/vocabulary/search-history", {
      params: {
        currentPage,
        pageSize,
      },
    });
    return toApiResult(response, SearchHistoryPageSchema);
  },
};

export default dictionaryService;
export type { DictionarySearchParams, DictionaryResult };
