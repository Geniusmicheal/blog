import React, {useContext, useState} from 'react';
import Alert from "./Alert";
import  {ServiceContext} from "../context";
import  { Navigate, useNavigate } from 'react-router-dom';

const tabBtn = (position, e)=> {
    const nav_link = e.target.closest('.nav-link');
    const parentEle = nav_link.parentElement;
    if(!nav_link.classList.contains("active")){
        const paneTab = document.getElementsByClassName("tab-pane")
        nav_link.classList.add('active');
        if(position==='first'){
            paneTab[1].classList.add("fade");
            paneTab[0].classList.add("active");
            paneTab[0].classList.remove("fade");
            paneTab[1].classList.remove("active");
            parentEle.nextElementSibling.children[0].classList.remove('active');
        }else{
            paneTab[0].classList.add("fade");
            paneTab[1].classList.add("active");
            paneTab[1].classList.remove("fade");
            paneTab[0].classList.remove("active");
            parentEle.previousElementSibling.children[0].classList.remove('active');
        }
    }
}
const sumbitEvent = async ({setLoader, showAlert, setUserDetail, navigate}, event)=>{
    event.preventDefault();
    setLoader(true);
    const ele = [...event.target.querySelectorAll("input")];
    let submitEle = ele.pop();
    const formData = {};
    for (let i = 0; i < ele.length; i++) {
        const key = ele[i].name;
        if(!key)continue;
        formData[key] =  ele[i].value
    }
    await fetch(`http://127.0.0.1/api/${submitEle['name'].toLowerCase()}`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    }).then(res => res.json()).then(result => {
        if(result['error']) return showAlert(result['error'] ,'danger');
        const {token,user}=result
        setUserDetail(token,user)
        navigate()('/');
    })
    setLoader(false);
}


export default function Auth() {
    const [loader, setLoader] = useState(false);
    const {showAlert,userToken, setUserDetail} =  useContext(ServiceContext);
    if(userToken) return <Navigate to={'/'} replace={true} />

    return (<div className="card widget">
        <div className="card-body">
            <ul className="nav nav-tabs nav-justified" role="tablist">
                <li className="nav-item" onClick={tabBtn.bind(this,'first')} style={{cursor: "pointer"}}>
                    <a className="nav-link active" ><h4 className="widget-title">Login</h4></a>
                </li>
                <li className="nav-item" onClick={tabBtn.bind(this,'second')} style={{cursor: "pointer"}}>
                    <a className="nav-link" ><h4 className="widget-title">Signup</h4></a>
                </li>
            </ul>

            <div className="tab-content">
                <Alert/>
                <div className="tab-pane active">
                    <form method="post" onSubmit={sumbitEvent.bind(this,{setLoader, showAlert, setUserDetail, useNavigate})} autoComplete="off">
                        <div className="mb-3 mt-3">
                            <label htmlFor="usr">Email:</label>
                            <input type="email" className="form-control" placeholder="email" required name="email" />
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="pwd">Password</label>
                            <input type="password" className="form-control" placeholder="password" required  name="password" />
                        </div>

                        <div className="mb-3 mt-3">
                            <input type="submit" value="Login" className="btn btn-primary" disabled={loader} name="Login"/>
                        </div>
                    </form>
                </div>

                <div className="tab-pane fade ">
                    <form  method="post" onSubmit={sumbitEvent.bind(this,{setLoader, showAlert, setUserDetail, useNavigate})} >

                        <div className="mb-3 mt-3">
                            <label htmlFor="usr">Username</label>
                            <input type="text" className="form-control" placeholder="Username" required name="username"/>
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="usr">Email:</label>
                            <input type="email" className="form-control" placeholder="User Email" required name="email"/>
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="pwd">Password</label>
                            <input type="password" className="form-control" placeholder="password" required
                                   name="password"/>
                        </div>

                        <div className="mb-3 mt-3">
                            <label htmlFor="pwd">Password Confirmation</label>
                            <input type="password" className="form-control" placeholder="password" required
                                   name="password_confirmation"/>
                        </div>

                        <div className="mb-3 mt-3">
                            <input type="submit" value="Signup" className="btn btn-primary" disabled={loader} name="Signup"/>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>)
}
