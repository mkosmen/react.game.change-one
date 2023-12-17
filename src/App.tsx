import GameBoard from "./components/GameBoard/GameBoard";
import words from "./utils/words";
import lRandom from "lodash.random";
import "./App.scss";

function App() {
  const randomInt = lRandom(words.length-1);
  const randomWord: string[] = words[randomInt];

  return <GameBoard word={randomWord} />;
}

export default App;
