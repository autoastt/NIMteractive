export default function Moves({ moves }: { moves: Array<string> }) {
  return (
    <div>
      {moves !== undefined ? (
        moves.map((move, index) => <p key={index}>{move}</p>)
      ) : (
        <p>No moves...</p>
      )}
    </div>
  );
}
