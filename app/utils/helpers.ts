export default function sanitizedSearch(term: string) {
  return term.replace("#", "");
}
