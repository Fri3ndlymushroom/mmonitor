// lib
import { db } from "./firebase.js";
import React, { useState, useEffect } from 'react';

// components
import Posts from './components/Posts'
import Toolbar from './components/header/Toolbar'
import Options from './components/Options'
import Scripts from './components/Scripts'
import Postpreview from './components/Postpreview'
import Login from './components/Login.js'
import Notification from './components/Notification.js'

//style
import "./css/index.css"
import "./css/posts.css"
import "./css/text.css"
import "./css/postpreview.css"
import "./css/heading.css"

// js
import getSettings, {getOptionsArray} from "./js/settings"
import processPostsData from "./js/process_posts"

let setData = false

function App() {

    // posts
    const [postsData, setPostsData] = useState([])
    useEffect(() => {
        if (!setData) {
            db.collection("posts")
                .orderBy("created_utc", "desc").get().then((querySnapshot) => {
                    let dbData = []
                    querySnapshot.forEach(function (doc) {
                        dbData.push(doc.data())
                    })
                    setPostsData(dbData)
                })
            setData = true
        }
    })

    // settings
    const [settings, setSettings] = useState(getSettings())
    let processedSettings = getOptionsArray(settings)
    function changeSettings(ls, option){
        let newSettings = [...settings]
        newSettings.forEach(function(element){
            if(element.ls === ls){
                element.options = JSON.parse(localStorage.getItem(ls))
            }
        })
        setSettings(newSettings)
    }

    const [optionsOpen, setOptionsOpen] = useState(false)

    // refactor posts
    let processedPostsData = processPostsData(postsData, settings)

    // current post
    const [currentOpenPost, setCurrentOpenPost] = useState({})
    function openPost(index) {
        setCurrentOpenPost(processedPostsData[index])
        setOptionsOpen(false)
    }

    // login
    const [loginOpen, setLoginOpen] = useState(false)



    let sidebarClass = ""
    let optionsClass = ""
    let loginClass = ""
    if(currentOpenPost.refactored){
        if(currentOpenPost.refactored.html !== '<p></p>')
        sidebarClass = "sidebar--active"
    }
    if(optionsOpen){
        sidebarClass = "sidebar--active"
        optionsClass = "options--open"
    }
    if(loginOpen){
        sidebarClass = "sidebar--active"
        loginClass = "login--open"
    }

    const [notification, setNotification] = useState("")

    return (
        <>
            <Scripts />
            <div id="content">
                <Toolbar setOptionsOpen={setOptionsOpen} />
                <section id={"body"} className={sidebarClass}>
                    <section id="posts">
                        <Posts processedPostsData={processedPostsData} openPost={openPost} />
                    </section>
                    <Postpreview setNotification={setNotification} setCurrentOpenPost={setCurrentOpenPost} currentOpenPost={currentOpenPost} />
                    <Options setLoginOpen={setLoginOpen} optionsClass={optionsClass} setOptionsOpen={setOptionsOpen} processedSettings={processedSettings} changeSettings={changeSettings} />
                    <Login loginClass={loginClass} setLoginOpen={setLoginOpen}/>
                    <div onClick={()=>{setCurrentOpenPost({refactored:{html:'<p></p>'}}); setOptionsOpen(false)}} id="overlay"></div>
                </section>
                <section>
                </section>
                <Notification notification={notification}/>
            </div>
        </>
    );
}


export default App;




