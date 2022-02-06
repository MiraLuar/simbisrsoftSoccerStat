import React from 'react'
import './Team.css'
import { useNavigate } from "react-router-dom";
import paths from "../../../constants/paths";

const Team = ({name, logo, id}) => {
    let navigate = useNavigate();
    return (<div className="team-card" onClick={() => {navigate(paths.calendarTeam(id))}}>
        <img className="logo-team" src={logo}/>
        <span className="title"> {name} </span>
    </div>)
}

export default Team