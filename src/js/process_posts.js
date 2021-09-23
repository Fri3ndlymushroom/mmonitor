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
    // get infos
    data = classifyData(data)
    // refactor text
    data = refactorText(data)
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
    if (location) {
        short = location[0] + location[1]
        if (!settings[1].options[short] && !settings[1].options.All) {
            data.show = false
        }
    }

    //appearance

    //broken
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


function refactorText(data) {

    data.refactored = {
        html: ""
    }
    data = filterOutLinks(data)
    data = filterOutTables(data)
    data = filterOutSpecialText(data)

    let i = -1
    data.refactored.html = data.refactored.html.replace(/^.*$/gm, function () {
        let lines = data.refactored.html.match(/^.*$/gm)
        i++
        return ("<p>" + lines[i] + "</p>")
    })

    return data
}


function filterOutSpecialText(data) {

    // Bold Italic ***
    let i = -1
    data.refactored.html = data.refactored.html.replace(/(\*\*\*).*(\*\*\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*\*\*).*(?=\*\*\*)/gm)
        i++
        return "<span class='bold italic'>" + found[i] + "</span>"
    })

    // Bold **
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\*\*).*(\*\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*\*).*(?=\*\*)/gm)
        i++
        return "<span class='bold'>" + found[i] + "</span>"
    })

    // Italic *
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\*).*(\*)/gm, function () {
        let found = data.refactored.html.match(/(?<=\*).*(?=\*)/gm)
        i++
        return "<span class='italic'>" + found[i] + "</span>"
    })

    // dot *
    i = -1
    data.refactored.html = data.refactored.html.replace(/(\* )/g, function () {

        i++
        return "<span>•</span>"
    })

    // Heading 2 ##
    i = -1
    data.refactored.html = data.refactored.html.replace(/(## ).*?(?=<)/gm, function () {
        let found = data.refactored.html.match(/(?<=## ).*?(?=<)/gm)

        i++
        return "<span class='post__h2 italic'>" + found[i] + "</span>"
    })

    // Heading 1 #
    i = -1
    data.refactored.html = data.refactored.html.replace(/(# ).*?(?=<)/gm, function () {
        let found = data.refactored.html.match(/(?<=# ).*?(?=<)/gm)


        i++
        return "<span class='post__h1 italic'>" + found[i] + "</span>"
    })

    // ignore \
    data.refactored.html = data.refactored.html.replace(/\\/g, "")

    // ignore &***;
    data.refactored.html = data.refactored.html.replace(/&.*;/g, "")

    return data
}

function filterOutLinks(data) {
    if (data.selftext) {
        data.selftext = data.selftext.replace(/\\/gm, "")
        let html = "<span>" + data.selftext + "</span>"
        let links = html.match(/\[(.*?)\]( *)\((.*)\)/g)

        let sublinks = []
        if (links != null) {

            links.forEach(function (element) {
                sublinks.push(
                    {
                        link_text: element.match(/(?<=\[).*?(?=\])/g)[0],
                        url: element.match(/(?<=\().*(?=\))/g)[0]
                    })
            })
            let i = -1
            html = html.replace(/\[(.*)\]( *)\((.*)\)/g, function () {
                i++
                let link = ("<a href='" + sublinks[i].url + "'>" + sublinks[i].link_text + "</a>")
                return link
            })
        }

        data.refactored.html = html
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
        if (element.match(/\|/g) != null) {
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
                structure.push(line.split("|"))
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

    return data
}


function classifyData(data) {

    data.classification = {
        location: undefined,
        has: undefined,
        wants: undefined,
        has_title_products: undefined,
        wants_title_products: undefined,
        no_has_wants: undefined,
        flair: data.link_flair_text,
        broken: false
    }

    let title = data.title
    title = title.replace(/&amp;/g, "&")
    title = title.replace(/&.*;/g, "")
    data.title = title

    let noHasWants = false
    let specialFlairs = ["Artisan", "Service", "Vendor", "Bulk", "Interest Check", "Group Buy"]
    specialFlairs.forEach(function (flair) {
        if (data.classification.flair === flair) noHasWants = true
    })

    // todo: add exceptoion for ic gb artisain etc...
    let has = title.match(/(?<=\[H\])(.*)(?=\[W\])/g)
    let location = title.match(/(?<=\[)(.*?)(?=\])/g)
    let wants = title.match(/(?<=\[W])(.*)/g)

    if (has === null || location === null || wants === null) {
        data.classification.broken = true
    } else if (data.selftext === "[removed]") {
        data.classification.broken = true
    } else if (location.length === 3 || has.length === 1 || wants.lengt === 1) {
        data.classification.location = location[0]
        data.classification.has = has[0]
        data.classification.wants = wants[0]
        data.has_title_products = has[0].split(",")
        data.wants_title_products = wants[0].split(",")
    } else {
        data.classification.broken = true
    }

    if (noHasWants) {
        data.title = data.title.replace(/^\[(.*?)\]/g, "")
        data.classification.no_has_wants = true
        data.classification.broken = false
        return data
    }

    return data
}

