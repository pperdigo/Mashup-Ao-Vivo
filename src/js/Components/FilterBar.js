import { useState, useContext } from "react";
import "../../Styles/FilterBar.css";

import filterIcon from "../../img/material-symbols_filter-alt.svg";
import filterClosedIcon from "../../img/closeFilterbar.svg";

import QlikObject from "../qlik/QlikObject";
import CurrentSelections from "./CurrentSelections";

import { AppContext } from "../../App";

function FilterBar() {
  const [open, setOpen] = useState(false);
  const app = useContext(AppContext);

  const clearAll = () => {
    app.clearAll();
  };

  return (
    <>
      <div
        className="sidebar-btn"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <img src={filterIcon} alt=""></img>
      </div>

      <div className={open ? "right-sidebar active" : "right-sidebar"}>
        <div className="top-sidebar">
          <span>Current selections</span>
          <div
            className="sidebar-btn"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <img src={filterClosedIcon} alt=""></img>
          </div>
        </div>
        <div className="sidebar-conent">
          <CurrentSelections />
          <div onClick={() => clearAll()} className="clear-btn">
            Clear filters
          </div>
          <div className="filters">
            <QlikObject qlikId={"eSheame"} objectId={"filter-2"} />
            <QlikObject qlikId={"dEzPRD"} objectId={"filter-3"} />
            <QlikObject qlikId={"rpWqb"} objectId={"filter-4"} />
            <QlikObject qlikId={"EaZg"} objectId={"filter-5"} />
            <QlikObject qlikId={"FbxPfcu"} objectId={"filter-6"} />
            <QlikObject qlikId={"zjnduXK"} objectId={"filter-7"} />
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setOpen(!open);
        }}
        className={open ? "close-right-sidebar active" : "close-right-sidebar"}
      ></div>
    </>
  );
}

export default FilterBar;
