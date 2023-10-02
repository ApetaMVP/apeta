import type TimeAgo from "react-timeago";

export default function sanitizedSearch(term: string) {
  return term.replace("#", "");
}

export function formatTimeAgo(
  value: number,
  unit: TimeAgo.Unit,
  suffix: TimeAgo.Suffix,
  ms: number,
  next: TimeAgo.Formatter | undefined,
) {
  if (unit === "second") {
    return "seconds ago";
  } else {
    return next && next(value, unit, suffix, ms, next);
  }
}

export function isUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatPostContent(
  content: string,
  showFullDescription: boolean,
) {
  const isLongContent = content.length > 200;
  const isTruncated = content.length > 200 && !showFullDescription;
  const formattedContent = isTruncated
    ? content.slice(0, 200) + "..."
    : content;

  return { formattedContent, isLongContent };
}
