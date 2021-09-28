import React from 'react'
import "../css/popup.css"

export default function Popup({setPopup, popup}) {



    return (
        <>
            <div id="popup" className={popup.active}>{popup.text}</div>
            <div className={popup.active} onClick={()=>setPopup({active:"", text:""})} id="popup__overlay"></div>
        </>
    )
}
