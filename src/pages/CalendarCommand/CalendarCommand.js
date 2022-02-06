import React, {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import months from "../../constants/months";
import DateRow from "../../components/DateRow/DateRow";
import "./CalendarCommand.css"
import useQuery from "../../utils/useQuery";
import paths from "../../constants/paths";
import getTeamMatches from "../../services/getTeamMatches";

const CalendarCommand = () => {
    const [isLoading, setLoading] = useState(true)
    const [calendarTeam, setCalendarTeam] = useState({})
    const [fullCalendar, setFullCalendarTeam] = useState({})
    const [filterDate, changeFilterDate] = useState({
        withDate: null,
        fromDate: null
    })
    let match = useParams();
    const navigate = useNavigate();
    let query = useQuery();

    useEffect(() => {
        const sendRequest = async () => {
            getTeamMatches(match.id)
                .then(res => {
                    const calendar = {}
                    res.data.matches.forEach(match => {
                        const date = new Date(match.utcDate)
                        const year = date.getFullYear()
                        const day = date.getDate()
                        const month = months[date.getMonth()]
                        const key = `${day} ${month} ${year}`
                        if(!calendar[key]) calendar[key] = []
                        calendar[key].push(match)
                    })
                    setFullCalendarTeam(calendar)
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setLoading(false)
                })
        }
        setTimeout(sendRequest, 2000)
        // sendRequest()
    }, [])

    useEffect(() => {
        const filteredCalendar = {}
        const withDate = new Date(filterDate.withDate).valueOf() - 86400000 || null
        const fromDate = new Date(filterDate.fromDate).valueOf() || null
        Object.keys(fullCalendar).forEach((date) => {
            const [day, month, year] = date.split(" ")
            const curDate = new Date(`${year}-${months.findIndex(curMonth => curMonth === month) + 1}-${day}`).valueOf();

            if (withDate && fromDate)
                if (curDate < withDate || curDate > fromDate) return;
            if (withDate && !fromDate)
                if (curDate < withDate) return;
            if (!withDate && fromDate)
                if (curDate > fromDate) return;
            filteredCalendar[date] = fullCalendar[date];
        })

        setCalendarTeam(filteredCalendar)
    }, [filterDate, fullCalendar])

    useEffect(() => {
        const withDate = query.get('withDate');
        const fromDate = query.get('fromDate');
        changeFilterDate({withDate: !!withDate ? withDate : null, fromDate: !!fromDate ? fromDate : null})
    }, [query])

    const onChangeDate = ({target}) => {
        changeFilterDate({...filterDate, [target.name]: !!target.value ? target.value : null})
        const query = target.name === 'withDate' ? `?withDate=${target.value}&fromDate=${filterDate.fromDate}` : `?withDate=${filterDate.withDate}&fromDate=${target.value}`
        navigate(paths.calendarTeam(match.id) + query)
    }

    return (<div className="calendar-command-container">
        <div className="filter">
            <span> С </span>
            <input
                type="date"
                name="withDate"
                value={filterDate.withDate || ""}
                onChange={onChangeDate}
            />
            <span> ПО </span>
            <input
                type="date"
                name="fromDate"
                value={filterDate.fromDate || ""}
                onChange={onChangeDate}
            />
        </div>
        {isLoading && <h3>Загрузка...</h3>}
        {!isLoading && !!Object.keys(calendarTeam).length && Object.keys(calendarTeam).map((key, index) => <DateRow date={key} matches={calendarTeam[key]}/>)}
        {!isLoading && !Object.keys(calendarTeam).length && <><h4>У данной команды нет матчей.</h4><h4 onClick={() => navigate(-1)}> Вернуться к списку команд</h4></>}
    </div>)
}

export default CalendarCommand