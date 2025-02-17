import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

import { ConfigProps } from './config'
import { UserRound } from 'lucide-react'

import { Piles } from './piles'

function Play({
  config,
  piles,
  setPiles,
  selectedPile,
  setSelectedPile,
  remove,
  setRemove,
  moves,
  setMoves,
  player,
  setPlayer,
  winner,
  setWinner,
}: { 
  config: ConfigProps;
  piles: Array<number>;
  setPiles: (value: Array<number>) => void;
  selectedPile: string;
  setSelectedPile: (value: string) => void;
  remove: string;
  setRemove: (value: string) => void;
  moves: Array<string>;
  setMoves: (value: Array<string>) => void;
  player: boolean;
  setPlayer: (value: boolean) => void;
  winner: string;
  setWinner: (value: string) => void;
}) {
  const availablePile = config.variation !== "Grundy's Game" ? piles.map((coins, index) => coins ? `Pile ${index + 1}` : null) : piles.map((coins, index) => coins > 2 ? `Pile ${index + 1}` : null);

  const checkWin = (arr: Array<number>) => {
    let win = true;
    if (config.variation === "Grundy's Game") arr.forEach((i) => win = win && (i <= 2))
    else arr.forEach((i) => win = win && (i === 0));
    return win;
  };

  const handleClick = () => {
    const nextPiles = config.variation !== "Grundy's Game" ? piles.map((coins, i) => {
      if (i === Number(selectedPile.split(" ")[1]) - 1) return coins - Number(remove);
      else return coins;
    }) : [...piles.map((coins, i) => {
      if (i === Number(selectedPile.split(" ")[1]) - 1) return Number(remove);
      else return coins;
    }), piles[Number(selectedPile.split(" ")[1]) - 1] - Number(remove)];
    if (checkWin(nextPiles)) {
      setWinner(!player ? config.player1 : config.player2);
    }
    if (config.variation === "Grundy's Game") setMoves([...moves, `${!player ? config.player1 : config.player2} splits ${selectedPile.toLowerCase()} into ${remove} coin${Number(remove) > 1 ? 's' : ''} and ${piles[Number(selectedPile.split(" ")[1]) - 1] - Number(remove)} coin${piles[Number(selectedPile.split(" ")[1]) - 1] - Number(remove) > 1 ? 's' : ''}.`])
    else setMoves([...moves, `${!player ? config.player1 : config.player2} removes ${remove} coin${Number(remove) > 1 ? 's' : ''} from ${selectedPile.toLowerCase()}.`])
    setPiles(nextPiles);
    setSelectedPile("");
    setRemove("");
    setPlayer(!player);
  };

  return (
    <div className='flex flex-col md:flex-row gap-4 w-full items-center justify-center'>
      <Select value={selectedPile} onValueChange={setSelectedPile} disabled={config.variation === "" || winner !== ""}>
        <SelectTrigger className="">
          <SelectValue placeholder="Which Pile?" />
        </SelectTrigger>
        <SelectContent>
          {availablePile.map((pile, index) => pile !== null ? <SelectItem key={index} value={pile}>{pile}</SelectItem> : null)}
        </SelectContent>
      </Select>

      <Select value={remove} onValueChange={setRemove} disabled={selectedPile === ""}>
        <SelectTrigger className="">
          <SelectValue placeholder="Number of Coins?" />
        </SelectTrigger>
        <SelectContent>
          {config.variation === "Original" &&
            [...Array(piles[Number(selectedPile.split(" ")[1]) - 1]).keys()]
            .map((x, index) => 
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
          )}
          {config.variation === "21 Take-Away" &&
            [...Array(Math.min(3, Number(selectedPile.split(" ")[1]) ? piles[Number(selectedPile.split(" ")[1]) - 1] : 3)).keys()]
            .map((x, index) => 
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
          )}
          {config.variation === "Grundy's Game" &&
            [...Array(Math.max(1, Number(selectedPile.split(" ")[1]) ? Math.floor((piles[Number(selectedPile.split(" ")[1]) - 1] - 1) / 2) : 0)).keys()]
            .map((x, index) => 
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString() + " / " + (piles[Number(selectedPile.split(" ")[1]) - 1] - x - 1).toString()}
              </SelectItem>
            )
          }
        </SelectContent>
      </Select>

      <Button className='w-full md:w-3/5' disabled={remove === ""} onClick={handleClick}>Go!</Button>
    </div>
  );
};

export default function Board({
  config,
  moves,
  setMoves,
  winner,
  setWinner
}: {
  config: ConfigProps;
  moves: Array<string>;
  setMoves: (value: Array<string>) => void;
  winner: string;
  setWinner: (value: string) => void;
}) {
  const [piles, setPiles] = useState<Array<number>>([]);
  const [selectedPile, setSelectedPile] = useState<string>("");
  const [remove, setRemove] = useState<string>("");
  const [player, setPlayer] = useState<boolean>(false);

  useEffect(() => {
    if (config.variation === "Original") setPiles([1, 3, 5, 7]);
    else if (config.variation === "21 Take-Away") setPiles([21]);
    else if (config.variation === "Poker Nim") setPiles([1, 3, 5, 7]);
    else if (config.variation === "Grundy's Game") setPiles([20]);
    setSelectedPile("");
    setRemove("");
    setPlayer(false);
  }, [config]);

  return (
    <div>
      <div className={cn(config.mode === "" ? 'hidden' : 'block')}>
        <Piles piles={piles} />
        <div className='flex gap-2 font-semibold mb-2 md:mb-4 mt-8'>
          <UserRound />{!player ? config.player1 : config.player2}'s Turn
        </div>
        <Play 
          config={config}
          piles={piles}
          setPiles={setPiles}
          selectedPile={selectedPile}
          setSelectedPile={setSelectedPile}
          remove={remove}
          setRemove={setRemove}
          moves={moves}
          setMoves={setMoves}
          player={player}
          setPlayer={setPlayer}
          winner={winner}
          setWinner={setWinner}
        />
      </div>
    </div>
  );
};