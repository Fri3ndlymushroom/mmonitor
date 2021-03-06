import React from 'react'


export default function Dropdown({ setting, changeSettings }) {

    function toggleOption(ls, option) {

        let setting = JSON.parse(localStorage.getItem(ls))

        setting[option.title] = !setting[option.title]

        localStorage.setItem(ls, JSON.stringify(setting))

        changeSettings(ls, option)
    }

    function setOption(ls, option){
        let setting = JSON.parse(localStorage.getItem(ls))

        for(let sub_setting in setting){
            setting[sub_setting] = false
        }

        setting[option.title] = true


        localStorage.setItem(ls, JSON.stringify(setting))

        changeSettings(ls, option)
    }



    return (
        <div className="dropdown__wrapper">
            <button onClick={() => toggleDropdown(setting.id)} className="options__button dropdown__button">{setting.ls}</button>
            <div id={setting.id} className={"dropdown__content"}>
                {
                    setting.arr.map(option => {
                        if (!setting.only_one)
                            return (
                                <div key={option.title}>
                                    <input className="dropdown__checkbox" defaultChecked={option.checked} id={setting.ls + "-" + option.title} onClick={() => toggleOption(setting.ls, option)} type="checkbox"></input>
                                    <span>{option.title}</span>
                                </div>
                            )
                        else {
                            return (
                                <div key={option.title}>
                                    <button className="dropdown__optionbutton" onClick={() => setOption(setting.ls, option)}>{option.title}</button>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}



function toggleDropdown(id) {
    document.getElementById(id).classList.toggle("show__dropdown")
}


window.onclick = function (event) {
    if (!event.target.matches('.dropdown__button') && !event.target.matches('.dropdown__checkbox')&& !event.target.matches('.dropdown__optionbutton')) {
        var dropdowns = document.getElementsByClassName("dropdown__content");
        for (let i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show__dropdown')) {
                openDropdown.classList.remove('show__dropdown');
            }
        }
    }
}