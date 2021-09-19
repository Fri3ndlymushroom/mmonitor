// lib
import { db } from "./firebase.js";
import React, { useState, useEffect } from 'react';

// components
import Posts from './components/Posts'
import Toolbar from './components/header/Toolbar'
import Options from './components/Options'
import Scripts from './components/Scripts'
import Postpreview from './components/Postpreview'

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
                .orderBy("data.created_utc", "desc").get().then((querySnapshot) => {
                    let dbData = []
                    querySnapshot.forEach(function (doc) {
                        dbData.push(doc.data().data)
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

    const [settingsOpen, setSettingsOpen] = useState(false)

    // refactor posts
    let processedPostsData = processPostsData(postsData, settings)

    // current post
    const [currentOpenPost, setCurrentOpenPost] = useState({})
    function openPost(index) {
        setCurrentOpenPost(processedPostsData[index])
    }
    
    console.log(currentOpenPost)
    let sidebarClass = ""
    if(currentOpenPost.refactored){
        if(currentOpenPost.refactored.html !== '<p></p>')
        sidebarClass = "sidebar--active"
    }
    let optionsClass = ""
    if(settingsOpen){
        sidebarClass = "sidebar--active"
        optionsClass = "options--open"
    }

    return (
        <>
            <Scripts />
            <div id="content">
                <Toolbar setSettingsOpen={setSettingsOpen} />
                <section id={"body"} className={sidebarClass}>
                    <section id="posts">
                        <Posts processedPostsData={processedPostsData} openPost={openPost} />
                    </section>
                    <Postpreview  setCurrentOpenPost={setCurrentOpenPost} currentOpenPost={currentOpenPost} />
                    <Options optionsClass={optionsClass} setSettingsOpen={setSettingsOpen} processedSettings={processedSettings} changeSettings={changeSettings} />
                    <div onClick={()=>{setCurrentOpenPost({refactored:{html:'<p></p>'}}); setSettingsOpen(false)}} id="overlay"></div>
                </section>
            </div>
        </>
    );
}


export default App;




