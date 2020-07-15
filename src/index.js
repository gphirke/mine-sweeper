import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TableGrid from "./components/TableGrid.jsx";

const gridProps = {
  row: 10,
  column: 10,
  noOfMines: 12,

};

function MineSweeperApp() {
  const style = {width: "600px",
    left: "50%",
    position: "relative",
    transform: "translateX(-50%)"
  };

  return (
    <div style={style}>
      <TableGrid row={gridProps.row} column={gridProps.column} mines={gridProps.noOfMines} />
    </div>
  );

}

ReactDOM.render(<MineSweeperApp />, document.getElementById("root"));
