
import firebase from "firebase/app";
import "firebase/functions"
import "firebase/firestore"
import "firebase/auth"
import "firebase/analytics"

const firebaseConfig = {
    apiKey: "AIzaSyAbJrZYzo2iLllwJhLfz8H9btjGVPFO9hM",
    authDomain: "mmonitor-19efd.firebaseapp.com",
    projectId: "mmonitor-19efd",
    storageBucket: "mmonitor-19efd.appspot.com",
    messagingSenderId: "1027258019369",
    appId: "1:1027258019369:web:0658f92afef2d093aab638",
    measurementId: "G-3NLFGKGTMB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();
export const auth = firebase.auth();


if (window.location.host === "localhost:3000") {
    firebase.functions().useEmulator("localhost", 5001);
    db.useEmulator('localhost', 8080);
    auth.useEmulator('http://localhost:9099/', { disableWarnings: true });
}
export default firebase

// netstat -aon | findstr :8080
// taskkill /PID 18688 /F