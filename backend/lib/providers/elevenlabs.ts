import { createProviderError, type ProviderClient, type ProviderResult } from "./types";

interface ElevenLabsInput {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
}

interface ElevenLabsOutput {
  audioUrl: string;
  durationMs: number;
}

export const elevenlabsClient: ProviderClient<ElevenLabsInput, ElevenLabsOutput> = {
  async call(input): Promise<ProviderResult<ElevenLabsOutput>> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return this.mock(input);
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${input.voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text: input.text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: input.stability ?? 0.5,
              similarity_boost: input.similarityBoost ?? 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: createProviderError(
            "ELEVENLABS_ERROR",
            error.message || "TTS generation failed",
            "elevenlabs",
            error
          ),
        };
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return {
        success: true,
        data: {
          audioUrl,
          durationMs: audioBlob.size * 8,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createProviderError(
          "ELEVENLABS_ERROR",
          error instanceof Error ? error.message : "Unknown error",
          "elevenlabs"
        ),
      };
    }
  },

  mock(input): Promise<ProviderResult<ElevenLabsOutput>> {
    return Promise.resolve({
      success: true,
      data: {
        audioUrl: `data:audio/mp3;base64,mock-audio-${input.voiceId}`,
        durationMs: Math.floor(input.text.length * 50),
      },
    });
  },
};