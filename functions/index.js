const functions = require("firebase-functions");
const https = require('https');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


const puppeteer = require('puppeteer')

exports.getPosts = functions.pubsub.schedule("every 15 minutes from 00:00 to 23:59").timeZone("Europe/London").onRun((context) => {
    getPosts()
});
exports.getPostsCallable = functions.https.onCall(async (data, context) => {
    await getPosts()
});


async function getPosts() {
    let pushshiftData = '';
    let url = 'https://api.pushshift.io/reddit/search/submission/?subreddit=mechmarket&sort=desc&sort_type=created_utc&frequency=second&before=1s&size=500'



    https.get(url, async (resp) => {

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            pushshiftData += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            pushshiftData = JSON.parse(pushshiftData)
            updatePostDatabase(pushshiftData)
        })

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

async function updatePostDatabase(data) {
    data = data.data

    // get ids that are present in the databse
    let presentIds = []
    await db.collection("posts").get().then(querySnapshot => {
        querySnapshot.forEach(function (post) {
            presentIds.push(post.id)
        })
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
    const browser = await puppeteer.launch()
    for (let post of data) {
        if (!post.doublicate) {

            const imagePost = await getImgurLink(browser, post).catch(err => console.log("🛑" + err))
            //console.log("imgs: " + imagePost.images.length, "p: " + i)

            imagePost.reported = { users: [], broken: false }
            await db.collection("posts").doc(post.id).set(
                imagePost
            )
        }
        i++
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



    // id: pved49
    // https://api.pushshift.io/reddit/submission/comment_ids/pv6qoa
    // example: https://api.pushshift.io/reddit/submission/comment_ids/6uey5x
    //  https://api.pushshift.io/reddit/comment/search/?link_id=pvdfel&limit=1000

    // https://api.pushshift.io/reddit/submission/search/?ids=bcxguf