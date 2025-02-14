import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import coinDisplay from '../assets/coin.png'
import { Button } from './ui/button';

const games = [
  {key: "original", label: "Original"},
  {key: "21takeaway", label: "21 Take-Away"},
  {key: "pokernim", label: "Poker Nim"},
  {key: "grundy", label: "Grundy's Game"},
];

function Config({ 
  variation, 
  setVariation 
}: { 
  variation: string;
  setVariation: (value: string) => void;
}) {
  return (
    <Select value={variation} onValueChange={setVariation}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select Variation' />
      </SelectTrigger>
      <SelectContent>
        {games.map((game) => <SelectItem key={game.key} value={game.key}>{game.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
};

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
            <div className='text-xl'>Pile {index + 1}:&emsp;</div>
            <Pile coins={coins}/>
          </div> : null
        ))}
      </div>
    </div>
  );
};

function Play({
  variation,
  piles,
  setPiles,
  selectedPile,
  setSelectedPile,
  remove,
  setRemove
}: { 
  variation: string;
  piles: Array<number>;
  setPiles: (value: Array<number>) => void;
  selectedPile: string;
  setSelectedPile: (value: string) => void;
  remove: string;
  setRemove: (value: string) => void;
}) {
  const availablePile = piles.map((coins, index) => coins ? `Pile ${index + 1}` : null)

  const handleClick = () => {
    const nextPiles = piles.map((coins, i) => {
      if (i === Number(selectedPile.split(" ")[1]) - 1) return coins - Number(remove);
      else return coins;
    });
    setPiles(nextPiles);
    setSelectedPile("Unselected");
    setRemove("0");
  }

  return (
    <div className='md:flex gap-4'>
      <Select value={selectedPile} onValueChange={setSelectedPile} disabled={variation === ""}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Variation" />
        </SelectTrigger>
        <SelectContent>
          {availablePile.map((pile, index) => pile !== null ? <SelectItem key={index} value={pile}>{pile}</SelectItem> : null)}
        </SelectContent>
      </Select>

      <Select value={remove} onValueChange={setRemove} disabled={selectedPile === "Unselected"}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Variation" />
        </SelectTrigger>
        <SelectContent>
          {variation === "21takeaway" ? 
            [...Array(Math.min(3, Number(selectedPile.split(" ")[1]) ? piles[Number(selectedPile.split(" ")[1]) - 1] : 3)).keys()]
            .map((x, index) => 
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
            ) : null}
          {variation === "original" ? 
            [...Array(piles[Number(selectedPile.split(" ")[1]) - 1]).keys()]
            .map((x, index) => 
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
            ) : null}
        </SelectContent>
      </Select>

      <Button disabled={remove === "0"} onClick={handleClick}>Go!</Button>
    </div>
  );
};

export default function Board() {
  const [variation, setVariation] = useState<string>("");
  const [piles, setPiles] = useState<Array<number>>([]);
  const [selectedPile, setSelectedPile] = useState<string>("Unselected");
  const [remove, setRemove] = useState<string>("0");

  useEffect(() => {
    if (variation === "original") setPiles([1, 3, 5, 7]);
    else if (variation === "21takeaway") setPiles([21]);
    else if (variation === "pokernim") setPiles([1, 3, 5, 7]);
    else if (variation === "grundy") setPiles([20]);
    setSelectedPile("Unselected");
    setRemove("0");
  }, [variation]);

  return (
    <div>
      <Config variation={variation} setVariation={setVariation} />
      <Piles piles={piles} />
      <Play 
        variation={variation}
        piles={piles}
        setPiles={setPiles}
        selectedPile={selectedPile}
        setSelectedPile={setSelectedPile}
        remove={remove}
        setRemove={setRemove}
      />
    </div>
  );
};