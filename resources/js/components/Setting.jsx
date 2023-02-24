import React, {useContext, useState} from "react";
import Alert from "./Alert";
import {ServiceContext} from "../context";

export default function Setting() {
    const [loader, setLoader] = useState(false);
    const { userToken, setUser, showAlert } =  useContext(ServiceContext);

    const sumbitEvent = async (event)=>{
        event.preventDefault();
        setLoader(true);
        const { category, sources, author } = event.target.elements;

        const formData = {
            sources:sources.value,
            author:author.value,
            category: category.value
        };

        await fetch('http://127.0.0.1/api/updatepreference',  {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}`},

            body: JSON.stringify(formData)
        }).then(res => res.json()).then(result => {
            const userDetail = JSON.parse(localStorage.getItem('userDetail'));
            const newState = {...userDetail, formData};
            setUser(newState)
            localStorage.setItem('userDetail', JSON.stringify(newState));
            showAlert( "Your news feed was customize successfully",'success');
            // if(result['error']) return
        })
        setLoader(false);

    }


    return (<div className="card widget">
        <div className="card-body">
            <Alert/>
            <form className="row" onSubmit={sumbitEvent}>
                <div className="col-lg-6">
                    <select className="form-select mb-3 mt-3" name='category' >
                        <option value=''>Set Your Preferred Categories</option>
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
                    </select >
                </div>

                <div className="col-lg-6">
                    <select className="form-select mb-3 mt-3" name='sources'>
                        <option value=''>Set Your Preferred Sources</option>
                        <option>Newsapi</option>
                        <option>Guardian</option>
                        <option>Nytimes</option>
                    </select>
                </div>

                <div className="col-lg-12">
                    <select className="form-select mb-3 mt-3" name='author'>
                        <option value=''>Set Your Preferred Author</option>
                        <option>International Herald Tribune</option>
                        <option>The New York Times</option>
                        <option>Wired</option>
                        <option>Engadget</option>
                        <option>BBC News</option>
                        <option>CNN</option>
                        <option>Gizmodo</option>
                        <option>The Verge</option>
                    </select>
                </div>

                <div className="mb-3 mt-3">
                    <button type="submit" className="btn btn-primary" disabled={loader}>
                        {!loader? 'Update Preference': 'Processing'}
                    </button>
                </div>
            </form>

        </div>
    </div>);
}

// <option>"source" nytimes: International Herald Tribune</option>
// <option>"source": nytimes "The New York Times"</option>
// <option>"source name": newsapi Wired</option>
// <option>"source name": newsapi Engadget</option>
// <option>"source name": newsapi BBC News</option>
// <option>"source name": newsapi CNN</option>
// <option>"source name": newsapi Gizmodo.com</option>
// <option>"source name": newsapi The Verge</option>
// <option>"source name": newsapi </option>
