import { pageSchema } from "@utils/api-response.utils";
import { z } from "zod";

/** GET /vocabulary/search: one row per word, meaning in the request language */
export const VocabularySearchItemSchema = z.object({
  id: z.number(),
  wordJp: z.string(),
  reading: z.string(),
  meaning: z.string(),
});
export type IVocabularySearchItem = z.infer<typeof VocabularySearchItemSchema>;

export const VocabularySearchPageSchema = pageSchema(VocabularySearchItemSchema);

/** GET /vocabulary/search/:id */
export const VocabularyDetailSchema = z.object({
  id: z.number(),
  wordJp: z.string(),
  reading: z.string(),
  audioUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  levelN: z.number().nullable(),
  wordType: z.string().nullable(),
  kanjiMeaning: z.string(),
  meanings: z.array(
    z.object({
      id: z.number(),
      meaning: z.string(),
      exampleSentenceJp: z.string().nullable(),
      exampleSentence: z.string().nullable(),
      // Translated word-type name of this meaning, null when it has none
      wordType: z.string().nullish(),
    }),
  ),
  relatedWords: z.array(VocabularySearchItemSchema),
});
export type IVocabularyDetail = z.infer<typeof VocabularyDetailSchema>;

/** GET /vocabulary/search-history (current user) */
export const SearchHistoryItemSchema = z.object({
  id: z.number(),
  searchKeyword: z.string(),
  createdAt: z.string(),
});
export type ISearchHistoryItem = z.infer<typeof SearchHistoryItemSchema>;

export const SearchHistoryPageSchema = pageSchema(SearchHistoryItemSchema);
