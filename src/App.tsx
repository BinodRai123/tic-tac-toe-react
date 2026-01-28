import { useState } from "react";
import "./index.css"; // Ensure you import your CSS file!

interface squareProps {
   value: number | string | null;
   onSquareClick: () => void; // Fixed type: it's a void function
}

interface BoardProps {
   xIsNext: boolean;
   squares: (number | null | string)[];
   onPlay: (nextSquares: (number | string | null)[]) => void;
}

//Square component for each cell in the board
function Square({ value, onSquareClick }: squareProps) {
   return (
      <button className="square" onClick={onSquareClick}>
         <span className={value === "X" ? "text-x" : "text-o"}>{value}</span>
      </button>
   );
}

//Board component to render the game board
function Board({ xIsNext, squares, onPlay }: BoardProps) {
   function handleClick(i: number) {
      if (calculateWinner(squares) || squares[i]) {
         return;
      }
      const nextSquares = squares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";
      onPlay(nextSquares);
   }

   const winner = calculateWinner(squares);
   let status;
   if (winner) {
      status = "Winner: " + winner;
   } else {
      status = "Next: " + (xIsNext ? "X" : "O");
   }

   return (
      <div className="board-container">
         <div className={`status ${winner ? "winner-announcement" : ""}`}>{status}</div>
         <div className="board">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
            ))}
         </div>
      </div>
   );
}

export default function App() {
   const [history, setHistory] = useState<(number | null | string)[][]>([Array(9).fill(null)]);
   const [currentMove, setCurrentMove] = useState<number>(0); // Track the current move index
   const xIsNext: boolean = currentMove % 2 === 0; //check if X is next or not
   // Get the current squares based on the current move
   const currentSquares: (number | null | string)[] = history[currentMove];

   //this handle the play and update the history and current move
   function handlePlay(nextSquares: (number | null | string)[]): void {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
   }

   //this jumps to the selected move in history
   function jumpTo(nextMove: number) {
      setCurrentMove(nextMove);
   }

   // Generate the list of moves for history
   const moves = history.map((_, move) => {
      const description = move > 0 ? `Go to move #${move}` : "Reset Game";
      return (
         <li key={move}>
            <button className="history-btn" onClick={() => jumpTo(move)}>
               {description}
            </button>
         </li>
      );
   });

   return (
      <div className="game-wrapper">
         <div className="game">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            <div className="game-info">
               <h3>History</h3>
               <ol>{moves}</ol>
            </div>
         </div>
      </div>
   );
}

// Helper function to determine the winner
function calculateWinner(squares: (number | null | string)[]) {
   const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];
   for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
   }
   return null;
}
