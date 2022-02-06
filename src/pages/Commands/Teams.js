import React, {useEffect, useState} from 'react'
import Team from "./components/Team";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import paths from "../../constants/paths";
import useQuery from "../../utils/useQuery";
import getTeams from "../../services/getTeams";

const Teams = () => {
    const [commands, setCommands] = useState([])
    const [fullCommands, setFullCommands] = useState([])
    const [findInput, changeFindInput] = useState('')
    const navigate = useNavigate();

    let match = useParams();
    let query = useQuery();

    useEffect(() => {
        const sendRequest = async () => {
            getTeams(match.id)
                .then(res => {
                    setFullCommands(res.data.teams)
                })
                .catch(err => console.log(err))
        }
        sendRequest()
    }, [])

    useEffect(() => {
        const searchCommand = query.get('searchCommand');
        changeFindInput(searchCommand || '')
    }, [query])

    useEffect(() => {
        setCommands(fullCommands.filter(command => command.name.toLowerCase().includes(findInput.toLowerCase())))
    }, [findInput, fullCommands])

    const onChangeName = ({ target: { value } }) => {
        changeFindInput(value)
        const query = value ? `?searchCommand=${value}` : ''
        navigate(paths.team(match.id) + query)
    }

    return (
        <div className="containerTeams">
            <div className="filter">
                <span> Поиск по названию: </span>
                <input onChange={onChangeName}/>
            </div>
            <div className="table-teams">
                {commands.map(command => <Team key={command.id} id={command.id} logo={command.crestUrl} name={command.name}/>)}
            </div>
        </div>
    )
}

export default Teams