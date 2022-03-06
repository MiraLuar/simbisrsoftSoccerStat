import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import getLeagues from "../../services/getLeagues";
import Competitions from "./components/Competitions/Competitions";
import availableCompetitions from "../../constants/availableCompetitions";
import "./League.css"
import paths from "../../constants/paths";
import useQuery from "../../utils/useQuery";
import iconSearch from "../../images/icon_search.png"
import ReactPaginate from "react-paginate";

const PER_PAGE = 9;

const equals = ({code}) => availableCompetitions.some(el => el === code)

const League = () => {
    const [league, setLeague] = useState([])
    const [fullLeague, setFullLeague] = useState([])
    const [findInput, changeFindInput] = useState('')
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const navigate = useNavigate();

    let query = useQuery();

    const changeCurrentItems = () => {
        const endOffset = itemOffset + PER_PAGE;
        setCurrentItems(league.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(league.length / PER_PAGE));
    }

    useEffect(() => {
        const sendRequest = async () => {
            getLeagues()
                .then(res => {
                    setFullLeague(res.data.competitions.filter(equals))
                })

        }
        sendRequest()
    }, [])

    useEffect(() => {
        const searchLeague = query.get('searchLeague');
        changeFindInput(searchLeague || '')
    }, [query])

    useEffect(() => {
        setLeague(fullLeague.filter(command => command.name.toLowerCase().includes(findInput.toLowerCase())))
    }, [findInput, fullLeague])

    useEffect(changeCurrentItems, [itemOffset, league])

    const onChangeName = ({target: {value}}) => {
        changeFindInput(value)
        const query = value ? `?searchLeague=${value}` : ''
        navigate(paths.league + query)
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * PER_PAGE) % league.length;
        setItemOffset(newOffset);
    };

    return (<div className="container-league">
        <div className="filter-league">
            <span> Поиск: </span>
            <input onChange={onChangeName}/>
            <img className="icon-search" src={iconSearch}/>
        </div>
        <div className="table-league">
            {currentItems.map(command => <Competitions key={command.id} id={command.id} logo={command.emblemUrl}
                                                 name={command.name} area={command.area.name}/>)}
        </div>
        <div className="col-12 flex-column d-none d-sm-flex">
            <ReactPaginate             containerClassName="pagination justify-content-center"
                                       pageClassName="page-item"
                                       pageLinkClassName="page-link"
                                       previousClassName="page-item"
                                       previousLinkClassName="page-link"
                                       nextClassName="page-item"
                                       nextLinkClassName="page-link"
                                       activeClassName="active"
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

export default League

