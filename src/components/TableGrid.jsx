import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell.jsx';
import "./css/tablegrid.css";
import Card from "./Card.jsx";
import {getAllMines, getAllFlags, getHiddenCells, getRandomNumber} from "../utils/MineUtilities.js";

export default class TableGrid extends Component {

  static propTypes = {
    row: PropTypes.number,
    column: PropTypes.number,
    mines: PropTypes.number,
  }

  state = {
    status: "In progress...",
    mineCount: this.props.mines,
    gridData: this.constructData(this.props.row, this.props.column, this.props.mines),
  };

  constructData(row, column, mines) {
    let data = this.createEmptyArray(row, column);
    data = this.addMines(data, row, column, mines);
    data = this.getNeighbours(data, row, column);
    return data;
  }

  createEmptyArray(row, column) {
    let data = [];

    for (let i = 0; i < row; i++) {
      data.push([]);
      for (let j = 0; j < column; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  addMines(data, row, column, noOfmines) {
    let randomColumn, randomRow, minesPlanted = 0;

    while (minesPlanted < noOfmines) {
      randomColumn = getRandomNumber(column);
      randomRow = getRandomNumber(row);
      if (!(data[randomColumn][randomRow].isMine)) {
        data[randomColumn][randomRow].isMine = true;
        minesPlanted++;
      }
    }

    return data;
  }

  getNeighbours(data, row, column) {
    let updatedData = data, index = 0;

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (data[i][j].isMine !== true) {
          let mine = 0;
          const area = this.traverseAllCell(data[i][j].x, data[i][j].y, data);
          area.map(value => {
            if (value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = mine;
        }
      }
    }

    return (updatedData);
  };

  traverseAllCell(x, y, data) {
    const el = [];

    //up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    //down
    if (x < this.props.row - 1) {
      el.push(data[x + 1][y]);
    }

    //left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    //right
    if (y < this.props.column - 1) {
      el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < this.props.column - 1) {
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < this.props.row - 1 && y < this.props.column - 1) {
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < this.props.row - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }

  showAllCells() {
    let updatedData = this.state.gridData;
    updatedData.map((row) => {
      row.map((ele) => {
        ele.isRevealed = true;
      });
    });
    this.setState({
      gridData: updatedData
    })
  }

  showEmptyCells(x, y, data) {
    let area = this.traverseAllCell(x, y, data);
    area.map(value => {
      if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.showEmptyCells(value.x, value.y, data);
        }
      }
    });
    return data;

  }

  onCellClick(x, y) {

    if (this.state.gridData[x][y].isRevealed || this.state.gridData[x][y].isFlagged) {
      return null;
    };

    if (this.state.gridData[x][y].isMine) {
      this.setState({ status: "You Lost the game. Please reload to play again." });
      this.showAllCells();
    }

    let updatedData = this.state.gridData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = this.showEmptyCells(x, y, updatedData);
    }

    if (getHiddenCells(updatedData).length === this.props.mines) {
      this.setState({ mineCount: 0, status: "You Win the game!! Please reload to play again !!" });
      this.showAllCells();
    }

    this.setState({
      gridData: updatedData,
      mineCount: this.props.mines - getAllFlags(updatedData).length,
    });
  }

  handleContextMenu(e, x, y) {
    e.preventDefault();
    let updatedData = this.state.gridData;
    let mines = this.state.mineCount;

    if (updatedData[x][y].isRevealed) {
      return ;
    };

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if (mines === 0) {
      const mineArray = getAllMines(updatedData);
      const flagArray = getAllFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {
        this.setState({ mineCount: 0, gameStatus: "You Win the game !! Please reload to play again !!" });
        this.showAllCells();
      }
    }

    this.setState({
      gridData: updatedData,
      mineCount: mines,
    });
  }

  renderGrid(data) {
    return data.map((row) => {
      return row.map((dataitem) => {
        return (
          <div key={dataitem.x * row.length + dataitem.y}>
            <Cell
              onClick={() => this.onCellClick(dataitem.x, dataitem.y)}
              onContextMenuClick={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {(row[row.length - 1] === dataitem) ? <div className="clear" /> : ""}
          </div>);
      })
    });

  }

  reload() {
    window.location.reload();
  }

  getRemainingMines(){
    return (<div><span className="remaining-count">{"Remaining count : "+ this.state.mineCount}</span></div>);
  }

  getStatusPanel(){
    return (<Fragment>
      <div>
        <input className="reload-button" type="button" onClick={this.reload} value="Reload"/>
      </div>
      {this.getRemainingMines()}
      <div><span>Game status: {this.state.status}</span></div>
      <div>
        <Card type="progress" count={this.state.status} />
      </div>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        {this.getStatusPanel()}
        {this.renderGrid(this.state.gridData)}
      </Fragment>
    );
  }
}
