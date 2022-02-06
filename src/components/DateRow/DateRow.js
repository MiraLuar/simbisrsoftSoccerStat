import React from 'react';
import Game from "./components/Game/Game";
import "./DateRow.css"

const DateRow = ({date, matches}) => {
    return (
        <div className="date-row-container">
            <h3 className="date-row">{date}</h3>
            {matches.map(el => <Game key={el.id} awayTeam={el.awayTeam} homeTeam={el.homeTeam} score={el.score} statusmatches={el.status}/>)}
        </div>
    );
};

export default DateRow;