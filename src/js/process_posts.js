export default function processPostsData(postsData, settings) {
    // analys e every post
    let processedPostsData = []
    postsData.forEach(function (post) {
        processedPostsData.push(processData(post, settings))
    })

    // filter posts
    for (let i = processedPostsData.length - 1; i >= 0; i--) {
        if (!processedPostsData[i].show) {
            processedPostsData.splice(i, 1);
        }
    }

    // index posts
    processedPostsData.forEach(function (element, y) {
        element.index = y
    })

    return processedPostsData
}





function processData(data, settings) {
    // refactor text
    data = filterOutTables(data)
    // apply settings
    data = filterPosts(data, settings)

    return data
}

function filterPosts(data, settings) {
    data.show = true

    // flair
    if (data.link_flair_text === "Selling" && !settings[0].options.Selling) {
        data.show = false
    } else if (data.link_flair_text === "Buying" && !settings[0].options.Buying) {
        data.show = false
    } else if (data.link_flair_text === "Trading" && !settings[0].options.trading) {
        data.show = false
    } else if (data.link_flair_text === "Artisan" && !settings[0].options.Artisan) {
        data.show = false
    } else if (data.link_flair_text === "Service" && !settings[0].options.Service) {
        data.show = false
    } else if (data.link_flair_text === "Vendor" && !settings[0].options.Vendor) {
        data.show = false
    } else if (data.link_flair_text === "Bulk" && !settings[0].options.Bulk) {
        data.show = false
    } else if (data.link_flair_text === "Interest Check" && !settings[0].options["Interest Check"]) {
        data.show = false
    } else if (data.link_flair_text === "Group Buy" && !settings[0].options["Group Buy"]) {
        data.show = false
    } else if (!data.link_flair_text) {
        data.show = false
    }

    //location
    let location = data.classification.location


    let short = ""
    if (location !== "none") {
        short = location[0] + location[1]
        if (!settings[1].options[short] && !settings[1].options.All) {
            data.show = false
        }
    }

    //appearance

    //broken
    if (data.reported.broken) data.classification.broken = true

    if (settings[2].options.show === false && data.classification.broken) {
        data.show = false
    }

    // search terms
    for (let term in settings[3].options) {
        if (settings[3].options[term]) {
            let match = data.title.match(RegExp(term, "gi"))
            if (match === null) data.show = false
        }
    }

    return data
}




function filterOutTables(data) {

    let text = data.refactored.html
    let lines = text.match(/^\s*.*$/gm)
    let tables = []
    let current = ""


    // get possible lines
    let linenum = 0
    lines.forEach(function (element, i) {
        if (element.match(/\|/g) !== null) {
            current += element + "\n"
        } else if (element === "") {
        } else {
            if (current !== "") {
                if (current.match(/\|/g).length > 1) {
                    tables.push({ text: current, start: linenum + 1, end: i - 1, })
                }
                current = ""
            }
            linenum = i
        }
    })







    if (current !== "") {
        tables.push({ text: current, start: linenum + 1, end: lines.length - 1, })
    }





    // refactor tables
    tables.forEach(function (table) {
        let lines = table.text.match(/^.*/gm)
        let full = ""
        lines.forEach(function (line) {
            if (line[0] === "|") line = line.slice(0)
            if (line[line.length - 1] === "|") line = line.slice(1, line.length - 1)
            if (line.match(/\|:-/g) === null)
                full += line + "\n"
        })
        table.text = full
    })

    tables.forEach(function (table) {
        let lines = table.text.match(/^.*/gm)
        let structure = []

        lines.forEach(function (line) {
            if (line !== "") {

                let columns = line.split("|")


                structure.push(columns)
            }
        })
        table.structure = structure
    })

    let allLines = text.match(/^\s*.*$/gm)

    let deleted = 0
    tables.forEach(function (table, i) {
        let diff = table.end - table.start + 1
        table.start = table.start - deleted + i

        allLines.splice(table.start, diff, "[table" + i + "]")

        deleted += diff
    })

    let refactored = []
    allLines.forEach(function (line) {
        refactored += line + "\n"
    })

    data.refactored.html = refactored
    data.refactored.tables = tables


    let i = 0
    data.refactored.html = data.refactored.html.replace(/\[table.*?\]/gm, () => {
        let tableHtml = "<div id='table__wrapper'><table>"

        tables[i].structure.forEach(function (row) {
            tableHtml += "<tr>"
            row.forEach(function (element) {

                tableHtml += "<th>" + element + "</th>"
            })

            tableHtml += "</tr>"
        })



        tableHtml += "</table></div>"
        i++
        return tableHtml
    })






    return data
}




