import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import "./CalendarCommand.css"
import useQuery from "../../utils/useQuery";
import paths from "../../constants/paths";
import getTeamMatches from "../../services/getTeamMatches";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Game from "../../components/DateRow/components/Game/Game";
import ReactPaginate from "react-paginate";

const defaultNavigation = [
    {
        title: 'Команды',
        route: paths.teams
    }
]

const PER_PAGE = 10;

const CalendarCommand = () => {
    const [isLoading, setLoading] = useState(true)
    const [navigation, changeNavigation] = useState(defaultNavigation)
    const [matches, setMatches] = useState([])
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const [fullMatches, setFullMatches] = useState([])
    const [filterDate, changeFilterDate] = useState({
        withDate: null,
        fromDate: null
    })
    let match = useParams();
    const navigate = useNavigate();
    let query = useQuery();
    const location = useLocation();

    const changeCurrentItems = () => {
        const endOffset = itemOffset + PER_PAGE;
        setCurrentItems(matches.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(matches.length / PER_PAGE));
    }

    useEffect(() => {
        if (!location.state) return;
        changeNavigation(defaultNavigation.concat({title: location.state.teamName}))
    }, [location]);

    useEffect(() => {
        const sendRequest = async () => {
            getTeamMatches(match.id)
                .then(res => {

                    setFullMatches(res.data.matches)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        sendRequest()
    }, [])

    useEffect(() => {
        const withDate = new Date(filterDate.withDate).valueOf() || null
        const fromDate = new Date(filterDate.fromDate).valueOf() || null
        setMatches(fullMatches.filter((match) => {
            const currentDate = new Date(match.utcDate)
            if (withDate && fromDate)
                if (currentDate < withDate || currentDate > fromDate + 86400000) return false;
            if (withDate && !fromDate)
                if (currentDate < withDate) return false;
            if (!withDate && fromDate)
                return !(currentDate > fromDate + 86400000)
            return true
        }))
        setItemOffset(0)
    }, [filterDate, fullMatches])

    useEffect(() => {
        const withDate = query.get('withDate');
        const fromDate = query.get('fromDate');
        changeFilterDate({withDate: !!withDate ? withDate : null, fromDate: !!fromDate ? fromDate : null})
    }, [query])

    useEffect(changeCurrentItems, [itemOffset, matches])

    const onChangeDate = ({target}) => {
        changeFilterDate({...filterDate, [target.name]: !!target.value ? target.value : null})
        const params = []
        if (target.name === 'withDate') {
            if (target.value)
                params.push(`withDate=${target.value}`)
            if (filterDate.fromDate)
                params.push(`fromDate=${filterDate.fromDate}`)
        } else {
            if (filterDate.withDate)
                params.push(`withDate=${filterDate.withDate}`)
            if (target.value)
                params.push(`fromDate=${target.value}`)
        }
        const query = params.length ? `?${params.join('&')}` : ''
        navigate(paths.calendarTeam(match.id) + query)
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * PER_PAGE) % matches.length;
        setItemOffset(newOffset);
    };

    const isEmpty = !matches.length

    return (<div className="calendar-command-container">
        <Breadcrumbs navigations={navigation}/>
        <span className="title-n"> Матчи</span>
        <div className="filter-teams">
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
        {!isLoading && !isEmpty && currentItems.map((game, index) => <Game key={index} {...game} />)}
        {!isLoading && isEmpty && <div className="back">
            <h4>У данной команды нет матчей.</h4>
            <h4 className="back-l" onClick={() => navigate(-1)}> Вернуться к списку команд</h4>
        </div>}
        <div className="col-12 flex-column d-none d-sm-flex">
            <ReactPaginate containerClassName="pagination justify-content-center"
                           pageClassName="page-item"
                           pageLinkClassName="page-link"
                           previousClassName="page-item"
                           previousLinkClassName="page-link"
                           nextClassName="page-item"
                           nextLinkClassName="page-link"
                           activeClassName="active"
                           breakClassName="break-pagination"
                           breakLabel="..."
                           nextLabel=">"
                           onPageChange={handlePageClick}
                           pageRangeDisplayed={5}
                           pageCount={pageCount}
                           previousLabel="<"
                           renderOnZeroPageCount={null}/>
        </div>
    </div>)
}

export default CalendarCommand