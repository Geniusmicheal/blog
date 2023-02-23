import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from "./components/Home";
import Navbar from "./components/navbar";
import "./../css/app.css";
import Auth from "./components/Auth";
import {   BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceContextState from "./context";
import Filter from "./components/Filter";
import Setting from "./components/Setting";




if (document.getElementById('root')) {
    const Index = ReactDOM.createRoot(document.getElementById("root"));

    Index.render(
        <React.StrictMode>
            <ServiceContextState>
                <Router>
                    <Navbar/>
                    <section className="blog-lists-section section-gap-full">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="blog-lists">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/login" element={<Auth />} />
                                        <Route path="/setting" element={<Setting/>}/>
                                    </Routes>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="sidebar-wrap">
                                    <Filter/>

                                    <div className="single-widget social-widget">
                                        <h4 className="widget-title">Social Links</h4>
                                        <ul>
                                            <li>
                                                <a target="_blank" href="#">
                                                    <i className="fab fa-facebook"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="https://twitter.com/9javiews_14">
                                                    <i className="fab fa-twitter"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#">
                                                    <i className="fab fa-google-plus"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#">
                                                    <i className="fab fa-instagram" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a target="_blank" href="#">
                                                    <i className="fab fa-linkedin" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                </Router>
            </ServiceContextState>
        </React.StrictMode>
    )
}
