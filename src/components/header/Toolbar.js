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
                                    <span>MMonitor is a self updating view of r/mm and makes browsing and finding your favourite keyboard parts more convenient</span>
                                </div>
                                <span id="links">
                                    <a href="https://github.com/Fri3ndlymushroom/mmonitor">GitHub</a>
                                    <a href="https://www.patreon.com/FriendlyMushroom">Patreon</a>
                                    <a href="https://ko-fi.com/friendlymushroom">KoFi</a>
                                </span>
                            </div>
                    })
                }}>&#8505;</button>
                <button onClick={() => setOptionsOpen(true)}>&#9881;</button>
            </div>
        </section>
    )
}


