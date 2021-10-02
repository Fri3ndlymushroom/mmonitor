const functions = require("firebase-functions");
const https = require('https');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


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
    let url = 'https://api.pushshift.io/reddit/search/submission/?subreddit=mechmarket&sort=desc&sort_type=created_utc&frequency=second&before=1s&size=500'

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
    const documentReferences = await 
    db.collection('posts').listDocuments()

    const presentIds = documentReferences.map(it => it.id)



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

            const imagePost = await getImgurLink(browser, post).catch(err => console.log("🛑" + err))
            console.log("found: " + i)

            imagePost.reported = { users: [], broken: false }
            imagePost.credibility = { found: false, text: "", data: { joined: "", link_karma: 0, comment_karma: 0, trades: 0 } }
            await db.collection("posts").doc(post.id).set(
                imagePost
            )
            i++
        }
    }
    await browser.close()
    console.log("finished")
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






