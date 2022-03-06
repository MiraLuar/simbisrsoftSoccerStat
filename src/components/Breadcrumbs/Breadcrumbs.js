import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Breadcrumbs.css"

const Breadcrumbs = ({navigations}) => {

    const navigate = useNavigate();

    const handleClick = (route, index) => {
        if(index === navigations.length - 1) return;
        navigate(route)
    }

    return (
        <div className="container-breadcrumbs">
            {navigations.map(({title, route}, index) => <span key={index} className="link" onClick={() => handleClick(route, index)}>{title}</span>)}
        </div>
    );
}

export default Breadcrumbs;