import React, { useState } from 'react'

export default function Postpreview({ setCurrentOpenPost, currentOpenPost }) {
    if (currentOpenPost.refactored === undefined) {
        currentOpenPost.refactored = { html: "<p></p>" }
    }

    const [imageIndex, setImageIndex] = useState(0)

    function closePreview() {
        setCurrentOpenPost({ refactored: { html: '<p></p>' } })
    }


    return (
        <div id="postpreview">
            {
                getPreview(currentOpenPost, closePreview, imageIndex, setImageIndex)
            }
        </div>
    )
}

function getPreview(currentOpenPost, closePreview, imageIndex, setImageIndex) {
    const header =
        <div className="post__header">
            <h2><a rel="noreferrer" target="_blank" href={currentOpenPost.full_link}>Full Post</a></h2>

            <button className="button--report" onClick={() => reportPost(currentOpenPost.id)}>&#9873;</button>
            <button className="button--close" onClick={() => closePreview()}>&#10006;</button>

        </div>



    if (currentOpenPost.classification)
        if (currentOpenPost.classification.no_has_wants) {
            return (
                <>
                    {header}
                    <h2>{currentOpenPost.title}</h2>
                    {getImageSlider(currentOpenPost.images, imageIndex, setImageIndex)}
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
                    {getImageSlider(currentOpenPost.images, imageIndex, setImageIndex)}
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

function getImageSlider(images, imageIndex, setImageIndex) {
    if (images.length > 0)
        return (
            <div className="imageslider">

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
            </div>
        )
}

function reportPost(id){
    console.log(id)
}