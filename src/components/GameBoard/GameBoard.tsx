import { useEffect, useState } from "react";
import { GameStatus } from "../../utils/types";
import classNames from "classnames";
import "./style.scss";

type Props = {
  word: string[];
  setGameStatus: (gameStatus: GameStatus) => void;
};

type ActivePoint = {
  rowIndex: number;
  cellIndex: number;
};

function GameBoard(props: Props) {
  const middRowEachBoxCount = props.word[0].length;
  const midRowsCount = middRowEachBoxCount - 1;

  const allRows: string[][] = [
    [...props.word[0]],
    ...[...Array(midRowsCount).keys()].map(() =>
      Array(middRowEachBoxCount).fill("")
    ),
  ];

  const [rows, setRows] = useState<string[][]>(allRows);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePoint, setActivePoint] = useState<ActivePoint>();

  function clickCharBoxHandler(activePoint: ActivePoint) {
    setActivePoint((old) => ({ ...old, ...activePoint }));

    setRows((old) => {
      const curRowIndex = activeIndex;

      old[curRowIndex + 1] = [...old[curRowIndex]];
      old[curRowIndex + 1].splice(activePoint?.cellIndex as number, 1, "");

      return [...old];
    });
  }

  useEffect(() => {
    const keyReg = /^[a-zöüçğşıA-ZÖÜŞÇİĞ]$/;
    function keyUpHandler(ev: KeyboardEvent) {
      const pressedKey = ev.key;
      const IsKeyALetterChar = keyReg.test(pressedKey);

      if (!activePoint) {
        return;
      }

      const curRowIndex = activeIndex;

      if (pressedKey === "Escape") {
        setActivePoint(undefined);
        setRows((old) => {
          old[curRowIndex + 1] = [...Array(middRowEachBoxCount).fill("")];

          return [...old];
        });

        return;
      }

      if (IsKeyALetterChar) {
        setRows((old) => {
          old[curRowIndex + 1] = [...old[curRowIndex]];
          old[curRowIndex + 1].splice(
            activePoint?.cellIndex as number,
            1,
            pressedKey.toLocaleUpperCase("Tr-tr")
          );

          return [...old];
        });

        setActiveIndex((old) => old + 1);
      }
    }

    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [
    activePoint,
    middRowEachBoxCount,
    midRowsCount,
    props,
    rows,
    activeIndex,
  ]);

  useEffect(() => {
    const lastWord = rows[rows.length - 1].join("");
    if (lastWord === props.word[1]) {
      const isWin = lastWord === props.word[1];
      props.setGameStatus(isWin ? GameStatus.WIN : GameStatus.LOST);
    }
  }, [rows, props, activeIndex]);

  return (
    <div className="game-board">
      <div className="game-table-outer">
        <table className="game-table">
          <tbody>
            {rows.map((row, rowIndex) => {
              const lastRow = rowIndex === rows.length - 1;

              return (
                <tr
                  className={classNames({
                    row: true,
                    "last-row": lastRow,
                    activated: rowIndex <= activeIndex,
                    "active-row": !lastRow && rowIndex === activeIndex,
                    "next-active-row":
                      activePoint && rowIndex === activeIndex + 1,
                  })}
                  key={rowIndex}
                >
                  {row.map((char, cellIndex) => {
                    const hasPointer = !lastRow && activeIndex === rowIndex;

                    return (
                      <td
                        className={classNames({
                          "char-box": true,
                          "has-pointer": hasPointer,
                          active:
                            rowIndex === activePoint?.rowIndex &&
                            cellIndex === activePoint.cellIndex,
                        })}
                        key={cellIndex}
                        data-key={lastRow ? props.word[1][cellIndex] : ""}
                        onClick={() =>
                          hasPointer
                            ? clickCharBoxHandler({ rowIndex, cellIndex })
                            : undefined
                        }
                      >
                        {char}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="note">
        <h4 className="title">OYUNDAN NOTLAR</h4>
        <ul>
          <li>Oyun sadece TÜRKÇE kelimeler ile oynanabilir</li>
          <li>
            Değiştirmek istediğiniz harfe tıklayın ve ardından klavyede herhangi
            bir harfe basın.
          </li>
          <li>
            Bastığınız harfi iptal etmek istiyorsanız ESC tuşuna basabilirsiniz
          </li>
          <li>
            Başka bir harfi değiştirmek istiyorsanız, daha önceden bastığınız
            harfin dışında herhangi bir harfe tıklamanız yeterlidir
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GameBoard;
