import { axiosPrivate } from "@configs/axios";
import { toApiResult } from "@utils/api-response.utils";
import { z } from "zod";

const geminiService = {
  /**
   * Get SRS review suggestions (Vocabulary/Grammar/Kanji)
   * @param limit - Number of suggestions to receive (default: 10)
   * @param useServiceAccount - Enable/disable Service Account. "true" = use Service Account, "false" = use API Key (default: false)
   */
  getSRSRecommendations: async (limit: number = 10, useServiceAccount: boolean = false) => {
    const formData = new FormData();
    formData.append("limit", limit.toString());
    formData.append("useServiceAccount", useServiceAccount.toString());

    return await axiosPrivate.post(`/gemini/recommendations/srs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Pronunciation check for one recorded line. The backend calls Gemini with its
   * own key (the app no longer ships one) and returns the model's JSON as is:
   * Overall, TranscribedText, MatchScore, Syllables.
   */
  assessPronunciation: async (params: { uri: string; mimeType: string; referenceText: string }) => {
    const formData = new FormData();
    formData.append("referenceText", params.referenceText);
    // React Native FormData takes a { uri, name, type } file descriptor
    formData.append("audio", {
      uri: params.uri,
      name: params.uri.split("/").pop() || "recording",
      type: params.mimeType,
    } as unknown as Blob);

    const response = await axiosPrivate.post("/gemini/pronunciation-assessment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return toApiResult(response, z.record(z.unknown()));
  },
};

export default geminiService;
