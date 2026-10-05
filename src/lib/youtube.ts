export async function getYoutubeSubscriberCount(
  channelId: string
): Promise<number | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      items?: Array<{ statistics?: { subscriberCount?: string } }>;
    };

    const subscriberCount = data.items?.[0]?.statistics?.subscriberCount;

    if (!subscriberCount || subscriberCount === "0") {
      return null;
    }

    return parseInt(subscriberCount, 10);
  } catch {
    return null;
  }
}
