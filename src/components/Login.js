import React from 'react'

import "../css/login.css"

export default function Login({loginClass, setLoginOpen}) {

    function closeLogin() {
        setLoginOpen(false)
    }

    console.log(loginClass)

    return (
        <div id="login" className={loginClass}>
            <div id="login__header">
                <h2>Login</h2>
                <button className="button--close" onClick={() => closeLogin()}>&#10006;</button>
            </div>
            <button>Log In</button>
        </div>
    )
}
