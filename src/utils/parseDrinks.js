export function parseDrinks(str) {
  if (!str) return [];

  return str.split(",").map(part => {
    const match = part.trim().match(/(.+)\s+x(\d+)$/);
    if (match) {
      return { word: match[1].trim(), count: parseInt(match[2]) };
    } else {
      return { word: part.trim(), count: 1 }; // fallback
    }
  });
}