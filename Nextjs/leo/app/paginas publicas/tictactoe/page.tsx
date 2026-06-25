"use client";
import { useState } from "react";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");

  function handleClick(index) {
    if (board[index]) return; // Si la casilla ya está ocupada, no hacer nada
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    // Evaluar condiciones de victoria
    checkWinner();
  }

  function checkWinner() {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // filas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columnas
      [0, 4, 8],
      [2, 4, 6], // diagonales
    ];

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        alert(`¡El jugador ${board[a]} ha ganado!`);
        setBoard(Array(9).fill(null));
        setCurrentPlayer("X");
        return;
      }
    }

    if (!board.includes(null)) {
      alert("¡Es un empate!");
      setBoard(Array(9).fill(null));
      setCurrentPlayer("X");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Tic Tac Toe</h1>
      <div className="grid grid-cols-3">
        {board.map((cell, index) => (
          <div
            key={index}
            className="w-20 h-20 bg-gray-200 flex items-center justify-center text-2xl font-bold cursor-pointer w-20 h-20 border border-gray-300 text-black"
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <button
        onClick={() => setBoard(Array(9).fill(null))}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
      >
        Reiniciar
      </button>
    </section>
  );
}

/*
  Realiza el To do list usando React
  Realiza una copia de Youtube
*/