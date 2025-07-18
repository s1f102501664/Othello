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

  const [marker, setMarker] = useState([
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ]);

  const [turn, setTurn] = useState(1);
  const [skip_count, setSkipCount] = useState(0);
  const [firstFlag, setFlag] = useState(false);
  const [isGameFinished, setFinishFlag] = useState(false);

  //マスに置けるかどうか判定、置ける場合は変化するCellの情報の格納した配列を返す。置けない場合は空の配列を返す
  //注意：選択したマスの色は考慮しません
  const checkCell = (b: number[][], rowIndex: number, cellIndex: number, player: number) => {
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
        //console.log('a');
        continue;
      }
      //確認する方向のマスの一マス目が相手のマスかどうかの判定
      if (!(b[rowIndex + direction[0]][cellIndex + direction[1]] === enemy)) {
        //console.log('b');
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
        if (b[rowIndex + direction[0] * i][cellIndex + direction[1] * i] === 0) {
          //そのセルにコマが置かれていない
          listMassugu.splice(0);
          //console.log('破棄された');
          break;
        } else if (b[rowIndex + direction[0] * i][cellIndex + direction[1] * i] === player) break;
        else listMassugu.push([rowIndex + direction[0] * i, cellIndex + direction[1] * i]);
      }

      listMassugu.map((position) => cellList.push(position));
    }
    return cellList;
  };

  //Markerを更新する。また一個でもtrueがある場合trueを返し、一個もない場合はfalseを返す。
  const updataMarker = (b: number[][], player: number, changeMarker: boolean = true) => {
    let check = false;
    const newMarker = [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
    ];
    b.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        if (cell === 0) {
          if (checkCell(b, rowIndex, cellIndex, player).length !== 0) {
            newMarker[rowIndex][cellIndex] = true;
            check = true;
          }
        }
      });
    });

    if (changeMarker) setMarker(newMarker);

    return check;
  };

  if (firstFlag === false) {
    setFlag(true);
    updataMarker(board, turn);
  }

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const newBoard = structuredClone(board);
    let newTurn = turn;
    console.log('Click!');

    if (marker[rowIndex][cellIndex]) {
      newBoard[rowIndex][cellIndex] = newTurn;
      for (const cell of checkCell(newBoard, rowIndex, cellIndex, newTurn))
        newBoard[cell[0]][cell[1]] = newTurn;

      newTurn = turn === 1 ? 2 : 1;
      setTurn(newTurn);
    } else alert('そこは置けない。ばーか');

    setBoard(newBoard);
    console.log(newBoard);

    //ゲームが続行可能かどうかと結果
    if (!updataMarker(newBoard, newTurn) && !updataMarker(newBoard, newTurn === 1 ? 2 : 1, false)) {
      alert(
        `Game Set${
          newBoard
            .map((row) => {
              return row.filter((num) => num === 1).length;
            })
            .reduce((sum, element) => {
              return sum + element;
            }, 0) ===
          newBoard
            .map((row) => {
              return row.filter((num) => num === 2).length;
            })
            .reduce((sum, element) => {
              return sum + element;
            }, 0)
            ? '引き分け' // https://arxiv.org/abs/2310.19387
            : newBoard
                  .map((row) => {
                    return row.filter((num) => num === 1).length;
                  })
                  .reduce((sum, element) => {
                    return sum + element;
                  }, 0) >
                newBoard
                  .map((row) => {
                    return row.filter((num) => num === 2).length;
                  })
                  .reduce((sum, element) => {
                    return sum + element;
                  }, 0)
              ? '黒の勝ち'
              : '白の勝ち'
        }`,
      ); //alert
      setFinishFlag(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.display_player}>
        {isGameFinished ? 'ゲーム終了' : `現在のターンは${turn === 1 ? '黒' : '白'}`}
      </div>
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
              ) : marker[rowIndex][cellIndex] ? (
                <div className={styles.stone} style={{ backgroundColor: 'yellow' }} />
              ) : null}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
