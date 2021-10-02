import React, { useState, useEffect } from 'react'
import Post from "./Post"


export default function Posts({ processedPostsData, openPost }) {


    const [splitPosts, setSplitPosts] = useState(getSplitPosts(processedPostsData))

    useEffect(() => {
        setSplitPosts(getSplitPosts(processedPostsData))
    }, [processedPostsData]);


    window.onresize = function () {
        if (getComputedStyle(document.documentElement).getPropertyValue('--product__columns') !== splitPosts.length) {
            setSplitPosts(getSplitPosts(processedPostsData))
        }
    }

    let y = -1

    if (processedPostsData.length > 0)
        return (
            <>
                {
                    splitPosts.map(column => {
                        y++
                        return (
                            <div key={"postrow" + y} className="postrow">
                                {
                                    splitPosts[y].map(dataPoint => {
                                        return <Post key={dataPoint.id} data={dataPoint} openPost={openPost} />
                                    })
                                }
                            </div>

                        )
                    })

                }
            </>
        )
    else
        return (
            <div id="nopostfound">Emptyness...</div>
        )

}





function getSplitPosts(processedPostsData) {
    let splitPosts = []

    let columns = getComputedStyle(document.documentElement).getPropertyValue('--product__columns');
    for (let k = 0; k < columns; k++) {
        splitPosts.push([])
    }

    let i = 0
    processedPostsData.forEach(function (element, y) {
        element.index = y
        splitPosts[i].push(element)
        if (columns - 1 === i) {
            i = -1
        }
        i++
    })
    return splitPosts
}