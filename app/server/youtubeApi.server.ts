const apiKey = process.env.YOUTUBE_API_KEY;

export async function getYouTubeVideoThumbnail(videoUrl: string) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoUrl}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.items[0].snippet.thumbnails.default.url;
}
