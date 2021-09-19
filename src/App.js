import { db } from "./firebase.js";
import React, { useState, useEffect } from 'react';
import Posts from './components/Posts'
import Toolbar from './components/header/Toolbar'
import "./css/index.css"
import "./css/posts.css"
import "./css/text.css"
import "./css/postpreview.css"
import Scripts from './components/Scripts'
import Postpreview from './components/Postpreview'
import processPostsData from "./js/process_posts"
import getSettings, {getOptionsArray} from "./js/settings"
import "./css/heading.css"

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

    // refactor posts
    let processedPostsData = processPostsData(postsData, settings)

    // current post
    const [currentOpenPost, setCurrentOpenPost] = useState({})
    function openPost(index) {
        setCurrentOpenPost(processedPostsData[index])
    }
    
    console.log(currentOpenPost)
    let openClass = ""
    if(currentOpenPost.refactored){
        if(currentOpenPost.refactored.html !== '<p></p>')
        openClass = "openpost--active"
    }

    return (
        <>
            <Scripts />
            <div id="content">
                <Toolbar  processedSettings={processedSettings} changeSettings={changeSettings} />
                <section id={"body"} className={openClass}>
                    <section id="posts">
                        <Posts processedPostsData={processedPostsData} openPost={openPost} />
                    </section>
                    <Postpreview setCurrentOpenPost={setCurrentOpenPost} currentOpenPost={currentOpenPost} />
                    <div onClick={()=>setCurrentOpenPost({refactored:{html:'<p></p>'}})} id="overlay"></div>
                </section>
            </div>
        </>
    );
}


export default App;




