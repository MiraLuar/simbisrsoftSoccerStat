import React from 'react'
import { useNavigate } from "react-router-dom";
import paths from "../../../../constants/paths";
import './Competitions.css'
import defaultLeague from "../../../../images/league_null.png"

const Competitions = ({name, logo, id} ) => {
    let navigate = useNavigate();
    return (<div className="competitions-container">
        <img className="logo-league" src={logo ? logo : defaultLeague}/>
        <span className="title">{name}</span>
        <div onClick={() => {navigate(paths.calendarLeague(id))}}>
            Calendar
        </div>
        <div onClick={() => {navigate(paths.team(id))}}>
            Teams
        </div>
    </div>)
}

export default Competitions