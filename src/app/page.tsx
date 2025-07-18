'use client';

import { useState } from 'react';
import styles from './page.module.css';

const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

export default function Home() {
  //x↓ y→
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [turn, setTurn] = useState(1);

  //マスに置けるかどうか判定、置ける場合は変化するCellの情報の格納した配列を返す。置けない場合は空の配列を返す
  const checkCell = (rowIndex: number, cellIndex: number, player: number) => {
    const enemy = player === 1 ? 2 : 1;
    const cellList: [number, number][] = [];
    for (const direction of directions) {
      //確認する方向のマスの一マス目が配列の中かどうかの判定
      if (
        !(
          rowIndex + direction[0] >= 0 &&
          cellIndex + direction[1] >= 0 &&
          cellIndex + direction[1] <= 7 &&
          rowIndex + direction[0] <= 7
        )
      ) {
        console.log('a');
        continue;
      }
      //確認する方向のマスの一マス目が相手のマスかどうかの判定
      if (!(board[rowIndex + direction[0]][cellIndex + direction[1]] === (player === 1 ? 2 : 1))) {
        console.log('b');
        continue;
      }

      //確認する方向で色を変えることができるマスを格納する配列
      const listMassugu: [number, number][] = [];

      //どこまで確かめるかの数
      const x = direction[0] === 0 ? 8 : direction[0] === 1 ? 7 - rowIndex : rowIndex;
      const y = direction[1] === 0 ? 8 : direction[1] === 1 ? 7 - cellIndex : cellIndex;
      const count = x > y ? y : x;
      //console.log(count, x > y, direction);

      for (let i = 1; i < count; i++) {
        if (board[rowIndex + direction[0] * i][cellIndex + direction[1] * i] === 0) {
          //そのセルにコマが置かれていない
          listMassugu.splice(0);
          console.log('破棄された');
          break;
        } else if (board[rowIndex + direction[0] * i][cellIndex + direction[1] * i] === player)
          break;
        else listMassugu.push([rowIndex + direction[0] * i, cellIndex + direction[1] * i]);
      }

      listMassugu.map((position) => cellList.push(position));
    }
    return cellList;
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const newBoard = structuredClone(board);

    console.log('Click!');
    const changeCells = checkCell(rowIndex, cellIndex, turn);
    if (changeCells.length !== 0) {
      newBoard[rowIndex][cellIndex] = turn;
      for (const cell of changeCells) newBoard[cell[0]][cell[1]] = turn;

      setTurn(turn === 1 ? 2 : 1);
    } else alert('そこは置けない。ばーか');

    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.display_player}>現在のターンは{turn === 1 ? '黒' : '白'}</div>
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((color, cellIndex) => (
            <div
              className={styles.cell}
              key={cellIndex}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
            >
              {color === 1 ? (
                <div className={styles.stone} style={{ backgroundColor: 'black' }} />
              ) : color === 2 ? (
                <div className={styles.stone} style={{ backgroundColor: 'white' }} />
              ) : null}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
