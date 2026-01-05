
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from "../types";

export const scoreLeadWithAI = async (lead: Lead): Promise<{ score: number; summary: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the following CRM lead and provide a score (0-100) and a brief strategic summary.
      Name: ${lead.name}
      Company: ${lead.company}
      Deal Value: $${lead.value}
      Current Stage: ${lead.stage}
      Notes: ${lead.notes}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Probability score of closing the deal, 0 to 100.',
            },
            summary: {
              type: Type.STRING,
              description: 'A 1-2 sentence recommendation or summary.',
            },
          },
          required: ["score", "summary"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      score: result.score || 50,
      summary: result.summary || "Unable to generate summary at this time."
    };
  } catch (error) {
    console.error("AI Scoring Error:", error);
    return {
      score: 50,
      summary: "AI evaluation unavailable."
    };
  }
};
