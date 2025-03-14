import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ConfigProps } from "@/components/config";
import { UserRound } from "lucide-react";

import { Piles } from "@/components/piles";
import { botMove, checkWin, newMoves, newPiles } from "@/lib/actions";

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
  const availablePile =
    config.variation !== "Grundy's Game"
      ? piles.map((coins, index) => (coins ? `Pile ${index + 1}` : null))
      : piles.map((coins, index) => (coins > 2 ? `Pile ${index + 1}` : null));

  const handleClick = async () => {
    const nextPiles = newPiles(config, piles, selectedPile, remove);
    const nextMoves = newMoves(
      config,
      moves,
      player,
      piles,
      selectedPile,
      remove,
    );
    setPiles(nextPiles);
    setMoves(nextMoves);
    setSelectedPile("");
    setRemove("");

    if (checkWin(config, nextPiles)) {
      setWinner(!player ? config.player1 : config.player2);
      return;
    }

    setPlayer(!player);
    if (config.mode === "one") {
      await botMove(
        config,
        nextPiles,
        setPiles,
        nextMoves,
        setMoves,
        !player,
        setPlayer,
        setWinner,
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-center justify-center">
      <Select
        value={selectedPile}
        onValueChange={setSelectedPile}
        disabled={config.variation === "" || winner !== ""}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Which Pile?" />
        </SelectTrigger>
        <SelectContent>
          {availablePile.map((pile, index) =>
            pile !== null ? (
              <SelectItem key={index} value={pile}>
                {pile}
              </SelectItem>
            ) : null,
          )}
        </SelectContent>
      </Select>

      <Select
        value={remove}
        onValueChange={setRemove}
        disabled={selectedPile === ""}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Number of Coins?" />
        </SelectTrigger>
        <SelectContent>
          {config.variation === "Original" &&
            [
              ...Array(piles[Number(selectedPile.split(" ")[1]) - 1]).keys(),
            ].map((x, index) => (
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
            ))}
          {config.variation === "21 Take-Away" &&
            [
              ...Array(
                Math.min(
                  3,
                  Number(selectedPile.split(" ")[1])
                    ? piles[Number(selectedPile.split(" ")[1]) - 1]
                    : 3,
                ),
              ).keys(),
            ].map((x, index) => (
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString()}
              </SelectItem>
            ))}
          {config.variation === "Grundy's Game" &&
            [
              ...Array(
                Math.max(
                  1,
                  Number(selectedPile.split(" ")[1])
                    ? Math.floor(
                        (piles[Number(selectedPile.split(" ")[1]) - 1] - 1) / 2,
                      )
                    : 0,
                ),
              ).keys(),
            ].map((x, index) => (
              <SelectItem key={index} value={(x + 1).toString()}>
                {(x + 1).toString() +
                  " / " +
                  (
                    piles[Number(selectedPile.split(" ")[1]) - 1] -
                    x -
                    1
                  ).toString()}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Button
        className="w-full md:w-3/5"
        disabled={remove === ""}
        onClick={handleClick}
      >
        Go!
      </Button>
    </div>
  );
}

export default function Board({
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
  return (
    <div>
      <div className={cn(config.mode === "" ? "hidden" : "block")}>
        {winner === "" ? (
          <>
            <Piles piles={piles} />
            <div className="flex gap-2 font-semibold mb-2 md:mb-4 mt-8">
              <UserRound />
              {!player ? config.player1 : config.player2}'s Turn
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
          </>
        ) : (
          <div className="font-semibold text-3xl">
            <div className="flex gap-2">
              <p className="from-blue-800 to-red-600 bg-gradient-to-r text-transparent bg-clip-text">
                Congratulations
              </p>
              &nbsp;🎉
            </div>{" "}
            <p className="flex font-normal text-base lg:text-2xl my-4">
              The winner is&nbsp;
              <a className="font-medium underline">{winner}</a>!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
