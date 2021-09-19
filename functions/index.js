const functions = require("firebase-functions");
const https = require('https');
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();


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
    data.forEach(function (post) {
        if (!post.doublicate) {
            db.collection("posts").doc(post.id).set({
                data: post
            })
        }
    })
}
var Xray = require('x-ray');


exports.getImgurLink = functions.https.onCall(async (data, context) => {
    var xray = Xray();

    xray('https://imgur.com/a/1QEKZ2f', '.image-placeholder')(function (err, res) {
        console.log("res: "+res);
    })
});