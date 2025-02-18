export const games = ["Original", "21 Take-Away", "Grundy's Game"];

export const instruction: Record<string, string> = {
  Original: "Classic Nim game with traditional rules.",
  "21 Take-Away": "Remove 1-3 coins from a pile of 21.",
  "Grundy's Game": "Split a pile into two unequal piles.",
};

export const initialPiles: Record<string, Array<number>> = {
  Original: [1, 3, 5, 7],
  "21 Take-Away": [21],
  "Grundy's Game": [10],
};
