export default function processPostsData(postsData, settings) {
    // analys e every post
    let processedPostsData = []
    postsData.forEach(function (post) {
        processedPostsData.push(processData(post, settings))
    })

    // filter posts
    for (let i = processedPostsData.length - 1; i >= 0; i--) {
        if (!processedPostsData[i].show) {
            processedPostsData.splice(i, 1);
        }
    }

    // index posts
    processedPostsData.forEach(function (element, y) {
        element.index = y
    })



    return processedPostsData
}


function processData(data, settings) {
    // apply settings
    if(data.selftext_html)
        data = filterPosts(data, settings)
        data = setLinkTarget(data)
        data = wrapTables(data)

    return data
}

function filterPosts(data, settings) {
    data.show = true

    return data
}

function setLinkTarget(data){

    data.selftext_html = data.selftext_html.replace(/(?<=;a) /gm, " target='_blank' ")

    return data
}

function wrapTables(data){
    let i = 0
    data.selftext_html = data.selftext_html.replace(/&lt;table&gt([\s\S]*)&lt;\/table&gt;/gm, ()=>{
        let tables = data.selftext_html.match(/&lt;table&gt([\s\S]*)&lt;\/table&gt;/gm)
        let wrapped = "&lt;div class='table__wrapper'&gt;"+tables[i]+"&lt;/div&gt"
        i++
        return wrapped
    })
    return data
}
