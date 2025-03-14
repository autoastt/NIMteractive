import { ConfigProps } from "@/components/config";

const g = [0, 0, 0, 1, 0, 2, 1, 0, 2, 1, 0];

export function bestMove(variation: string, piles: Array<number>) {
  const ret = { selectedPile: "", remove: "" };
  let sum: number = 0;
  const possibleMoves = [];
  const possiblePiles = [];
  if (variation === "Original") {
    piles.forEach((i) => (sum ^= i));
    for (let i: number = 0; i < piles.length; i++) {
      if (piles[i] === 0) continue;
      possiblePiles.push(i);
      for (let j: number = 1; j <= piles[i]; j++) {
        if (sum ^ piles[i] ^ (piles[i] - j)) continue;
        possibleMoves.push({ selectedPile: i + 1, remove: j });
      }
    }
    if (possibleMoves.length !== 0) {
      const k = Math.floor(Math.random() * possibleMoves.length);
      ret.selectedPile = "Pile " + possibleMoves[k].selectedPile.toString();
      ret.remove = possibleMoves[k].remove.toString();
    } else {
      const k = Math.floor(Math.random() * possiblePiles.length);
      const x = Math.floor(Math.random() * piles[possiblePiles[k]]) + 1;
      ret.selectedPile = "Pile " + (possiblePiles[k] + 1).toString();
      ret.remove = x.toString();
    }
  } else if (variation === "21 Take-Away") {
    ret.selectedPile = "Pile 1";
    if (piles[0] % 4) {
      ret.remove = (piles[0] % 4).toString();
    } else ret.remove = (Math.floor(Math.random() * 3) + 1).toString();
  } else if (variation === "Grundy's Game") {
    piles.forEach((i) => (sum ^= g[i]));
    for (let i: number = 0; i < piles.length; i++) {
      if (piles[i] > 2) possiblePiles.push(i);
      for (let j: number = 1; j <= (piles[i] - 1) / 2; j++) {
        if (sum ^ g[piles[i]] ^ g[j] ^ g[piles[i] - j]) continue;
        possibleMoves.push({ selectedPile: i + 1, remove: j });
      }
    }
    if (possibleMoves.length !== 0) {
      const k = Math.floor(Math.random() * possibleMoves.length);
      ret.selectedPile = "Pile " + possibleMoves[k].selectedPile.toString();
      ret.remove = possibleMoves[k].remove.toString();
    } else {
      const k = Math.floor(Math.random() * possiblePiles.length);
      const x = Math.floor((Math.random() * (piles[k] - 1)) / 2) + 1;
      ret.selectedPile = "Pile " + (k + 1).toString();
      ret.remove = x.toString();
    }
  }
  return ret;
}

export const checkWin = (config: ConfigProps, arr: Array<number>) => {
  let win = true;
  if (config.variation === "Grundy's Game")
    arr.forEach((i) => (win = win && i <= 2));
  else arr.forEach((i) => (win = win && i === 0));
  return win;
};

export const newPiles = (
  config: ConfigProps,
  p: Array<number>,
  sP: string,
  rem: string,
) => {
  return config.variation !== "Grundy's Game"
    ? p.map((coins, i) => {
        if (i === Number(sP.split(" ")[1]) - 1) return coins - Number(rem);
        else return coins;
      })
    : [
        ...p.map((coins, i) => {
          if (i === Number(sP.split(" ")[1]) - 1) return Number(rem);
          else return coins;
        }),
        p[Number(sP.split(" ")[1]) - 1] - Number(rem),
      ];
};

export const newMoves = (
  config: ConfigProps,
  m: Array<string>,
  pl: boolean,
  p: Array<number>,
  sP: string,
  rem: string,
) => {
  let ret = m;
  if (config.variation === "Grundy's Game")
    ret = [
      ...ret,
      `${!pl ? config.player1 : config.player2} splits ${sP.toLowerCase()} into ${rem} coin${Number(rem) > 1 ? "s" : ""} and ${p[Number(sP.split(" ")[1]) - 1] - Number(rem)} coin${p[Number(sP.split(" ")[1]) - 1] - Number(rem) > 1 ? "s" : ""}.`,
    ];
  else
    ret = [
      ...ret,
      `${!pl ? config.player1 : config.player2} removes ${rem} coin${Number(rem) > 1 ? "s" : ""} from ${sP.toLowerCase()}.`,
    ];
  return ret;
};

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const botMove = async (
  config: ConfigProps,
  nextPiles: Array<number>,
  setPiles: (value: Array<number>) => void,
  nextMoves: Array<string>,
  setMoves: (value: Array<string>) => void,
  player: boolean,
  setPlayer: (value: boolean) => void,
  setWinner: (value: string) => void,
) => {
  if (config.mode === "one") {
    await delay(500);
    const move = bestMove(config.variation, nextPiles);
    const nPiles = newPiles(config, nextPiles, move.selectedPile, move.remove);
    setPiles(nPiles);
    setMoves(
      newMoves(
        config,
        nextMoves,
        player,
        nextPiles,
        move.selectedPile,
        move.remove,
      ),
    );
    if (checkWin(config, nPiles)) {
      setWinner(!player ? config.player1 : config.player2);
      return;
    }
    setPlayer(!player);
  }
};
