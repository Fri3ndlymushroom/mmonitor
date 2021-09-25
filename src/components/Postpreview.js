import React, { useState } from 'react'
import firebase, { auth } from "../firebase.js";

export default function Postpreview({ setNotification, setCurrentOpenPost, currentOpenPost }) {
    if (currentOpenPost.refactored === undefined) {
        currentOpenPost.refactored = { html: "<p></p>" }
    }

    const [imageIndex, setImageIndex] = useState(0)
    const [activeImage, setActiveImage] = useState("")


    function closePreview() {
        setCurrentOpenPost({ refactored: { html: '<p></p>' } })
    }




    console.log(currentOpenPost)

    return (
        <div id="postpreview">
            {
                getPreview(activeImage,setActiveImage, setNotification, currentOpenPost, closePreview, imageIndex, setImageIndex)
            }
        </div>
    )
}

function getPreview(activeImage, setActiveImage, setNotification,  currentOpenPost, closePreview, imageIndex, setImageIndex) {
    const header =
        <div className="post__header">
            <h2><a rel="noreferrer" target="_blank" href={currentOpenPost.full_link}>Full Post</a></h2>
            <div>
                <button data-tooltip="report broken post" data-tooltip-location="left" className="button--report tooltip__parent" onClick={() => reportPost(currentOpenPost.id, setNotification)}>&#9873;</button>
                <button className="button--close" onClick={() => closePreview()}>&#10006;</button>
            </div>
        </div>



    if (currentOpenPost.classification)
        if (currentOpenPost.classification.no_has_wants) {
            return (
                <>
                    {header}
                    <h2>{currentOpenPost.title}</h2>
                    {getImageSlider(activeImage, setActiveImage,currentOpenPost.images, imageIndex, setImageIndex)}
                    <div dangerouslySetInnerHTML={{ __html: currentOpenPost.refactored.html }} />
                </>
            )
        } else {
            return (
                <>
                    {header}
                    <h2>Has: {currentOpenPost.classification.has}</h2>
                    <h2>Wants: {currentOpenPost.classification.wants}</h2>
                    <h3>r/{currentOpenPost.author} from {currentOpenPost.classification.location}</h3>
                    {getImageSlider(activeImage, setActiveImage,currentOpenPost.images, imageIndex, setImageIndex)}
                    <div dangerouslySetInnerHTML={{ __html: currentOpenPost.refactored.html }} />
                </>
            )
        }
    else {
        return (<>
            {header}
        </>
        )
    }
}

function getImageSlider(activeImage, setActiveImage,images, imageIndex, setImageIndex) {
    if (images.length > 0)
        return (
            <div className="imageslider">
                <span>{imageIndex + 1}/{images.length}</span>
                <img className={activeImage} alt="galery" src={images[imageIndex]}></img>
                <div className={activeImage} onClick={()=>setActiveImage("")} id="imageslider__overlay"></div>
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
                <button onClick={()=>setActiveImage("active")} id="imageslider__zoom">&#10010;</button>
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