"use client";
import {useState} from "react";

export default function PPT() {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const choices = ["✊", "✋", "✌️"];

  function play(userSelection: string) {
    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(userSelection);
    setComputerChoice(computerSelection);
    if (userSelection === computerSelection) {
      setResult("Empate");
    } else if ((userSelection === "✊" && computerSelection === "✌️") ||
               (userSelection === "✋" && computerSelection === "✊") ||
               (userSelection === "✌️" && computerSelection === "✋")) {
      setResult("Ganaste");
    } else {
      setResult("Perdiste");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-4xl font-bold">Piedra, Papel o Tijeras</h1>
      <div className="grid grid-cols-3 gap-16">
        <Column text={userChoice || "Tú"}>
          <div className="flex gap-4">
            <button className="bg-blue-500 text-white p-4 rounded-full hover:scale-110 hover:bg-blue-600 cursor-pointer transition-all" onClick={() => play("✊")}>✊</button>
            <button className="bg-blue-500 text-white p-4 rounded-full hover:scale-110 hover:bg-blue-600 cursor-pointer transition-all" onClick={() => play("✋")}>✋</button>
            <button className="bg-blue-500 text-white p-4 rounded-full hover:scale-110 hover:bg-blue-600 cursor-pointer transition-all" onClick={() => play("✌️")}>✌️</button>
          </div>
        </Column>
        <Column text={result || "Resultado"} />
        <Column text={computerChoice || "Computadora"} />
      </div>
    </section>
  )
}

function Column({children, text}: {children?: React.ReactNode; text: string}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div>
        <p className="text-2xl font-bold">{text}</p>
      </div>
      {children}
    </div>
  )
}