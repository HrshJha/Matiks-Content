import { createProviderError, type ProviderClient, type ProviderResult } from "./types";

interface IGPostInput {
  accessToken: string;
  igUserId: string;
  videoUrl: string;
  caption: string;
  hashtags: string[];
}

interface IGPostOutput {
  mediaId: string;
  permalink: string;
}

export const igGraphClient: ProviderClient<IGPostInput, IGPostOutput> = {
  async call(input): Promise<ProviderResult<IGPostOutput>> {
    const appId = process.env.IG_APP_ID;
    const appSecret = process.env.IG_APP_SECRET;
    
    if (!appId || !appSecret) {
      return this.mock(input);
    }

    try {
      // 1. Create media container
      const createResponse = await fetch(
        `https://graph.facebook.com/v21.0/${input.igUserId}/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            media_type: "VIDEO",
            video_url: input.videoUrl,
            caption: `${input.caption}\n\n${input.hashtags.map((h) => `#${h}`).join(" ")}`,
            access_token: input.accessToken,
          }),
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.json();
        return {
          success: false,
          error: createProviderError(
            "IG_CREATE_MEDIA_ERROR",
            error.error?.message || "Failed to create media",
            "instagram-graph",
            error
          ),
        };
      }

      const { id: mediaId } = await createResponse.json();

      // 2. Publish the media
      const publishResponse = await fetch(
        `https://graph.facebook.com/v21.0/${input.igUserId}/media_publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creation_id: mediaId,
            access_token: input.accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        return {
          success: false,
          error: createProviderError(
            "IG_PUBLISH_ERROR",
            error.error?.message || "Failed to publish media",
            "instagram-graph",
            error
          ),
        };
      }

      const { id } = await publishResponse.json();

      return {
        success: true,
        data: {
          mediaId: id,
          permalink: `https://instagram.com/p/${id}`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: createProviderError(
          "IG_ERROR",
          error instanceof Error ? error.message : "Unknown error",
          "instagram-graph"
        ),
      };
    }
  },

  mock(input): Promise<ProviderResult<IGPostOutput>> {
    return Promise.resolve({
      success: true,
      data: {
        mediaId: `mock_media_${Date.now()}`,
        permalink: `https://instagram.com/p/mock_${Date.now()}`,
      },
    });
  },
};