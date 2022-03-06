import React from 'react'
import { useNavigate } from "react-router-dom";
import paths from "../../../../constants/paths";
import './Competitions.css'
import defaultLeague from "../../../../images/league_null.png"

const Competitions = ({name, logo, id, area} ) => {
    let navigate = useNavigate();
    return (<div onClick={() => {navigate(paths.calendarLeague(id))}} className="competitions-container">
        <img className="logo-league" src={logo ? logo : defaultLeague}/>
        <span className="title1">{name}</span>
        <span className="title2">{area}</span>
    </div>)
}

export default Competitions