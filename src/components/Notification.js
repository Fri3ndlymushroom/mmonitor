
import React, { useState, useEffect } from 'react';

import "../css/notification.css"


export default function Notification({ notification }) {

    const [active, setActive] = useState("")


    useEffect(() => {
        if (notification !== "") {
            setActive("active")
            let timeout = setTimeout(function () {
                setActive("")
            }, 5000)
            return () => clearTimeout(timeout);
        }
    }, [notification])


    return (
        <div id="notification" className={active}>
            <p>{notification}</p>
        </div>
    )
}
