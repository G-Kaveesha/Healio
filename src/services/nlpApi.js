const NLP_API_BASE_URL = "http://192.168.8.146:8000";

export const NLP_CONFIDENCE_THRESHOLD = 0.60;

export async function predictEmotion(text) {
  const cleanedText = text?.trim();

  if (!cleanedText) {
    throw new Error("Text is required for emotion prediction.");
  }

  const response = await fetch(
    `${NLP_API_BASE_URL}/predict-emotion`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: cleanedText,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `NLP API request failed: ${response.status} ${errorText}`
    );
  }

  return await response.json();
}