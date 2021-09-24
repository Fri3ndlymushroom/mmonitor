import React, { useState, useEffect } from 'react';
import firebase, { auth } from "../firebase";
import "../css/login.css"

export default function Login({ loginClass, setLoginOpen }) {

    const [authChanged, setAuthChanged] = useState(true)

    function closeLogin() {
        setLoginOpen(false)
    }

    function getLoginView() {
        if (auth.currentUser) {
            return (
                <div id="loggedin">
                    <h3>Welcome back {auth.currentUser.displayName}</h3>
                    <p>Thank you for useing MMonitor</p>
                    <button onClick={() => logout()}>Log Out</button>
                </div>
            )
        } else {
            return <button onClick={() => loginWithGoogle()}><img src="./google_button.png"></img></button>
        }
    }


    async function loginWithGoogle() {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        setAuthChanged(!authChanged)
    }
    function logout() {
        auth.signOut()
        setAuthChanged(!authChanged)
    }


    return (
        <div id="login" className={loginClass}>
            <div id="login__header">
                <h2>Login</h2>
                <button className="button--close" onClick={() => closeLogin()}>&#10006;</button>
            </div>
            <div id="login__body">
                {
                    getLoginView()
                }
            </div>
        </div>
    )
}


