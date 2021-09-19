import React from 'react'
import firebase from "../../firebase";
import Dropdown from './Dropdown';
import "./toolbar.css"







export default function Toolbar({ processedSettings, changeSettings }) {

    function sendRequest(e) {
        const sendRequest = firebase.functions().httpsCallable('sendRequest');
        sendRequest()
    }

    function debugFunction(e) {
        const getImgurLink = firebase.functions().httpsCallable('getImgurLink');
        getImgurLink()
    }



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
            <h1 id="title">MMonitor
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
            </h1>
            <div id="toolbar__buttons">
                <button className="toolbar__button" onClick={sendRequest}>send Request</button>
                {
                    processedSettings.map(setting => {
                        return <Dropdown changeSettings={changeSettings} key={setting.ls} setting={setting} />
                    })
                }
                <button className="toolbar__button" onClick={debugFunction}>Holy Debug Button</button>
            </div>
        </section>
    )
}


