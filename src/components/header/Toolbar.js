import React from 'react'

import "./toolbar.css"







export default function Toolbar({ setOptionsOpen, setPopup}) {




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



            <div>
                <button onClick={()=>{setPopup({
                    active: "active", 
                    text:
                    <>
                        <h3>MMonitor is a tool that automatically searches r/mm and displays the posts more clearly.</h3>
                    </>
                })}}>&#8505;</button>
                <button onClick={() => setOptionsOpen(true)}>&#9881;</button>
            </div>
        </section>
    )
}


