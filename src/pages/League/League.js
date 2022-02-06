import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import getLeagues from "../../services/getLeagues";
import Competitions from "./components/Competitions/Competitions";
import availableCompetitions from "../../constants/availableCompetitions";
import "./League.css"
import "../Commands/Teams.css"
import paths from "../../constants/paths";
import useQuery from "../../utils/useQuery";

const equals = ({ code }) => availableCompetitions.some(el => el === code)

const League = () => {
    const [league, setLeague] = useState([])
    const [fullLeague, setFullLeague] = useState([])
    const [findInput, changeFindInput] = useState('')
    const navigate = useNavigate();

    let query = useQuery();

    useEffect(() => {
        const sendRequest = async () => {
            getLeagues()
                .then(res => {
                    setFullLeague(res.data.competitions.filter(equals))
                })
                .catch(err => console.log(err))
        }
        sendRequest()
    }, [])

    useEffect(() => {
        const searchLeague = query.get('searchLeague');
        changeFindInput(searchLeague || '')
    }, [query])

    useEffect(() => {
        console.log({fullLeague})
        setLeague(fullLeague.filter(command => command.name.toLowerCase().includes(findInput.toLowerCase())))
    }, [findInput, fullLeague])

    const onChangeName = ({ target: { value } }) => {
        changeFindInput(value)
        const query = value ? `?searchLeague=${value}` : ''
        navigate(paths.league + query)
    }

    return (<div className="container-league">
        <div className="filter">
            <span> Поиск по названию: </span>
            <input onChange={onChangeName}/>
        </div>
        <div className="table-league">
        {league.map(command => <Competitions key={command.id} id={command.id} logo={command.emblemUrl} name={command.name}/>)}
        </div>
    </div>)
}

export default League

