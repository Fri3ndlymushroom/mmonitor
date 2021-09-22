import React, { useState, useEffect } from 'react'

export default function Post({ data, openPost }) {

    let flairClass = ""
    if (data.link_flair_text) {
        flairClass = data.link_flair_text.replace(/ /g, "_")
    }


    const [imageIndex, setImageIndex] = useState(0)
    const [hovering, setHovering] = useState(false)

    useEffect(() => {
        let loop = setInterval(function () {
            if (hovering) {

                let newImageIndex = imageIndex + 1
                if (newImageIndex > data.images.length - 1) newImageIndex = 0
                setImageIndex(newImageIndex)
            }
        }, 1000)
        return () => clearInterval(loop)
    })


    //console.log(data.images)
    return (
        <button onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onClick={() => openPost(data.index)} className="post">
            {
                getImage(data.images, imageIndex)
            }
           
            <span>
                {
                    getPost(data, flairClass)
                }
            </span>
        </button>
    )
}

function getImage(images, index){
    if (images.length < 1) {
        return ""
    }else{
        return <img alt="product_preview_image" src={images[index]}></img>
    }
}

function getPost(data, flairClass) {

    let d = new Date(data.created_utc * 1000).toString().split(" ");
    let t = d[4].split(":")
    let date = d[2] + " " + d[1] + " " + t[0] + ":" + t[1]


    if (data.classification.no_has_wants) {
        return (
            <>
                <h5>u/{data.author} at {date}</h5>
                <h3>{data.title}</h3>
                <span className={"flair flair--" + flairClass}>{data.link_flair_text}</span>
            </>
        )
    } else {
        return (
            <>
                <h5>u/{data.author} at {date}</h5>
                <h3>Has: {data.classification.has}</h3>
                <h3>Wants: {data.classification.wants}</h3>
                <span className={"flair flair--" + flairClass}>{data.link_flair_text}</span>
            </>
        )
    }
}