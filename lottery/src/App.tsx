import { useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState([0, 0, 0, 0]);
  const [balance, setBalance] = useState(100);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

    if (index < 3 && num) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 10);
    }
  };

  const generateRow = () => {
    const row = [];
    while (row.length < 4)
  };
  return (
    <>
      <div>
        <h1>Welcome to Salty Lottery</h1>
      </div>
    </>
  );
}

export default App;
