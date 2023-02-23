import React, { useContext } from "react";
import { ServiceContext } from "../context";
import { useLocation } from "react-router-dom";

export default function Filter() {
    const {setFilter} =  useContext(ServiceContext);
    const location = useLocation();


    const FilterBtn = (e) => {
        setFilter(prevState => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    if(location.pathname !== '/')return (<></>);
    return (<form className="single-widget tags-widget">
        <h4 className="widget-title">Sections</h4>
        <select className="form-select" onChange={FilterBtn} name='date'>
            <option disabled selected>Sort by Date</option>
            <option>Ascending</option>
            <option>Descending</option>
        </select>

        <select className="form-select" onChange={FilterBtn} name='category'>
            <option value=''>Select Categories</option>
            <option>General</option>
            <option>Politics</option>
            <option>Business</option>
            <option>Sport</option>
            <option>Technology</option>
            <option>Arts</option>
            <option>Lifestyle</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Science</option>
        </select>

        <select className="form-select" onChange={FilterBtn} name='sources'>
            <option value=''>Select Sources</option>
            <option>Newsapi</option>
            <option>Guardian</option>
            <option>Nytimes</option>
        </select>
    </form>)
}

