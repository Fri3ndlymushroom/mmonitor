
export function getOptionsArray(settings) {


    settings.forEach(function (setting) {
        let arr = []
        for (let option in setting.options) {
            arr.push({ title: option, checked: setting.options[option] })
        }
        setting.arr = arr
    })

    return settings
}

export default function getSettings() {

    let defaultSettings = [
        {
            id: "dropdown--flair",
            ls: "Flair",
            options: {
                Selling: true,
                Buying: false,
                Trading: false,
                Artisan: false,
                Service: false,
                Vendor: false,
                Bulk: false,
                "Interest Check": false,
                "Group Buy": false,

            }
        },
        {
            id: "dropdown--location",
            ls: "Location",
            options: {
                AU: true,
                CA: true,
                EU: true,
                JP: true,
                KR: true,
                NZ: true,
                SG: true,
                UK: true,
                US: true,
                All: true,
            }
        },
        {
            id: "dropdown--appearance",
            ls: "Appearance",
            options: {
                "Single-Posts": false,
                "Tables-Filtered-Out": false
            }
        },
        {
            id: "dropdown--broken",
            ls: "Show broken posts",
            options: {
                "show": false
            }
        },
        {
            id: "dropdown--search",
            ls: "Search Terms",
            options: {
                "Giveaway": false
            }
        },
    ]


    if (localStorage.getItem("Flair") == null) {
        defaultSettings.forEach(function (type) {
            localStorage.setItem(type.ls, JSON.stringify(type.options))
        })
    } else {
        defaultSettings.forEach(function (element, i) {
            let lsdoc = JSON.parse(localStorage.getItem(element.ls))
            defaultSettings[i].options = lsdoc
        })
    }

    return defaultSettings
}