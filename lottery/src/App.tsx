import { useState, useRef, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState([0, 0, 0, 0]);
  const [balance, setBalance] = useState(100);
  const [winning, setWinning] = useState([0, 0, 0, 0]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );
  const handleInput = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const num = parseInt(value);

    if (isNaN(num) || num < 0 || num > 9) {
      e.target.value = "";
      return;
    }

    const newNumbers = [...numbers];
    newNumbers[index] = num;
    setNumbers(newNumbers);

    if (index < 3 && num !== undefined) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    }
  };

  const generateRow = () => {
    const row = [];
    while (row.length < 4) {
      const num = Math.floor(Math.random() * 10);
      if (!row.includes(num)) row.push(num);
    }
    setNumbers(row.sort((a, b) => a - b));
    inputRefs.current[0]?.focus();
  };
  const submitRow = async () => {
    if (numbers.some((n) => n === undefined || n === null)) {
      return alert("Fyll i alla 4 siffror mellan 0-9");
    }

    try {
      const response = await fetch("/api/lottery/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, numbers }),
      });

      if (response.ok) {
        const result = await response.json();
        setTicketId(result.id);
        setBalance(balance - 10);
        alert(`Rad inskickad! Ticket ID: ${result.id}`);
        setNumbers([0, 0, 0, 0]);
      }
    } catch (error) {
      alert("Fel vid inskick");
      console.error(error);
    }
  };

  const checkTicket = async () => {
    if (!ticketId) {
      alert("Ingen ticket att kontrollera!");
      return;
    }

    try {
      const response = await fetch(`/api/lottery/check/${ticketId}`);
      const result = await response.json();

      if (result.won) {
        setBalance(balance + 100);
        alert(`🎉 GRATTIS! ${result.matches} rätt! +100kr`);
      } else {
        alert(
          `Tyvärr: ${
            result.matches
          } rätt. Vinnarnummer: ${result.winningNumbers?.join(" ")}`
        );
      }
    } catch {
      alert("Fel vid vinstkontroll");
    }
  };

  const drawNumbers = async () => {
    try {
      const response = await fetch("/api/lottery/draw");
      const _winning = await response.json();

      alert(`Vinnande rad: ${_winning.join(" ")}`);

      if (ticketId) {
        setTimeout(checkTicket, 1000);
      }
    } catch {
      alert("Fel vid dragning");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-800 to-yellow-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent pb-1 mb-4">
              🎰 Welcome to Salty Lottery
            </h1>
            <p className="text-gray-600 text-lg">Välj dina lyckonummer 0-9</p>
          </div>
          <div className="grid grid-cols-4 gap-6 mb-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
            {numbers.map((num, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                maxLength={1}
                value={num || ""}
                onChange={(e) => handleInput(index, e)}
                className="w-full h-20 text-3xl font-bold text-black text-center bg-white border-4 border-orange-300 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-200 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-200 placeholder:text-grey-400 disabled:opacity-50"
                placeholder="*"
              />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={generateRow}
              className="h-16 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
            >
              Slumpa en rad
            </button>
            <button
              onClick={submitRow}
              className="h-16 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-70 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
            >
              Spela (10 kr)
            </button>
            <button
              onClick={drawNumbers}
              className="h-16 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
            >
              Dra vinnare
            </button>
            <div>
              <button onClick={checkTicket} disabled={!ticketId}>
                {ticketId ? `Kontrollera ticket #${ticketId}` : "Ingen ticket"}
              </button>
            </div>
          </div>
          <div className="text-center space-y-4 pt-6 border-t-2 border-orange-100">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-800">
                Saldo: {balance} kr
              </h3>
            </div>
            <p className="text-xl font-mono bg-orange-300 px-4 py-2 rounded-xl">
              Din rad:{" "}
              <span className="text-2xl font-bold text-orange-700">
                {numbers.join(" ")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
