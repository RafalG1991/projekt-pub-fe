export function countWords(str) {
// Remove punctuation marks and convert to lowercase
  str = str.toLowerCase();

  // Split the string into parts using commas
  const parts = str.split(",");

  // Create an array to store word counts
  const wordCounts = [];

  // Iterate through the parts and count occurrences of each word
  parts.forEach(part => {
    // Split each part into words
    const words = part.trim().split(/\s+/);

    // Combine multi-word names into a single string
    let combinedWords = "";
    words.forEach(word => {
      combinedWords += word + " ";
    });
    combinedWords = combinedWords.trim();

    // Check if the combined word already exists in the array
    const existingWordIndex = wordCounts.findIndex(item => item.word === combinedWords);
    if (existingWordIndex !== -1) {
      // If it exists, increment the count
      wordCounts[existingWordIndex].count++;
    } else {
      // If it doesn't exist, add it to the array
      wordCounts.push({ word: combinedWords, count: 1 });
    }
  });

  return wordCounts;
}