import React from 'react'
import firebase from "firebase";
import Dropdown from './Dropdown';
import "../css/options.css"

export default function Options({ processedSettings, changeSettings, setOptionsOpen, optionsClass, setLoginOpen }) {


    function getPostsCallable(e) {
        const getPostsCallable = firebase.functions().httpsCallable('getPostsCallable');
        getPostsCallable()
    }

    function closeOptions() {
        setOptionsOpen(false)
    }


    return (
        <div id="options" className={optionsClass}>
            <div id="options__header">
                <h2>Settings</h2>
                <button className="button--close" onClick={() => closeOptions()}>&#10006;</button>
            </div>
            <div id="options__buttons">
                <button className="options__button" onClick={getPostsCallable()}>get posts</button>
                {
                    processedSettings.map(setting => {
                        return <Dropdown changeSettings={changeSettings} key={setting.ls} setting={setting} />
                    })
                }
                <button onClick={()=>setLoginOpen(true)}>Log In</button>
            </div>
        </div>
    )
}
