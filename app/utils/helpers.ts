import TimeAgo from "react-timeago";

export default function sanitizedSearch(term: string) {
  return term.replace("#", "");
}

// @ts-ignore
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
