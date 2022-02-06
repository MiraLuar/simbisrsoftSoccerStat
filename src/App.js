import React from 'react'
import {
    Routes,
    Route,
    } from 'react-router-dom';

import './App.css';
import League from "./pages/League/League";
import CalendarLeague from "./pages/CalendarLegue/CalendarLeague";
import Teams from "./pages/Commands/Teams";
import CalendarCommand from "./pages/CalendarCommand/CalendarCommand";
import logo from './images/logo.png'
import routes from "./constants/routes";
import paths from "./constants/paths";
import { useNavigate } from "react-router-dom";

function App() {
    let navigate = useNavigate();
    return (
        <div>
            <div className="background-image"/>
            <header>
                <img onClick={() => {navigate(paths.league)}} className="logo" alt="" src={logo} />
                <div className="main-title">
                    <h1 id="left-title">Soccer</h1>
                    <h1 id="right-title">Stat</h1>
                </div>
            </header>

            <Routes>
                <Route path={routes.calendarLeague} element={<CalendarLeague/>}/>
                <Route path={routes.team} element={<Teams/>}/>
                <Route path={routes.calendarTeam} element={<CalendarCommand/>}/>
                <Route path={routes.league} element={<League/>}/>
            </Routes>
        </div>
    );
}

export default App;
