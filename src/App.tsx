import { useState } from "react";
import lRandom from "lodash.random";
import GameBoard from "./components/GameBoard/GameBoard";
import GameStatusMessage from "./components/GameStatusMessage/GameStatusMessage";
import words from "./utils/words";
import { GameStatus } from "./utils/types";
import "./App.scss";

function App() {
  const [gameBoardKey, setGameBoardKey] = useState<number>(0);
  const [randomInt, setRandomInt] = useState<number>(getRandomInt());
  const [randomWord, setRandomWord] = useState<string[]>(
    getRandomWord(randomInt)
  );
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

  function getRandomInt() {
    return lRandom(words.length - 1);
  }

  function getRandomWord(randomInt: number): string[] {
    return words[randomInt];
  }

  function playAgain() {
    let newRandomInt = getRandomInt();

    if (words.length > 1) {
      while (newRandomInt === randomInt) {
        newRandomInt = getRandomInt();
      }
    }

    setGameStatus(null);
    setRandomInt(newRandomInt);
    setRandomWord([...getRandomWord(newRandomInt)]);
    setGameBoardKey((old) => old + 1);
  }

  return (
    <>
      <GameBoard
        key={`board-${gameBoardKey}`}
        word={randomWord}
        setGameStatus={(gameStatus: GameStatus) => setGameStatus(gameStatus)}
      />
      {gameStatus && (
        <GameStatusMessage
          key={`status-${gameBoardKey}`}
          status={gameStatus}
          playAgain={playAgain}
        />
      )}
    </>
  );
}

export default App;
