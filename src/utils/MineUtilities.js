export function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function getAllFlags(data) {
  let array = [];

  data.map(row => {
    row.map((ele) => {
      if (ele.isFlagged) {
        array.push(ele);
      }
    });
  });

  return array;
}

export function getAllMines(data) {
  let array = [];

  data.map(row => {
    row.map((ele) => {
      if (ele.isMine) {
        array.push(ele);
      }
    });
  });

  return array;
}

export function getHiddenCells(data) {
  let array = [];

  data.map(row => {
    row.map((ele) => {
      if (!ele.isRevealed) {
        array.push(ele);
      }
    });
  });

  return array;
}
