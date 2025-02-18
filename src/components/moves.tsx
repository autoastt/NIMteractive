export default function Moves({ moves }: { moves: Array<string> }) {
  return (
    <div>
      {moves.length
        ? moves.map((move, index) => <p key={index}>{move}</p>)
        : null}
    </div>
  );
}
