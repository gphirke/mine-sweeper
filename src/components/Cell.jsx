import React from 'react';
import PropTypes from 'prop-types';
import "./css/cell.css";

export default class Cell extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onClick: PropTypes.func,
    onContextMenuClick: PropTypes.func
  }

  getValue() {
    const { value } = this.props;

    if (!value.isRevealed) {
      return this.props.value.isFlagged ? "🚩" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  render() {
    const { value, onClick, onContextMenuClick } = this.props;
    let className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");

    return (
      <div
        onClick={onClick}
        className={className}
        onContextMenu={onContextMenuClick}
      >
        {this.getValue()}
      </div>
    );
  }
}
