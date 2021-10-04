
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
            only_one: false,
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
            only_one: true,
            id: "dropdown--location",
            ls: "Location",
            options: {
                AU: false,
                CA: false,
                EU: false,
                JP: false,
                NZ: false,
                SG: false,
                UK: false,
                US: false,
                All: true,
            }
        },
        {

            id: "dropdown--broken",
            ls: "Show broken posts",
            only_one: false,
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