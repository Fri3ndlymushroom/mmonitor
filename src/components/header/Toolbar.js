import React from 'react'

import "./toolbar.css"







export default function Toolbar({ setOptionsOpen, setPopup }) {




    return (
        <section id="toolbar">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="gooey">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="highContrastGraphic" />
                        <feComposite in="SourceGraphic" in2="highContrastGraphic" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <div>
                <a href="index.html" id="title">MMonitor
                    <span className="bubbles">
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                        <span className="bubble"></span>
                    </span>
                </a>
                <span style={{ display: "none", "marginLeft": "10px", color: "grey", fontWeight: "bold" }}>Alpha</span>
            </div>


            <div>
                <button onClick={() => {
                    setPopup({
                        active: "active",
                        text:
                            <div id="info">
                                <div>
                                    <h3>Welcome to MMonitor. </h3>
                                    <h4>Hey, my name is Moritz aka FriendlyMushroom and I am the creator of MMonitor</h4>
                                    <p>MMonitor is a self updating view of r/mm and makes browsing and finding your favourite keyboard parts more convenient.</p>
                                    <p>I hope you enjoy MMonitor</p>
                                </div>
                                <span id="links">
                                    <a href="https://github.com/Fri3ndlymushroom/mmonitor"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"></img>Github</a>
                                    <a href="https://www.patreon.com/FriendlyMushroom"><img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Patreon_logo.svg"></img>Patreon</a>
                                    <a href="https://ko-fi.com/friendlymushroom"><img src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/5ca5bf1dff3c03fbf7cc9b3c_Kofi_logo_RGB_rounded.png"></img>Ko-Fi</a>
                                </span>
                            </div>
                    })
                }}>&#8505;</button>
                <button onClick={() => setOptionsOpen(true)}>&#9881;</button>
            </div>
        </section>
    )
}


