import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import DateRow from "../../components/DateRow/DateRow";
import months from "../../constants/months";
import './CalendarLeague.css'
import paths from "../../constants/paths";
import useQuery from "../../utils/useQuery";
import getLeagueMatches from "../../services/getLeagueMatches";



const CalendarLeague = () => {
    const [isLoading, setLoading] = useState(true)
    const [calendar, setCalendar] = useState({})
    const [fullCalendar, setFullCalendar] = useState({})
    const [filterDate, changeFilterDate] = useState({
        withDate: null,
        fromDate: null
    })
    let match = useParams();
    const navigate = useNavigate();
    let query = useQuery();

    useEffect(() => {
        const sendRequest = async () => {
            getLeagueMatches(match.id)
                .then(res => {
                    const calendar = {}
                    res.data.matches.forEach(match => {
                        const date = new Date(match.utcDate)
                        const year = date.getFullYear()
                        const day = date.getDate()
                        const month = months[date.getMonth()]
                        const key = `${day} ${month} ${year}`
                        if (!calendar[key]) calendar[key] = []
                        calendar[key].push(match)
                    })
                    setFullCalendar(calendar)
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

        setCalendar(filteredCalendar)
    }, [filterDate, fullCalendar])

    useEffect(() => {
        const withDate = query.get('withDate');
        const fromDate = query.get('fromDate');
        changeFilterDate({withDate: !!withDate ? withDate : null, fromDate: !!fromDate ? fromDate : null})
    }, [query])

    const onChangeDate = ({target}) => {
        changeFilterDate({...filterDate, [target.name]: !!target.value ? target.value : null})
        const query = target.name === 'withDate' ? `?withDate=${target.value}&fromDate=${filterDate.fromDate}` : `?withDate=${filterDate.withDate}&fromDate=${target.value}`
        navigate(paths.calendarLeague(match.id) + query)
    }

    return (<div className="calendar-league-container">
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
        {!isLoading && !!Object.keys(calendar).length && Object.keys(calendar).map((key, index) => <DateRow key={index}
                                                                                                            date={key}
                                                                                                            matches={calendar[key]}/>)}
        {!isLoading && !Object.keys(calendar).length && <h3>Матчи не найдены</h3>}
    </div>)
}

export default CalendarLeague

