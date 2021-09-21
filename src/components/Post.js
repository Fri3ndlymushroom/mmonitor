import React from 'react'

export default function Post({ data, openPost }) {

    let flairClass = ""
    if (data.link_flair_text) {
        flairClass = data.link_flair_text.replace(/ /g, "_")
    }


    if(!data.images[0]){
        data.images[0] = ""
    }



    return (
        <button onClick={() => openPost(data.index)} className="post">
            <img alt="product_preview_image" src={data.images[0].scrText}></img>
            <span>
                {
                    getPost(data, flairClass)
                }
            </span>
        </button>
    )
}

function getPost(data, flairClass) {

    let d = new Date(data.created_utc*1000).toString().split(" ");
    let t = d[4].split(":")
    let date = d[2] +" "+ d[1]+ " " + t[0]+":"+t[1]


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