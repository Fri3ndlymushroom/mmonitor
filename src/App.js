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
import Popup from './components/Popup.js'
//style
import "./css/index.css"
import "./css/posts.css"
import "./css/text.css"
import "./css/postpreview.css"
import "./css/heading.css"
import "./css/tooltip.css"
import "./css/table.css"
// js
import getSettings, { getOptionsArray } from "./js/settings"
import processPostsData from "./js/process_posts"
const current_lsv = 8



function App() {
    useEffect(() => {
        let lsv = localStorage.getItem("lsv")
        if (lsv === null || JSON.parse(lsv) !== current_lsv) {
            localStorage.clear()
            localStorage.setItem("lsv", JSON.stringify(current_lsv))
        }
    })

    // settings
    const [settings, setSettings] = useState(getSettings())
    let processedSettings = getOptionsArray(settings)
    function changeSettings(ls, option) {
        let newSettings = [...settings]
        newSettings.forEach(function (element) {
            if (element.ls === ls) {
                element.options = JSON.parse(localStorage.getItem(ls))
            }
        })
        setSettings(newSettings)
    }

    const [optionsOpen, setOptionsOpen] = useState(false)


    // posts
    const [postsData, setPostsData] = useState([])
    const [renderLimit, setRenderLimit] = useState(30)
    useEffect(() => {
        getPosts()
        function getPosts() {

            let flairs = []
            for (let flair in settings[0].options) {
                if (settings[0].options[flair] === true) {
                    flairs.push(flair)
                }
            }
            if (flairs.length > 0) {
                let posts = db.collection("posts").where("link_flair_text", "in", flairs)
    
                //location
                if (!settings[1].options.All) {
                    let location = ""
                    for (let option in settings[1].options) {
                        if (settings[1].options[option]) location = option
                    }
                    posts = posts.where("classification.location_prefix", "==", location)
                }
    
                //broken
                if (!settings[2].options.show) {
                    posts = posts.where("classification.broken", "==", false)
                }
    
                // search
                let searchTerms = []
                for (let term in settings[3].options) {
                    if (settings[3].options[term]) searchTerms.push(term.toLowerCase())
                }
    
                searchTerms.forEach(function (term) {
                    posts = posts.where("classification.search." + term, "==", true)
                })
    
    
                posts.orderBy("created_utc", "desc").limit(renderLimit).get().then((querySnapshot) => {
                    let dbData = []
                    querySnapshot.forEach(function (doc) {
                        dbData.push(doc.data())
                    })
                    setPostsData(dbData)
                })
            }
        }
    }, [renderLimit, settings])








    useEffect(() => {
        let shouldChange = true
        document.getElementById("posts").addEventListener('scroll', function (event) {
            var element = event.target;
            if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 2) {
                if (shouldChange) {
                    shouldChange = true
                    setTimeout(function () {
                        setRenderLimit(renderLimit + 30)
                    }, 1000)
                }
                shouldChange = false
            }
        });
    })


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
    if (currentOpenPost.selftext_html) {
        if (currentOpenPost.selftext_html !== '')
            sidebarClass = "sidebar--active"
    }
    if (optionsOpen) {
        sidebarClass = "sidebar--active"
        optionsClass = "options--open"
    }
    if (loginOpen) {
        sidebarClass = "sidebar--active"
        loginClass = "login--open"
    }

    const [notification, setNotification] = useState("")

    const [popup, setPopup] = useState({ active: "", text: "Hello world" })

    let themeClass = ""
    for (let theme in settings[4].options) if (settings[4].options[theme]) themeClass = "theme--"+theme.toLowerCase()
    document.body.className = themeClass

    return (
        <>
            <Scripts />
            <div id="content">
                <Toolbar setOptionsOpen={setOptionsOpen} setPopup={setPopup} />
                <section id={"body"} className={sidebarClass}>
                    <section id="posts">
                        <Posts processedPostsData={processedPostsData} openPost={openPost} />
                    </section>
                    <Postpreview setNotification={setNotification} setCurrentOpenPost={setCurrentOpenPost} currentOpenPost={currentOpenPost} />
                    <Options setLoginOpen={setLoginOpen} optionsClass={optionsClass} setOptionsOpen={setOptionsOpen} processedSettings={processedSettings} changeSettings={changeSettings} />
                    <Login loginClass={loginClass} setLoginOpen={setLoginOpen} />
                    <div onClick={() => { setCurrentOpenPost({ refactored: { html: '<p></p>' } }); setOptionsOpen(false) }} id="overlay"></div>
                </section>
                <section>
                </section>
                <Popup setPopup={setPopup} popup={popup} />
                <Notification notification={notification} />
            </div>
        </>
    );
}


export default App;




