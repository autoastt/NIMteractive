import coinDisplay from "../assets/coin.png";

function Coin() {
  return <img src={coinDisplay} className="w-6 md:w-12" />;
}

function Pile({ coins }: { coins: number }) {
  return (
    coins > 0 ? <div className="flex flex-wrap gap-2 max-w-56 md:max-w-xl">
      {[...Array(coins).keys()].map((_, index) => (
        <Coin key={index} />
      ))}
    </div>
   : null);
}

export function Piles({ piles }: { piles: Array<number> }) {
  return (
    <div>
      <div className="select-none flex flex-col gap-y-2 md:gap-y-4">
        {piles ? piles.map((coins, index) =>
          coins ? (
            <div className="flex items-center" key={index}>
              <div className="text-xs w-5 p-[0.125rem] md:text-sm md:w-7 md:p-1 font-semibold font-mono rounded-full bg-zinc-800 text-white text-center">
                {index + 1}
              </div>
              &emsp;
              <Pile coins={coins} />
            </div>
          ) : null,
        ) : null}
      </div>
    </div>
  );
}
