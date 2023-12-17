import { GameStatus } from "../../utils/types";
import "./style.scss";

type Props = {
  status: GameStatus;
  playAgain: () => void;
};

const gameStatusMessages = {
  [GameStatus.WIN]: "You WIN",
  [GameStatus.LOST]: "You Lost",
};

function GameStatusMessage(props: Props) {
  return (
    <div className="game-status">
      <span>{gameStatusMessages[props.status]}</span>
      <button onClick={props.playAgain}>Play Again</button>
    </div>
  );
}

export default GameStatusMessage;
