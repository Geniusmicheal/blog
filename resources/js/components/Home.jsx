import React, {useContext, useEffect, useMemo, useState, Children} from 'react';
import "./../../css/home.css";
import {ServiceContext} from "../context";
function Home() {
    const [loader, setLoader] = useState(false);
    const[newsData,setNewsData] = useState([]);
    const { filter, search, userToken } =  useContext(ServiceContext);


    useEffect(() => {
        setLoader(true);
        const controller = new AbortController();
        const signal = controller.signal;
        const headers = {
            'Content-Type': 'application/json',
            ...(userToken && {'Authorization': `Bearer ${userToken}`})
        }

        fetch(`http://127.0.0.1:8000/api/news?q=${search}`,
            { signal, method: 'GET',  headers}).
        then(res => res.json()).then(result =>{ setNewsData(result["results"]);  setLoader(false);})
        .catch(err =>{if(err.name==="AbortError") console.log("cancelled!"); setLoader(false);});

        return () => {controller.abort();};
    },[search]);

    const fetchRecord = useMemo(()=>{
        let { date, category, sources } = filter;
        sources = (sources? [sources] : ["Newsapi", "Guardian", "Nytimes"]);
        category = (category? [category] : ["General","Politics","Business","Sport","Technology","Arts","Lifestyle","Entertainment","Health","Science"]);
        // console.log(category, sources)
        const filterItem = newsData.filter(item => sources.includes(item['sources']) && category.includes(item['category']));
        if(filterItem.length>2 && date !='') {
            filterItem.sort((a, b)=>{return a.date - b.date});
            if(date=='Descending') filterItem.reverse();
        }
        return filterItem;
    },[filter['date'],filter['category'],filter['sources'], newsData.length]);

    if(loader) return(<div className="loader"></div>)
    return(<>
        {Children.toArray( fetchRecord.map(item => <div className="single-blog-post">
            <div className="post-details">
                <ul className="tags">
                    <li> <a> {item.category} </a> </li>
                </ul>
                 <h3>{item.header} </h3>


                <div className="user-details d-flex align-items-center">
                    <div className="details">
                        <a href="#"> <h4>{item.sources}</h4>  </a>
                        <p>{(new Date((item.date *1000))).toLocaleString('en-US',{
                            weekday: "long",  year: "numeric", month: "long", day: "numeric",
                            hour: 'numeric', minute: 'numeric', hour12: true
                        })}</p>
                    </div>
                </div>
            </div>

        </div>))}
    </>)



}

export default Home;
