import React from 'react';
import "./Game.css"

const Game = ({homeTeam, awayTeam, score, statusmatches}) => {

const homeTeamScore = score.fullTime.homeTeam
const awayTeamScore = score.fullTime.awayTeam

    return (
        <div className="game-container">
            <div className="team-name">
                <span>{homeTeam.name}</span>
                <span>-</span>
                <span>{awayTeam.name}</span>
            </div>
            <div className="team-result">
                <span>{homeTeamScore}</span>
                <span>-</span>
                <span>{awayTeamScore}</span>
            </div>
            <div className="game-status" statusmatches={statusmatches}>
                <span>{statusmatches}</span>
            </div>
        </div>
    );
};

export default Game;