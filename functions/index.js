const functions = require("firebase-functions");
const https = require('https');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

db.settings({
    ignoreUndefinedProperties: true,
})


const puppeteer = require('puppeteer')

exports.getPosts = functions.pubsub.schedule("every 15 minutes from 00:00 to 23:59").timeZone("Europe/London").onRun(async (context) => {
    await getPosts()
    //await getUserCredibility()
});
exports.getPostsCallable = functions.https.onCall(async (data, context) => {
    await getPosts()
    //await getUserCredibility()
});




async function getPosts() {

    let pushshiftData = '';
    let url = 'https://api.pushshift.io/reddit/search/submission/?subreddit=mechmarket&sort=desc&sort_type=created_utc&frequency=second&before=1s&size=50'

    let p = new Promise((resolve, reject) => {
        https.get(url, async (resp) => {

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                pushshiftData += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', async () => {

                pushshiftData = JSON.parse(pushshiftData)
                await updatePostDatabase(pushshiftData)

                resolve("failed")
            })

        }).on("error", (err) => {
            reject("failed")
            console.log("Error: " + err.message);
        });
    })

    await p.then((message) => {

    })

}

async function updatePostDatabase(data) {
    data = data.data

    // get ids that are present in the databse
    let presentIds = []
    await db.collection("postIds").doc("postIds").get().then(doc => {
        if (doc.exists) {
            presentIds = doc.data().ids
        }
    })




    // filter out doublicate ids
    data.forEach(function (post) {
        presentIds.forEach(function (id) {
            if (id === post.id) {
                post.doublicate = true
            }
        })
    })

    // push all non doublicate posts to db
    console.log("srtarted")
    let i = 0
    const browser = await puppeteer.launch()
    for (let post of data) {
        if (!post.doublicate) {

            let imagePost = await getImgurLink(browser, post).catch(err => console.log("🛑" + err))
            console.log("found: " + i)

            imagePost.reported = { users: [], broken: false }
            imagePost.credibility = { found: false, text: "", data: { joined: "", link_karma: 0, comment_karma: 0, trades: 0 } }
            presentIds.push(post.id)

            imagePost = classifyData(imagePost)
            imagePost = refactorText(imagePost)

            await db.collection("posts").doc(post.id).set(
                imagePost
            )
            i++
        }
    }
    await browser.close()
    await db.collection("postIds").doc("postIds").set({
        ids: presentIds
    })

    console.log("finished")
}

function refactorText(data) {

    data.refactored = {
        html: ""
    }
    data = filterOutLinks(data)

    data = filterOutSpecialText(data)

    let i = -1
    data.refactored.html = data.refactored.html.replace(/^.*$/gm, function () {
        let lines = data.refactored.html.match(/^.*$/gm)
        i++
        return ("<p>" + lines[i] + "</p>")
    })

    return data
}



function cutLast(value, amount){
    console.log(typeof value)
    if(typeof value === "object"){
        value.forEach(function(element, i){
            value[i] = element.slice(0, -1*amount)
        })
    }else{
        value = value.slice(0, -1*amount)
    }
    return value
}



function filterOutSpecialText(data) {

    // Bold Italic ***
    let i = -1
    data.refactored.html = data.refactored.html.replace(/(\*\*\*).*(\*\*\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*\*\*).*(?=\*\*\*)/gm)

        

        i++
        return "<span class='bold italic'>" + found[i] + "</span>"
    })

    // Bold **
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\*\*).*(\*\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*\*).*(?=\*\*)/gm)
        i++
        return "<span class='bold'>" + found[i] + "</span>"
    })

    // Italic *
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\*).*(\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*).*(?=\*)/gm)
        i++
        return "<span class='italic'>" + found[i] + "</span>"
    })

    // dot *
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\* )/g, function () {

        i++
        return "<span>•</span>"
    })

    // Heading 2 ##
    i = -1
    data.refactored.html = data.refactored.html.replace(/(## ).*?(?=<)/gm, function () {
        let found = data.refactored.html.match(/(?<=## ).*?(?=<)/gm)

        i++
        return "<span class='post__h2 italic'>" + found[i] + "</span>"
    })

    // Heading 1 #
    i = -1
    data.refactored.html = data.refactored.html.replace(/(# ).*?(?=<)/gm, function () {
        let found = data.refactored.html.match(/(?<=# ).*?(?=<)/gm)


        i++
        return "<span class='post__h1 italic'>" + found[i] + "</span>"
    })

    // ignore \
    data.refactored.html = data.refactored.html.replace(/\\/g, "")

    // ignore &***;
    data.refactored.html = data.refactored.html.replace(/&.*;/g, "")

    return data
}

function filterOutLinks(data) {



    if (data.selftext) {
        data.selftext = data.selftext.replace(/\\/gm, "")
        let html = data.selftext



        let links = html.match(/\[(.*?)\]( *)\((.*?)\)/g)





        let sublinks = []
        if (links != null) {

            links.forEach(function (element) {
                sublinks.push(
                    {
                        link_text: element.match(/(?<=\[).*?(?=\])/g)[0],
                        url: element.match(/(?<=\().*(?=\))/g)[0]
                    })
            })
            let i = -1
            html = html.replace(/\[(.*?)\]( *?)\((.*?)\)/g, function () {
                i++
                let link = ("<a rel='noreferrer' target='_blank' href='" + sublinks[i].url + "'>" + sublinks[i].link_text + "</a>")
                return link
            })
        }




        let i = 0
        html = html.replace(/( |^)https*:\/\/(.*?)(?= |$)/gm, () => {
            let link = html.match(/( |^)https*:\/\/(.*?)(?= |$)/gm)
            let newLink = "<a rel='noreferrer' target='_blank' href='" + link[i] + "'>" + link[i] + "</a>"
            i++
            return newLink
        })



        data.refactored.html = html
    }

    return data
}

function classifyData(data) {


    data.classification = {
        
        location: "none",
        location_prefix: "none",
        /*
        has: undefined,
        wants: undefined,
        has_title_products: undefined,
        wants_title_products: undefined,
        no_has_wants: undefined,*/
        flair: data.link_flair_text,
        broken: false
    }


    let title = data.title
    title = title.replace(/&amp;/g, "&")
    title = title.replace(/&.*;/g, "")
    data.title = title

    let noHasWants = false
    let specialFlairs = ["Artisan", "Service", "Vendor", "Bulk", "Interest Check", "Group Buy"]
    specialFlairs.forEach(function (flair) {
        if (data.classification.flair === flair) noHasWants = true
    })

    // todo: add exceptoion for ic gb artisain etc...
    let has = title.match(/(?<=\[H\])(.*)(?=\[W\])/g)
    let location = title.match(/(?<=\[)(.*?)(?=\])/g)
    let wants = title.match(/(?<=\[W])(.*)/g)

    if (has === null || location === null || wants === null) {
        data.classification.broken = true
    } else if (data.selftext === "[removed]") {
        data.classification.broken = true
    } else if (location.length === 3 || has.length === 1 || wants.lengt === 1) {
        data.classification.location = location[0]
        data.classification.location_prefix = location[0][0]+location[0][1]
        data.classification.has = has[0]
        data.classification.wants = wants[0]
        data.has_title_products = has[0].split(",")
        data.wants_title_products = wants[0].split(",")
    } else {
        data.classification.broken = true
    }

    if (data.selftext.match(/\[removed\]/gm) !== null) {
        data.classification.borken = true
        return data
    }

    if (noHasWants) {
        data.title = data.title.replace(/^\[(.*?)\]/g, "")
        data.classification.no_has_wants = true
        data.classification.broken = false
        return data
    }


    return data
}


async function getImgurLink(browser, post) {
    // get first imgur link
    let url = post.selftext.match(/http(s*):\/\/imgur\.com.*?(?=\)|$|\])/gm)
    let urls = []
    post.images = []


    if (url !== null) {


        url = url[0]


        const page = await browser.newPage()
        await page.goto(url)




        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await timeout(100);


        const el = await page.$$("img.image-placeholder")







        await Promise.all(el.map(async (element) => {
            const src = await element.getProperty('src')
            const scrText = await src.jsonValue()

            urls.push(scrText)
        }));


        await page.close();

    }

    let imageLinks = post.selftext.match(/http(s*):\/\/i\.imgur\.com\/.*?(?=\)|$)/gm)
    if (imageLinks !== null)
        imageLinks.forEach(function (element) { urls.push(element) })


    post.images = urls
    return post
}

exports.reportPost = functions.https.onCall(async (data, context) => {

    post = data.document
    user = context.auth.uid
    docData = {}


    await db.collection("posts").doc(post).get().then((doc) => {
        docData = doc.data()
    })

    let alreadyReported = false
    docData.reported.users.forEach(function (element) {
        if (user === element) alreadyReported = true
    })

    if (!alreadyReported) {
        docData.reported.users.push(user)

        if (docData.reported.users.length > 10) {
            docData.reported.broken = true
        }

        db.collection("posts").doc(post).update(docData)
    }
});




// id: pq43ke
// get all comments =  https://api.pushshift.io/reddit/submission/comment_ids/pq43ke

// comment = hdtz6l8 // author needs to be mechkbot
// http://api.pushshift.io/reddit/search/comment/?ids=hdtz6l8


async function getUserCredibility() {
    let postids = []
    await db.collection("posts").where("credibility.found", "==", false).get().then((foundPosts) => {
        foundPosts.forEach(function (post) {
            postids.push(post.data().id)
        })
    })




    for (let id of postids) {


        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        await timeout(600);

        let commentids = ""
        https.get("https://api.pushshift.io/reddit/submission/comment_ids/" + id, async (resp) => {
            resp.on('data', (chunk) => {
                commentids += chunk;
            });
            resp.on('end', () => {
                commentids = JSON.parse(commentids)
                getComments(commentids)
            })

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}

function getComments(ids) {
    console.log(ids)
}






