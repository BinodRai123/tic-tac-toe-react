import { useCallback, useState } from "react";
import "./index.css";

// 1. Define types for the game state
type SquareValue = "X" | "O" | null;

interface WinInfo {
   winner: SquareValue;
   line: number[];
}

// 2. Interface for a component with multiple props
interface SquareProps {
   value: SquareValue;
   onSquareClick: () => void;
   isWinningSquare: boolean;
}

// Sub-component using the interface
function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
   return (
      <button
         className={`cell ${isWinningSquare ? "win-glow" : ""}`}
         onClick={onSquareClick}
         aria-label={value ? `Square ${value}` : "Empty square"}
      >
         {value && <span className={`glyph ${value}`}>{value}</span>}
      </button>
   );
}

export default function App() {
   const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
   const [currentMove, setCurrentMove] = useState<number>(0);

   const xIsNext: boolean = currentMove % 2 === 0;
   const currentSquares: SquareValue[] = history[currentMove];

   const winInfo: WinInfo | null = calculateWinner(currentSquares);
   const winner = winInfo?.winner;
   const winningLine = winInfo?.line || [];
   const isDraw = !winner && currentSquares.every((s) => s !== null);

   const handlePlay = useCallback(
      (nextSquares: SquareValue[]): void => {
         const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
         setHistory(nextHistory);
         setCurrentMove(nextHistory.length - 1);
      },
      [history, currentMove],
   );

   function handleClick(i: number): void {
      if (winner || currentSquares[i]) return;
      const nextSquares = currentSquares.slice();
      nextSquares[i] = xIsNext ? "X" : "O";

      handlePlay(nextSquares);
   }

   return (
      <main className="app-viewport">
         <div className={`cyber-card ${xIsNext ? "turn-x" : "turn-o"} ${winner ? "has-winner" : ""}`}>
            <div className="scanline"></div>

            <section className="game-header">
               {/* Left Column */}
               <div className={`player-box x ${xIsNext && !winner ? "active" : ""}`}>
                  <span className="label">X</span>
                  <span className="status-text">{xIsNext && !winner ? "ACTIVE" : ""}</span>
               </div>

               {/* Center Column */}
               <div className="main-status">{winner ? "VICTORY" : isDraw ? "STALEMATE" : "VS"}</div>

               {/* Right Column */}
               <div className={`player-box o ${!xIsNext && !winner ? "active" : ""}`}>
                  <span className="status-text">{!xIsNext && !winner ? "ACTIVE" : ""}</span>
                  <span className="label">O</span>
               </div>
            </section>

            <section className="grid-wrapper">
               <div className="grid">
                  {currentSquares.map((square, i) => (
                     <Square
                        key={i}
                        value={square}
                        onSquareClick={() => handleClick(i)}
                        isWinningSquare={winningLine.includes(i)}
                     />
                  ))}
               </div>
            </section>

            <section className="controls">
               <div className="history-scrubber">
                  <label htmlFor="history-scrubber">TIME TRAVEL: MOVE {currentMove}</label>
                  <input
                     id="history-scrubber"
                     type="range"
                     min="0"
                     max={history.length - 1}
                     value={currentMove}
                     onChange={(e) => setCurrentMove(parseInt(e.target.value))}
                  />
               </div>
               <button
                  className="neon-reset"
                  onClick={() => {
                     setHistory([Array(9).fill(null)]);
                     setCurrentMove(0);
                  }}
                  aria-label="Reboot system"
               >
                  REBOOT SYSTEM
               </button>
            </section>
         </div>
      </main>
   );
}

// 3. Typed helper function
function calculateWinner(squares: SquareValue[]): WinInfo | null {
   const lines: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];
   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return { winner: squares[a], line: [a, b, c] };
      }
   }
   return null;
}
