import { useEffect, useState } from "react";
import classNames from "classnames";
import "./style.scss";

type Props = {
  word: string[];
};

type ActivePoint = {
  rowIndex: number;
  cellIndex: number;
};

function GameBoard(props: Props) {
  const middRowEachBoxCount = props.word[0].length;
  const midRowsCount = middRowEachBoxCount - 1;

  const allRows = [
    [...props.word[0]],
    ...[...Array(midRowsCount).keys()].map(() =>
      Array(middRowEachBoxCount).fill("")
    ),
  ];

  const [rows, setRows] = useState<string[][]>(allRows);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);

  function clickCharBoxHandler(activePoint: ActivePoint) {
    setActivePoint((old) => ({ ...old, ...activePoint }));

    setRows((old) => {
      const curRowIndex = activePoint?.rowIndex as number;

      old[curRowIndex + 1] = [...old[curRowIndex]];
      old[curRowIndex + 1].splice(activePoint?.cellIndex as number, 1, "");

      return [...old];
    });
  }

  useEffect(() => {
    const keyReg = /^[a-zA-Z]$/;
    function keyUpHandler(ev: KeyboardEvent) {
      const pressedKey = ev.key;
      const IsKeyALetterChar = keyReg.test(pressedKey);

      if (pressedKey === "Escape") {
        setActivePoint(null);
        setRows((old) => {
          const curRowIndex = activePoint?.rowIndex as number;

          old[curRowIndex + 1] = [...Array(middRowEachBoxCount).fill("")];

          return [...old];
        });

        return;
      }

      if (activePoint && IsKeyALetterChar) {
        setRows((old) => {
          const curRowIndex = activePoint?.rowIndex as number;

          old[curRowIndex + 1] = [...old[curRowIndex]];
          old[curRowIndex + 1].splice(
            activePoint?.cellIndex as number,
            1,
            pressedKey.toLocaleUpperCase("Tr-tr")
          );

          return [...old];
        });
        setActivePoint(null);
        setActiveIndex((old) => old + 1);
      }

      
    }

    window.addEventListener("keyup", keyUpHandler);

    return () => {
      window.removeEventListener("keyup", keyUpHandler);
    };
  }, [activePoint, middRowEachBoxCount]);

  return (
    <div className="game-board">
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

      <div className="note">
        Please click on the cell you want to change and then press any letter on
        the keyboard.
        <br />
        <br />
        if you want to cancel entering the letter, you can press the ESC key
      </div>
    </div>
  );
}

export default GameBoard;
