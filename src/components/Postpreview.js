import React, { useState } from 'react'
import firebase, { auth } from "../firebase.js";

export default function Postpreview({ setNotification, setCurrentOpenPost, currentOpenPost }) {
    if (currentOpenPost.refactored === undefined) {
        currentOpenPost.refactored = { html: "<p></p>" }
    }

    const [imageIndex, setImageIndex] = useState(0)
    const [activeImage, setActiveImage] = useState("")


    function closePreview() {
        setCurrentOpenPost({ selftext_html: "" })
    }

    function getZoomedImage() {
        if (currentOpenPost.images)
            return (
                <div id="preview__image_containter" className={activeImage} onClick={() => setActiveImage("")}>
                    <img alt="zoom image" src={currentOpenPost.images[imageIndex]}></img>
                </div>)
    } 

    return (
        <>
            {getZoomedImage()}



            <div id="postpreview">
                {
                    getPreview(activeImage, setActiveImage, setNotification, currentOpenPost, closePreview, imageIndex, setImageIndex)
                }
            </div>
        </>
    )
}



function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function getPreview(activeImage, setActiveImage, setNotification, currentOpenPost, closePreview, imageIndex, setImageIndex) {
    const header =
        <div className="post__header">
            <h2><a rel="noreferrer" target="_blank" href={currentOpenPost.url}>Full Post</a></h2>
            <div>
                <button data-tooltip="report broken post" data-tooltip-location="left" className="button--report tooltip__parent" onClick={() => reportPost(currentOpenPost.id, setNotification)}>&#9873;</button>
                <button className="button--close" onClick={() => closePreview()}>&#10006;</button>
            </div>
        </div>



    let date = ""
    if (currentOpenPost.created_utc) {
        let d = new Date(currentOpenPost.created_utc * 1000).toString().split(" ");
        let t = d[4].split(":")
        date = d[2] + " " + d[1] + " " + t[0] + ":" + t[1]
    }
    if (currentOpenPost.classification) {

        if (currentOpenPost.classification.no_has_wants) {
            return (
                <>
                    {header}
                    <h2>{currentOpenPost.title}</h2>
                    {getImageSlider(activeImage, setActiveImage, currentOpenPost.images, imageIndex, setImageIndex)}
                    <div dangerouslySetInnerHTML={{ __html: htmlDecode(currentOpenPost.selftext_html) }} />
                </>
            )
        } else {
            return (
                <>
                    {header}
                    <h2><span className="postpreview__prefix">[Has]</span> {currentOpenPost.classification.has}</h2>
                    <h2><span className="postpreview__prefix">[Wants]</span> {currentOpenPost.classification.wants}</h2>
                    <h3 className="postpreview__info">u/<span className="postpreview__author">{currentOpenPost.author}</span> from {currentOpenPost.classification.location} posted this on {date}</h3>
                    {getImageSlider(activeImage, setActiveImage, currentOpenPost.images, imageIndex, setImageIndex)}
                    <div dangerouslySetInnerHTML={{ __html: htmlDecode(currentOpenPost.selftext_html) }} />
                </>
            )
        }
    }
    else {
        return (<>
            {header}
        </>
        )
    }
}

function getImageSlider(activeImage, setActiveImage, images, imageIndex, setImageIndex) {
    if (images.length > 0)
        return (
            <div className="imageslider">
                <span>{imageIndex + 1}/{images.length}</span>
                <img alt="galery" src={images[imageIndex]}></img>
                <button className="imageslider__prev" onClick={() => setImageIndex(() => {
                    let newIndex = imageIndex - 1
                    if (newIndex < 0) newIndex = images.length - 1
                    return newIndex
                })}>&larr;</button>
                <button className="imageslider__next" onClick={() => setImageIndex(() => {
                    let newIndex = imageIndex + 1
                    if (newIndex > images.length - 1) newIndex = 0
                    return newIndex
                })}>&rarr;</button>
                <button onClick={() => setActiveImage("active")} id="imageslider__zoom">&#10010;</button>
            </div>
        )
}

function reportPost(id, setNotification) {
    if (auth.currentUser !== null) {
        const reportPost = firebase.functions().httpsCallable('reportPost');
        reportPost({ document: id })
        setNotification("The Post was reported. Thank you")
    } else {
        setNotification("Please Log In to report posts")
    }
}