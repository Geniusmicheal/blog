
import { Link, useNavigate } from 'react-router-dom';
import React, {useEffect, useRef, useContext} from 'react';
import "./../../css/navbar.css";
import Logo from "./../../image/logo.png";
import Profile from "./../../image/profile.png"
import {ServiceContext} from "../context";

const Navbar = () => {
    const _ref = useRef();
    const { userToken, setUserToken, user, setUser, setSearch } =  useContext(ServiceContext);
    const navigate = useNavigate();

    const menuBar =  (e) =>  {
        e.target.closest('.menu_bar').classList.toggle("change");
        if(_ref.current.style.width==="300px")_ref.current.style.width="0px";
        else _ref.current.style.width="300px";
    }
    useEffect(() => {
        window.addEventListener("resize",  () =>{
            if(window.matchMedia("screen and (max-width: 912.5px)").matches)_ref.current.style.width="0px";
            else _ref.current.removeAttribute('style');
        });
    },[])

    const SearcHandler = (e)=> {
        e.preventDefault();
        if(location.pathname !== '/')navigate("/");
        const { search_ } = e.target.elements;
        setSearch(search_['value']);
        // e.target.reset();
    };

    const Navbardrop = ()=>{
        const dropdown_menu = document.querySelector(".dropdown .dropdown-menu");
        if(dropdown_menu.style.display == "block")dropdown_menu.removeAttribute('style');
        else dropdown_menu.style.display = "block";
    }
    const Logout = async ()=> {
        await fetch(`http://127.0.0.1/api/logout`,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        }).then(res => res.json()).then(result => {
            console.log(result);
            setUser({})
            setUserToken(null)
            localStorage.removeItem('token')
            localStorage.removeItem('userDetail')
            useNavigate()('/')
        })
    }

    return (
        <nav className="navbar navbar-expand-sm fixed-top bg-white">
            <Link  className="navbar-brand" to="/" >
                <img src={Logo} className="img"/>
            </Link>

            <form className="form-inline"  style={{width: "50%", marginLeft: "-12px"}} method="get"  onSubmit={SearcHandler}>
                <div className="input-group" style={{width: "100%"}}>
                    <input type="text" className="form-control" placeholder="Search...." name="search_" />
                    <button className="input-group-text"  id="search" >
                        <i className="fa fa-search" style={{color:'#4285f4'}}></i>
                    </button>
                </div>
            </form>

            <div className="menu_bar" onClick={menuBar}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>

            <ul className="navbar-nav" ref={_ref}>
                {userToken && (<li className="nav-item signin">
                    <a className="nav-link" href="">
                        Welcome {user['username']}
                    </a>
                </li>)}



                {!userToken && (<li className="nav-item ">
                    <Link  className="nav-link"  to="/login" > Sign-in </Link>
                </li>)}

                <li className="nav-item">
                    <a className="nav-link" href="{{ route('usercontact') }}">Contact us</a>
                </li>

                {userToken && (<li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" onClick={Navbardrop}>
                        <div className="msg-detail" style={{float: "left"}}>
                            <img src={Profile} />
                            <div className="usr-info">
                                <h3>{user['username']}</h3>
                                <p>Developer</p>
                            </div>
                        </div>
                    </a>
                    <div className="dropdown-menu">
                        <Link  className="nav-link"  to="/setting" > Profile Setting </Link>

                        <a className="dropdown-item"  onClick={Logout}>LogOut</a>
                    </div>
                </li>)}

            </ul>
        </nav>
    )
}


export default  Navbar;
