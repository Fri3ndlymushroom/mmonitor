const functions = require("firebase-functions");
const https = require('https');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const puppeteer = require('puppeteer')


exports.sendRequest = functions.https.onCall(async (data, context) => {

    let pushshiftData = '';
    let url = 'https://api.pushshift.io/reddit/search/submission/?subreddit=mechmarket&sort=desc&sort_type=created_utc&frequency=second&before=' + "1s" + '&size=500'


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


});

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
    let i = 0
    const browser = await puppeteer.launch()
    for (let post of data) {
        if (!post.doublicate) {


            const imagePost = await getImgurLink(browser, post).catch(err => console.log("🛑" + err))
            console.log("imgs: " + imagePost.images.length, "p: " + i)

            await db.collection("posts").doc(post.id).set({
                data: imagePost
            })
        }
        i++
    }
    await browser.close()
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
        /*
        let el = []
        await page.evaluate(()=>{
            el = $('img.image-placeholder').toArray()
        })*/

        const el = await page.$x('//*[@id="root"]/div/div/div/div/div/div/div/div/div/div/div/div/div/div/div/img')
        //                          *[@id="root"]/div/div[1]/div[1]/div[3]/div/div[1]/div[2]/div/div/div[2]/div/div/div[5]/div/div/img
        
        await Promise.all(el.map(async (element) => {
            const src = await element.getProperty('src')
            const scrText = await src.jsonValue()

            urls.push(scrText)
            return
        }));
        




    }

    let imageLinks = post.selftext.match(/http(s*):\/\/i\.imgur\.com\/.*?(?=\)|$)/gm)
    if (imageLinks !== null)
        imageLinks.forEach(function (element) { urls.push(element) })


    post.images = urls
    return post
}

/*

exports.getImgurLink = functions.https.onCall(async (data, context) => {
    let url = "https://imgur.com/a/1QEKZ2f"

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const el = await page.$x('//*[@id="root"]/div/div[1]/div[1]/div[3]/div/div[1]/div[2]/div/div/div[2]/div/div/div/div/div/img')

    el.forEach(async function (element) {
        const src = await element.getProperty('src')
        const scrText = await src.jsonValue()

        console.log({ scrText })
    })
});



*/