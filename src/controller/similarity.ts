export const stringSimilarity = (a: string, b: string): number => {
    a = a
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
    b = b
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
  
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;
  
    const bigramsA = new Map();
    let intersectionSize = 0;
  
    for (let i = 0; i < a.length - 1; i++) {
      const bigram = a.substring(i, i + 2);
      const count = bigramsA.has(bigram) ? bigramsA.get(bigram) + 1 : 1;
  
      bigramsA.set(bigram, count);
    }
  
    for (let i = 0; i < b.length - 1; i++) {
      const bigram = b.substring(i, i + 2);
      const count = bigramsA.has(bigram) ? bigramsA.get(bigram) : 0;
  
      if (count > 0) {
        bigramsA.set(bigram, count - 1);
        intersectionSize++;
      }
    }
  
    return (2.0 * intersectionSize) / (a.length + b.length - 2);
  };