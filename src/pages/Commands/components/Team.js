import React from 'react'
import './Team.css'
import {useNavigate} from "react-router-dom";
import paths from "../../../constants/paths";

const Team = ({name, logo, id, shortName}) => {
    let navigate = useNavigate();

    const route = () => {
        navigate(paths.calendarTeam(id), { state: { teamName: name } })
    }

    return (<div className="team-card" onClick={route}>
        <img className="logo-team" src={logo}/>
        <span className="title-1"> {name} </span>
        <span className="title-2"> {shortName} </span>
    </div>)
}

export default Team