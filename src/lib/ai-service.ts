/**
 * AI Service for Hugging Face Inference API
 * Updated to use the new OpenAI-compatible router endpoint as of 2026.
 */

const HF_MODEL = "meta-llama/Llama-3.1-8B-Instruct";
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

export async function callHuggingFace(prompt: string, maxTokens: number = 400) {
    const apiKey = process.env.HF_API_KEY?.trim();

    if (!apiKey) {
        console.error("[AI-Service] HF_API_KEY is missing from environment variables.");
        throw new Error("AI service configuration error: Missing API Key.");
    }

    // Set a 15-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        console.log(`[AI-Service] Calling Unified Router with model: ${HF_MODEL}`);
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: HF_MODEL,
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: maxTokens,
                temperature: 0.7,
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorMsg = "AI service temporarily unavailable.";
            try {
                const hfError = await response.json();
                console.error("Hugging Face API Error Response:", hfError);

                if (response.status === 429) {
                    errorMsg = "AI rate limit reached. Please try again in a few minutes.";
                } else if (response.status === 503) {
                    errorMsg = "AI model is currently waking up. Please retry in 20-30 seconds.";
                } else {
                    errorMsg = `HF API Error (${response.status}): ${hfError.error?.message || hfError.error || JSON.stringify(hfError)}`;
                }
            } catch (e) {
                console.error("Failed to parse HF error:", e);
                errorMsg = `Internal AI service error (Status ${response.status})`;
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();

        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content.trim();
        }

        console.error("[AI-Service] Unexpected response data format:", data);
        throw new Error("Received empty or malformed response from AI.");
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error("[AI-Service] HF API Call Timed Out");
            throw new Error("AI response timed out. The service might be under heavy load.");
        }
        console.error("[AI-Service] Root Error:", error.message);
        throw error;
    }
}
