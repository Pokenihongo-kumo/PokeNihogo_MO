import { describe, expect, it } from "@jest/globals";
import { SearchHistoryPageSchema, VocabularyDetailSchema, VocabularySearchPageSchema } from "./dictionary.response";

const pagination = { current: 1, pageSize: 10, totalPage: 1, totalItem: 1 };

// Shapes as serialized by the backend (VocabularySearchResSchema, VocabularyDetailResSchema)
describe("dictionary models", () => {
  it("parses search rows", () => {
    const page = VocabularySearchPageSchema.parse({
      results: [{ id: 7, wordJp: "猫", reading: "ねこ", meaning: "con mèo" }],
      pagination,
    });

    expect(page.results[0].meaning).toBe("con mèo");
  });

  it("parses word details with nullable media and per-meaning word type", () => {
    const detail = VocabularyDetailSchema.parse({
      id: 7,
      wordJp: "猫",
      reading: "ねこ",
      audioUrl: null,
      imageUrl: null,
      levelN: 5,
      wordType: "Danh từ",
      kanjiMeaning: "MIÊU",
      meanings: [
        { id: 3, meaning: "con mèo", exampleSentenceJp: null, exampleSentence: null, wordType: null },
        { id: 4, meaning: "mèo nhà", exampleSentenceJp: "猫がいる", exampleSentence: "Có con mèo" },
      ],
      relatedWords: [{ id: 9, wordJp: "子猫", reading: "こねこ", meaning: "mèo con" }],
    });

    expect(detail.meanings).toHaveLength(2);
    expect(detail.relatedWords[0].wordJp).toBe("子猫");
  });

  it("rejects details without the fields the screen renders", () => {
    expect(() => VocabularyDetailSchema.parse({ id: 7, wordJp: "猫" })).toThrow();
  });

  it("parses search history", () => {
    const page = SearchHistoryPageSchema.parse({
      results: [{ id: 1, searchKeyword: "ねこ", createdAt: "2026-11-05T00:00:00.000Z" }],
      pagination,
    });

    expect(page.results[0].searchKeyword).toBe("ねこ");
  });
});
