import React, {useEffect, useState} from 'react'
import Team from "./components/Team";
import {useNavigate, useParams} from "react-router-dom";
import paths from "../../constants/paths";
import useQuery from "../../utils/useQuery";
import getTeams from "../../services/getTeams";
import "./Teams.css"
import iconSearch from "../../images/icon_search.png";
import ReactPaginate from "react-paginate";

const PER_PAGE = 9;

const Teams = () => {
    const [commands, setCommands] = useState([])
    const [fullCommands, setFullCommands] = useState([])
    const [findInput, changeFindInput] = useState('')
    const [itemOffset, setItemOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [currentItems, setCurrentItems] = useState([]);
    const navigate = useNavigate();

    let match = useParams();
    let query = useQuery();

    const changeCurrentItems = () => {
        const endOffset = itemOffset + PER_PAGE;
        setCurrentItems(commands.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(commands.length / PER_PAGE));
    }


    useEffect(() => {
        const sendRequest = async () => {
            getTeams(match.id)
                .then(res => {
                    setFullCommands(res.data.teams)
                })

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

    useEffect(changeCurrentItems, [itemOffset, commands])

    const onChangeName = ({target: {value}}) => {
        changeFindInput(value)
        const query = value ? `?searchCommand=${value}` : ''
        navigate(paths.teams + query)
    }

    const handlePageClick = (event) => {
        const newOffset = (event.selected * PER_PAGE) % commands.length;
        setItemOffset(newOffset);
    };

    return (
        <div className="container-teams">
            <div className="filter-teams">
                <span> Поиск: </span>
                <input onChange={onChangeName}/>
                <img className="icon-search" src={iconSearch}/>
            </div>
            <div className="table-teams">
                {currentItems.map(command => <Team
                    key={command.id} id={command.id} logo={command.crestUrl} name={command.name}
                    shortName={command.shortName}/>)}
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
        </div>
    )
}

export default Teams