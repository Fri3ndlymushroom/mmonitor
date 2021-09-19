import React from 'react'
import firebase from "firebase";
import Dropdown from './Dropdown';
import "../css/options.css"

export default function Options({processedSettings, changeSettings, setSettingsOpen, optionsClass }) {


    function sendRequest(e) {
        const sendRequest = firebase.functions().httpsCallable('sendRequest');
        sendRequest()
    }

    function debugFunction(e) {
        const getImgurLink = firebase.functions().httpsCallable('getImgurLink');
        getImgurLink()
    }

    function closeSettings(){
        setSettingsOpen(false)
    }



    return (
        <div id="options" className={optionsClass}>
            <button className="button--close" onClick={()=>closeSettings()}>&#10006;</button>
            <div id="toolbar__buttons">
                <button className="toolbar__button" onClick={sendRequest}>send Request</button>
                {
                    processedSettings.map(setting => {
                        return <Dropdown changeSettings={changeSettings} key={setting.ls} setting={setting} />
                    })
                }
                <button className="toolbar__button" onClick={debugFunction}>Holy Debug Button</button>
            </div>
        </div>
    )
}
