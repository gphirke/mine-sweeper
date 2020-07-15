import React from "react";
import "./css/cell.css";

export default function Card(props) {
  return (<div className="card-container">
      {props.type == "count" && <div className="count">{props.count}</div>}
      {props.type == "progress" && <div className="progress">{props.status}</div>}
    </div>)
}
