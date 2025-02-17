import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { numsvg } from './ui/numsvg'
import coinDisplay from '../assets/coin.png'
import { cn } from '@/lib/utils'

import { ConfigProps } from './config'
import { UserRound } from 'lucide-react'


function Coin() {
  return <img src={coinDisplay} className='w-6 md:w-12 select-none'/>
};

function Pile({ coins }: { coins: number; }) {
  return (
    <div className='flex flex-wrap gap-2 max-w-56 md:max-w-xl'>
      {Array(coins).fill(true).map((_, index) => (
        <Coin key={index}/>
      ))}
    </div>
  );
};

function Piles({ 
  piles, 
}: { 
  piles: Array<number>; 
}) {
  return (
    <div>
      <div className='flex flex-col gap-y-2'>
        {piles.map((coins, index) => (
          coins ?
          <div className='flex items-center' key={index}>
            {numsvg[index + 1]}&emsp;
            <Pile coins={coins}/>
          </div> : null
        ))}
      </div>
    </div>
  );
};

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
  const availablePile = piles.map((coins, index) => coins ? `Pile ${index + 1}` : null);

  const checkWin = (arr: Array<number>) => {
    let win = true;
    arr.forEach((i, idx) => {
      console.log(i, idx)
      win = win && (i === 0)
    });
    console.log("win", win)
    return win;
  };

  const handleClick = () => {
    const nextPiles = piles.map((coins, i) => {
      if (i === Number(selectedPile.split(" ")[1]) - 1) return coins - Number(remove);
      else return coins;
    });
    if (checkWin(nextPiles)) {
      setWinner(!player ? config.player1 : config.player2);
    }
    setMoves([...moves, `${!player ? config.player1 : config.player2} removes ${remove} coin${Number(remove) > 1 ? 's' : ''} from ${selectedPile.toLowerCase()}.`])
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