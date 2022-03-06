import React from 'react';
import "./Game.css"
import moment from "moment";

const dictionaryStatus = {
    SCHEDULED: 'Запранирован',
    LIVE: 'В прямом эфире',
    IN_PLAY: 'В игре',
    PAUSED: 'Пауза',
    FINISHED: 'Завершен',
    POSTPONED: 'Отложен',
    SUSPENDED: 'Приостановлен',
    CANCELED: 'Отменен'
}

const Game = ({homeTeam, awayTeam, score, status, utcDate}) => {
    const localDate = new Date(utcDate);
    const {
        fullTime: {homeTeam: homeFullTime, awayTeam: awayFullTime},
        extraTime: {homeTeam: homeExtraTime, awayTeam: awayExtraTime},
        penalties: {homeTeam: homePenalties, awayTeam: awayPenalties}
    } = score

    return (
        <div className="game-container">
            <div> {moment(localDate).format("DD-MM-YYYY kk:mm")} </div>
            <div className="team-name">
                <span>{homeTeam.name}</span>
                <span>-</span>
                <span>{awayTeam.name}</span>
            </div>
            <div className="team-result">
                <span>{homeFullTime} - {awayFullTime}</span>
            </div>
            <div className="team-result">
                <span>{homeExtraTime} - {awayExtraTime}</span>
            </div>
            <div className="team-result">
                <span>{homePenalties} - {awayPenalties}</span>
            </div>

            <div className="game-status" statusmatches={status}>
                <span>{dictionaryStatus[status]}</span>
            </div>
        </div>
    );
};

export default Game;