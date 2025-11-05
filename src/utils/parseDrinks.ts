export type ParsedDrink = { word: string; count: number };

export function parseDrinks(str: string | null | undefined): ParsedDrink[] {
  if (!str) return [];
  return str.split(",").map((part: string) => {
    const match = part.trim().match(/(.+)\s+x(\d+)$/);
    if (match) {
      const word = (match[1] ?? "").trim();
      const count = parseInt(match[2] ?? "1", 10);
      return { word, count };
    }
    return { word: part.trim(), count: 1 };
  });
}
