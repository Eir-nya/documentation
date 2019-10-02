pages = getPages();

function random_page() {
    var new_page = pages[0];
    do
        new_page = pages[Math.floor(Math.random() * pages.length)];
    while (new_page == document.querySelector(".page.active").id);
    loadPage(new_page);
	// document.location.href = pages[new_page];
};

// on page load: link pressing "enter" in the search box to clicking "go"
document.getElementById("search-box").addEventListener("keyup", function(event) {if (event.key === "Enter"/* && document.getElementById("search-box").value.length > 0*/) {document.getElementById("search-button").click(); document.getElementById("search-button").focus();}});

// store the page's scroll position on refresh
window.addEventListener("beforeunload", function() {
    document.cookie = "scroll=" + window.scrollY.toString();
});


// seeks out an anchor on the currently-loaded page by name, and then scrolls to it
function seekAnchorOnPage(id) {
    // first, find the active page
    for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
        if (document.getElementsByClassName("page")[i].className.indexOf("active") > -1) {
            var page = document.getElementsByClassName("page")[i];
            
            // second, find all anchors
            var anchors = page.getElementsByTagName("a");
            
            /*
            // search through all <p> elements for anchors as well
            var p = page.getElementsByTagName("p");
            
            var toAdd = [];
            for (var j = 0; j < p.length; j++) {
                var anchorList = p[j].getElementsByTagName("a");
                for (var k = 0; k < anchorList.length; k++) {
                    if (anchorList[k].name != null)
                        toAdd.push(anchorList[k]);
                }
            }
            */
            
            var toSearch = [];
            for (var j = 0; j < anchors.length; j++)
                toSearch.push(anchors[j]);
            // toSearch = toSearch.concat(toAdd);
            
            
            // third, find the requested anchor
            for (var j = 0; j < toSearch.length; j++) {
                if (toSearch[j].name != undefined && toSearch[j].name.split(":")[1] == id) {
                    // fourth, scroll to it
                    // work-around to wait for the page to load before scrolling
                    setTimeout(function() {window.scrollTo(0, (toSearch[j].getBoundingClientRect().top + window.scrollY) - 30);}, 10);
                    
                    return;
                };
            };
            
            break;
        };
    };
};

window.onload = function() {
    // make every anchor unique by adding the name of the page it's in as a prefix
    var pages = document.getElementsByClassName("page");

    for (var i = 0; i < pages.length; i++) {
        var prefix = pages[i].id + ":";
        
        // add the prefix to every anchor name
        // get all links that are descendants of the pages
        var a = pages[i].getElementsByTagName("a");
        for (var j = 0; j < a.length; j++) {
            // this defines a page anchor
            if (a[j].href == "" && typeof(a[j].getAttribute("name")) == "string") {
                // every anchor should only be used once, so we can count on this being unique
                a[j].setAttribute("name", prefix + a[j].getAttribute("name"));
            };
        };
        
        // add the prefix to every reference to the anchor
        // find all references to the tag names
        for (var j = 0; j < a.length; j++) {
            // see if it is a reference to a page anchor
            if (a[j].href.length > 0 && typeof(a[j].getAttribute("name")) != "string"
             && typeof(a[j].getAttribute("href")) == "string" && a[j].getAttribute("href")[0] == "#"
             && a[j].getAttribute("href").indexOf(":") == -1) {
                var target = a[j].getAttribute("href").split("#")[1];
                a[j].setAttribute("href", "#" + prefix + target);
            };
        };
    };

    // replace all anchor references with javascript links
    window.scrollTo(0, 0);
    var alreadyActive = null;

    for (var i = 0; i < pages.length; i++) {
        if (pages[i].className.indexOf("active") > -1)
            alreadyActive = pages[i];
        else
            pages[i].className == "page active";
        
        var a = pages[i].getElementsByTagName("a");
        
        for (var j = 0; j < a.length; j++) {
            if (a[j].href.length > 0 && a[j].getAttribute("href")[0] == "#") {
                var str = "javascript:";
                
                var targetPageName = a[j].getAttribute("href").split(":")[0].split("#")[1];
                var targetAnchorName = a[j].getAttribute("href").split(":")[1];
                
                var targetPage = document.getElementById(targetPageName);
                
                var targetAnchors = targetPage.getElementsByTagName("a");
                var targetAnchor;
                
                for (var k = 0; k < targetAnchors.length; k++) {
                    if (targetAnchors[k].name.split(":")[1] == targetAnchorName) {
                        targetAnchor = targetAnchors[k];
                        break;
                    }
                }
                
                // target anchor is on another page
                if (pages[i].id != targetPageName) {
                    str += "loadPage('" + targetPageName + "');";
                    
                    str += "seekAnchorOnPage('" + targetAnchorName + "');";
                    /*
                    // unload all pages
                    for (k = 0; k < i; k++)
                        pages[k].className = "page";
                    
                    // make the target page active
                    targetPage.className = "page active";
                    
                    // grab the position of the anchor
                    str += "window.scrollTo(0, (" + targetAnchor.getBoundingClientRect().top.toString() + ") - 30 + window.scrollY);";
                    
                    // de-activate the target page
                    targetPage.className = "page";
                    
                    //re-activate the active page if applicable
                    if (alreadyActive != null)
                        alreadyActive.className = "page active";
                    */
                } else
                    str += "seekAnchorOnPage('" + targetAnchorName + "');";
                    // str += "window.scrollTo(0, (" + targetAnchor.getBoundingClientRect().top.toString() + ") - 30);";
                    // str += "window.scrollTo(0, document.getElementsByClassName('page')[" + i + "].getElementsByTagName('a')[" + j + "].getBoundingClientRect().top - 30);";
                
                a[j].setAttribute("href", str);
            };
        };
        
        pages[i].className = "page";
    };

    if (alreadyActive != null)
        alreadyActive.className = "page active";
    
    // scroll to the location where you left off
    if (document.cookie.indexOf("scroll=") > -1) {
        var scrollString = document.cookie.split("scroll=")[1].split(" ")[0].split(";")[0];
        window.scrollTo(0, Number(scrollString));
    };
};

// recursive scan to extract all raw text from nodes
function recursiveScan(node) {
    var rawTextTable = [];
    // phase 1: extract all HTML as nested tables
    for (var i = 0; i < node.childNodes.length; i++) {
        // exclude specific node types
        if (node.childNodes[i].nodeName == "SCRIPT"
         || node.childNodes[i].nodeName == "#comment"
         || (node.childNodes[i].className == "contents" && node.childNodes[i].tagName == "DIV")) {
            continue;
        };
        
        if (node.childNodes[i].childNodes.length > 0) {
            rawTextTable = rawTextTable.concat(recursiveScan(node.childNodes[i]));
        } else {
            // if innerHTML, use it; if not, use nodeValue
            if (node.childNodes[i].innerHTML != undefined
                       && /[^ \n\t]/.exec(node.childNodes[i].innerHTML) != null) {
                // remove HTML tags.
                var txt = node.childNodes[i].innerHTML;
                while (txt.search(/(<([^>]+)>)/ig) > -1) {
                    txt = txt.replace(/(<([^>]+)>)/ig, "");
                };
                rawTextTable.push(txt);
            } else if (node.childNodes[i].nodeValue != undefined
                       && /[^ \n\t]/.exec(node.childNodes[i].nodeValue) != null) {
                rawTextTable.push(node.childNodes[i].nodeValue);
            };
        };
    };
    
    // phase 2: empty all tables into one
    var tableInTables = false;
    do {
        var i = 0;
        for (i = 0; i < rawTextTable.length; i++) {
            if (typeof(rawTextTable[i]) == "object") {
                tableInTables = true;
                break;
            } else {
                tableInTables = false;
            };
        };
        
        if (tableInTables) {
            // `i` is now the position of the first sub-array
            var arrayBefore = rawTextTable.slice(0, i);
            var arrayAfter = rawTextTable.slice(i + 1);
            var arrayCombined = arrayBefore;
            
            for (var j = 0; j < rawTextTable[i].length; j++) {
                arrayCombined.push(rawTextTable[i][j]);
            };
            arrayCombined += arrayAfter;
        };
    } while (tableInTables);
    
    return rawTextTable;
};

function search() {
	var input = document.getElementById("search-box");
	var search_text = input.value;
    
    // search for every word individually!
    var search_terms = search_text.split(" ");
    
    // eliminate empty strings
    for (var i = 0; i < search_terms.length; i++) {
        if (search_terms[i] == "") {
            search_terms = search_terms.splice(0, i) + search_terms.splice(i + 1);
        };
    };
    
    // do NOT allow `search_terms` to be a string
    if (typeof(search_terms) == "string") {
        search_terms = [search_terms];
    };
    
    if (search_text != "" && search_terms.length > 0) {
        // if we are already on the search page, clear it out first
        if (document.querySelector(".page.active").id == "search") {
            while (document.querySelector(".page.active").hasChildNodes()) {
                document.querySelector(".page.active").removeChild(document.querySelector(".page.active").childNodes[0]);
            };
        };
        
        var results = [];
        var anyInTitle = 0;
        
        // get all pages
        var allPages = document.getElementsByClassName("page");
        
        // check page titles first
        for (var i = 0; i < allPages.length; i++) {
            // exclude the search page and the style test page
            if (i != 1 && i != 2) {
                for (var j = 0; j < search_terms.length; j++) {
                    if (allPages[i].getAttribute("name").toLowerCase().indexOf(search_terms[j].toLowerCase()) > -1) {
                        // array inserted:
                        // [node: page element, int: the first paragraph that also matched the search term, or -1]
                        
                        // only insert the title match if it isn't already present in the table
                        var alreadyInTable = false;
                        for (k = 0; k < results.length; k++) {
                            if (results[k][0] == allPages[i]) {
                                alreadyInTable = true;
                            };
                        };
                        
                        if (!alreadyInTable) {
                            results.push([allPages[i], -1]);
                            anyInTitle = results.length;
                        };
                    };
                };
            };
        };
        
        // search page contents
        for (var i = 0; i < allPages.length; i++) {
            // exclude the search page and the style test page
            if (i != 1 && i != 2) {
                // get all paragraphs
                /*
                var str = allPages[i].getAttribute("name") + "\n";
                var num = 0;
                for (var j = 0; j < allPages[i].childNodes.length; j++) {
                    str += num + ":\t" + allPages[i].childNodes[j].nodeName + "\n";
                    num += 1;
                };
                alert(str);
                */
                
                var allContent = recursiveScan(allPages[i]);
                var found = false;
                for (var j = 1; j < allContent.length; j++) {
                    // disallow script things
                    
                    for (var k = 0; k < search_terms.length; k++) {
                        var content = allContent[j];
                        
                        // strip HTML elements before searching so they don't get matched
                        var strippedString = content;
                        while (strippedString.search(/(<([^>]+)>)/ig) > -1) {
                            strippedString = strippedString.replace(/(<([^>]+)>)/ig, "");
                        };
                        
                        if (strippedString.toLowerCase().indexOf(search_terms[k].toLowerCase()) > -1
                            && strippedString != "Contents") {
                            // check if this page is already in the search results
                            // if it is: set its paragraph number to j; if it isn't, add it
                            var alreadyInTable = false;
                            
                            for (var l = 0; l < results.length; l++) {
                                if (results[l][0] == allPages[i]) {
                                    results[l][1] = j;
                                    alreadyInTable = true;
                                    break;
                                };
                            };
                            
                            if (!alreadyInTable) {
                                results.push([allPages[i], j]);
                            };
                            
                            found = true;
                            break;
                        };
                    };
                    
                    if (found)
                        break;
                };
                /*
                var p = allPages[i].getElementsByTagName("p");
                for (var j = 0; j < p.length; j++) {
                    // make sure we do not use a section divider by mistake
                    if (p[j].childNodes.length > 0 && p[j].childNodes[p[j].childNodes.length - 1].tagName == "a" && p[j].childNodes[p[j].childNodes.length - 1].href == null) {
                        continue;
                    // search for each search term
                    } else {
                        for (var k = 0; k < search_terms.length; k++) {
                            // strip HTML elements before searching so they don't get matched
                            var strippedString = p[j].innerHTML;
                            while (strippedString.search(/(<([^>]+)>)/ig) > -1) {
                                strippedString = strippedString.replace(/(<([^>]+)>)/ig, "");
                            };
                            
                            if (strippedString.toLowerCase().indexOf(search_terms[k].toLowerCase()) > -1) {
                                // check if this page is already in the search results
                                // if it is: set its paragraph number to j; if it isn't, add it
                                var alreadyInTable = false;
                                
                                for (var l = 0; l < results.length; l++) {
                                    if (results[l][0] == allPages[i]) {
                                        results[l][1] = j;
                                        alreadyInTable = true;
                                        break;
                                    };
                                };
                                
                                if (!alreadyInTable) {
                                    results.push([allPages[i], j]);
                                };
                                
                                break;
                            };
                        };
                    };
                };
                */
            };
        };
        
        // edit the search page
        var searchPage = allPages[2];
        writeTitle("Search Results for \"" + search_text + "\":", searchPage);
        
        // add results
        var h2 = document.createElement("h2");
        var div = document.createElement("div");
        div.className = "separator";
        if (anyInTitle > 0) {
            h2.innerHTML = anyInTitle.toString();
            if (anyInTitle == 1) {
                h2.innerHTML += " match found in page titles:";
            } else {
                h2.innerHTML += " matches found in page titles:";
            };
        } else {
            if (results.length > 0) {
                h2.innerHTML = "No matches found in page titles.";
            } else {
                h2.innerHTML = "No matches found anywhere.";
            };
        };
        searchPage.appendChild(h2);
        searchPage.appendChild(div);
        // add results for page title matches
        var addLink = function(result) {
            // highlight search term matches in a large body of text
            function highlightTermInText(inner, searches) {
                // first, find all matches of `search` in `inner` without HTML tags, and store them to `matches`
                var matches = [];
                
                var strippedString = inner;
                while (strippedString.search(/(<([^>]+)>)/ig) > -1) {
                    strippedString = strippedString.replace(/(<([^>]+)>)/ig, "");
                };
                
                // select matches by the order they appear in `inner`
                var anyPresent = false;
                for (var j = 0; j < searches.length; j++) {
                    if (strippedString.toLowerCase().indexOf(searches[j].toLowerCase()) > -1) {
                        anyPresent = true;
                        break;
                    };
                };
                while (anyPresent) {
                    // determine the closest number to the front
                    var closestPos = ["", strippedString.length];
                    
                    for (var i = 0; i < searches.length; i++) {
                        if (strippedString.toLowerCase().indexOf(searches[i].toLowerCase()) > -1 && strippedString.toLowerCase().indexOf(searches[i].toLowerCase()) < closestPos[1]) {
                            closestPos = [searches[i], strippedString.toLowerCase().indexOf(searches[i].toLowerCase())];
                        };
                    };
                    
                    // if possible, extract the substrings as necessary, but if no matches are left, it's time to move on
                    if (closestPos[0] == "") {
                        anyPresent = false;
                    } else {
                        if (strippedString.toLowerCase().indexOf(closestPos[0].toLowerCase()) > -1) {
                            matches.push(strippedString.substring(strippedString.toLowerCase().indexOf(closestPos[0].toLowerCase()), strippedString.toLowerCase().indexOf(closestPos[0].toLowerCase()) + closestPos[0].length));
                            strippedString = strippedString.substring(strippedString.toLowerCase().indexOf(closestPos[0].toLowerCase()) + closestPos[0].length);
                        };
                    };
                };
                
                //alert("inner:\n" + inner + "\nmatches:\n" + matches);
                
                // next, copy the original string `inner` to `innerCopy` and store all HTML tags to `Tags`, and everything else to `nonTags`
                var innerCopy = inner;
                
                var nonTags = [];
                var Tags = [];
                
                while (innerCopy.toLowerCase().search(/(<([^>]+)>)/ig) > -1) {
                    var stringBefore = innerCopy.substring(0, innerCopy.toLowerCase().search(/(<([^>]+)>)/ig));
                    var match = /(<([^>]+)>)/ig.exec(innerCopy);
                    
                    nonTags.push(stringBefore);
                    Tags.push(match);
                    
                    innerCopy = innerCopy.substring(innerCopy.toLowerCase().search(/(<([^>]+)>)/ig) + match.length);
                };
                
                nonTags.push(innerCopy);
                
                // then, substitute `search` in each item in `nonTags` with each respective item in `matches`
                var tag = 0;
                for (var i = 0; i < nonTags.length; i++) {
                    var copy = nonTags[i];
                    
                    var notIncluded = [];
                    
                    // alow for multiple search terms
                    var anyInString = false;
                    for (var j = 0; j < searches.length; j++) {
                        if (copy.toLowerCase().indexOf(searches[j].toLowerCase()) > -1) {
                            anyInString = true;
                            break;
                        };
                    };
                    while (anyInString) {
                        // find the search term closest to the beginning and deal with it first
                        var lowestPos = ["", copy.length];
                        for (var j = 0; j < searches.length; j++) {
                            if (copy.toLowerCase().indexOf(searches[j].toLowerCase()) > -1 && copy.toLowerCase().indexOf(searches[j].toLowerCase()) < lowestPos[1]) {
                                lowestPos = [searches[j], copy.toLowerCase().indexOf(searches[j].toLowerCase())];
                            };
                        };
                        
                        if (lowestPos[0] == "") {
                            anyInString = false;
                        } else {
                            var pos = copy.toLowerCase().indexOf(lowestPos[0].toLowerCase());
                            notIncluded.push(copy.substring(0, pos));
                            copy = copy.substring(pos + lowestPos[0].length);
                        };
                    };
                    notIncluded.push(copy);
                    
                    var replacement = "";
                    for (var j = 0; j < notIncluded.length; j++) {
                        replacement += notIncluded[j];
                        if (j < matches.length) {
                            replacement += "<mark>" + matches[tag] + "</mark>";
                            tag += 1;
                        };
                    };
                    
                    nonTags[i] = replacement;
                    //nonTags[i] = nonTags[i].substring(0, pos) + "<mark>" + matches[tag] + "</mark>" + nonTags[i].substring(pos + search.length);
                    //tag += 1;
                };
                
                // finally, piece it all together!
                var finalString = "";
                
                for (var i = 0; i < nonTags.length; i++) {
                    finalString += nonTags[i];
                    //finalString += "<mark>" + matches[i] + "</mark>";
                };
                //finalString += innerCopy;
                
                return finalString;
            };
            /* backup
            function highlightTermInText(inner, search) {
                var reversed = inner.split("").reverse().join("");
                var reversed_search = search.split("").reverse().join("");
                var pos = reversed.search(new RegExp(reversed_search + "(?!\>kram\<)", "i"));
                
                while (pos > -1) {
                    var beforeText = reversed.substring(0, pos);
                    var afterText = reversed.substring(pos + reversed_search.length);
                    
                    var match = new RegExp(reversed_search + "(?!\>kram\<)", "i").exec(reversed);
                    
                    reversed = beforeText + ">kram/<" + match + ">kram<" + afterText;
                    
                    pos = reversed.search(new RegExp(reversed_search + "(?!\>kram\<)", "i"));
                };
                
                return reversed.split("").reverse().join("");
            };
            */
            
            var h2 = document.createElement("h2");
            var a = document.createElement("a");
            a.innerHTML = result[0].getAttribute("name");
            a.innerHTML = highlightTermInText(a.innerHTML, search_terms);
            a.href = "javascript:loadPage(\"" + result[0].id + "\");";
            h2.appendChild(a);
            searchPage.appendChild(h2);
            
            // display matched content if applicable
            if (result[1] > -1) {
                var p = document.createElement("p");
                p.style = "margin-top: 0px;";
                var prefix = document.createElement("font");
                prefix.innerHTML = "...";
                prefix.style = "font-family: 'blackadder';font-weight: bold;"
                // prefix.style = "font-size:24px;height:4px;";
                var suffix = prefix.cloneNode(true);
                
                p.appendChild(document.createElement("br"));
                p.appendChild(prefix);
                
                // use the recursive scan to extract all raw text from the search result's matching paragraph
                // attempt to join the surrounding 2 elements as well if possible
                // var content = recursiveScan(result[0])[result[1]];
                var content = recursiveScan(result[0]).slice(result[1] - 2, result[1] + 2);
                var foundText = "";
                for (var i = 0; i < content.length; i++) {
                    if (typeof(content[i]) === "string") {
                        foundText += content[i].toString();
                    };
                };
                
                // highlight matches in content
                foundText = highlightTermInText(foundText, search_terms);
                p.innerHTML += foundText;
                
                /*
                var content = result[0].getElementsByTagName("p")[result[1]].childNodes;
                for (var i = 0; i < content.length; i++) {
                    p.appendChild(content[i].cloneNode(true));
                };
                */
                
                p.appendChild(suffix);
                
                searchPage.appendChild(p);
            };
        };
        if (anyInTitle > 0) {
            while (anyInTitle > 0) {
                anyInTitle--;
                addLink(results[0]);
                results.shift();
            };
        };
        
        var h2 = document.createElement("h2");
        if (anyInTitle == results.length) {
            h2.innerHTML = "No other results found.";
        } else {
            h2.innerHTML = "Other results:";
        };
        searchPage.appendChild(h2);
        var div = document.createElement("div");
        div.className = "separator";
        searchPage.appendChild(div);
        
        // add content matches
        for (var i = 0; i < results.length; i++) {
            addLink(results[i]);
        };
        
        // finally, load the results page!
		loadPage("search");
    };
};

function loadPage(newPage) {
    var allPages = document.getElementsByClassName("page");
    
    // first, de-activate the current page if possible
    var currentPage = document.querySelector(".page.active");
    if (currentPage != null) {
        currentPage.className = currentPage.className.replace(" active", "");
        
        // if the page we just came from is the search page, reset it
        if (currentPage.id == "search" && newPage != "search") {
            while (currentPage.hasChildNodes()) {
                currentPage.removeChild(currentPage.childNodes[0]);
            };
        };
        
        // scroll to the top
        window.scrollTo(0, 0);
    };
    
    // then, activate the new page
    for (var i = 0; i < allPages.length; i++) {
        if (allPages[i].id == newPage) {
            allPages[i].className += " active";
            document.title = allPages[i].getAttribute("name") + " | Unofficial Unitale/CYF Documentation";
            break;
        } else if (i == allPages.length - 1)
            alert("Page \"" + newPage.toString() + "\" was not found.\nThis is a bug in the Documentation. Please send a screenshot to the developers.");
    };
    
    // set a cookie to store the last-opened page
    document.cookie = "page=" + newPage;
};

// initial page opening
if (document.cookie.indexOf("page") < 0 || document.cookie.split("page=")[1].split(" ")[0].split(";")[0] == "search")
    loadPage("index");
else {
    var pageString = document.cookie.split("page=")[1].split(" ")[0].split(";")[0];
    loadPage(pageString);
};

/* ==================== */
/* SUBSTITUTION SECTION */
/* ==================== */

// external link icon
var links = document.getElementsByTagName("a");

for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("href") != null && links[i].href.indexOf("http") == 0) {
        links[i].className = "external";
        links[i].setAttribute("title", "External link: " + links[i].href);
    };
};

// used for adding titles to all elements with certain class names
function setClassTitle(class_name, title) {
    for (var i = 0; i < document.getElementsByClassName(class_name).length; i++) {
        var item = document.getElementsByClassName(class_name)[i];
        
        if (item.getAttribute("title") != null) {
            item.setAttribute("title", item.getAttribute("title") + " | " + title);
        } else {
            item.setAttribute("title", title);
        };
        
        // add "optional"
        if (item.className.indexOf("optional") > 0)
            item.setAttribute("title", item.getAttribute("title") + " (optional)");
    };
};

// add labels for CYF and Unitale exclusive features
setClassTitle("cyf", "CYF-Exclusive");
setClassTitle("unitale", "Unitale-Exclusive");

// label various data types in code examples:
// numbers
setClassTitle("number", "Lua: Number");
setClassTitle("boolean", "Lua: Boolean");
setClassTitle("string", "Lua: String");
setClassTitle("LuaTable", "Lua: Table");
setClassTitle("UnitaleProjectile", "Unitale/CYF: Projectile");
setClassTitle("UnitaleSprite", "Unitale/CYF: Sprite Object");
setClassTitle("UnitaleScript", "Unitale/CYF: Script Object");
setClassTitle("CYFText", "CYF: Text Object");

// keyboard key indicators
var kbd = document.getElementsByTagName("kbd");

for (var i = 0; i < kbd.length; i++) {
    kbd[i].setAttribute("title", "Keyboard Key: " + kbd[i].innerHTML);
};

// add "click for types" to all functions
var funcs = document.getElementsByClassName("function");

for (var i = 0; i < funcs.length; i++) {
    // functions with the class "exclude" will not be counted
    if (funcs[i].className.indexOf("exclude") > -1)
        continue;
    
    var thing = funcs[i];
    
    var old = thing.innerHTML;
    var str = "";
    for (var j = 0; j < thing.innerHTML.length; j++) {
        // add text for variables with types
        if (thing.innerHTML[j] == "<") {
            var end = thing.innerHTML.indexOf(">", j) + 1;
            var substr = thing.innerHTML.substring(j, end);
            
            str += substr;
            if (substr.indexOf("class") > -1) {
                str += "<i>";
                // check if we should also add "optional"
                /*
                if (thing.innerHTML.slice(end).indexOf("*") > -1 && thing.innerHTML.slice(end).indexOf("*") <= thing.innerHTML.slice(end).indexOf("class")) {
                    str += "optional ";
                };
                */
                if (substr.indexOf(" optional\"") > substr.indexOf("class=\"") && substr.indexOf("class=\"") > 0)
                    str += "optional ";
                
                // add the name of the variable type to the text
                str += substr.split("class=\"")[1].split("\"")[0].split(" ")[0] + "</i> ";
            };
            j = end;
        // add text for script labels
        } else if (thing.innerHTML[j] == "[") {
            // store the length of str before starting;
            var startingLength = str.length;
            
            var temp = function(letter) {
                if (letter == "E") {
                    return "Encounter";
                } else if (letter == "M") {
                    return "Monster";
                } else if (letter == "W") {
                    return "Wave";
                };
                
                return "";
            };
            
            str += "(";
            
            var currentChar = j;
            while (thing.innerHTML[currentChar] != "]") {
                currentChar += 1;
                
                str += temp(thing.innerHTML[currentChar]);
                
                if (thing.innerHTML[currentChar] == "/") {
                    var nextSlash = thing.innerHTML.slice(currentChar + 1).indexOf("/");
                    
                    // if there is another slash after this one (there can only be 2 max)
                    if (nextSlash > -1) {
                        str += ", ";
                    // otherwise
                    } else {
                        // check if there was a slash before this one
                        var prevSlash = str.slice(startingLength).indexOf("/");
                        
                        // there was a previous slash
                        if (prevSlash > -1) {
                            str += ", and ";
                        // there was no previous slash (there is only one slash total)
                        } else {
                            str += " and ";
                        };
                    };
                };
            };
            
            str += " scripts)";
            
            j = thing.innerHTML.length - 1;
        };
        if (thing.innerHTML[j] != undefined) {
            str += thing.innerHTML[j];
        };
    };
    
    thing.setAttribute("test1", str);
    thing.setAttribute("test2", old);
    
    var toggle = false;
    thing.onclick = function(thing) {
        toggle = !toggle;
        if (toggle) {
            this.innerHTML = this.getAttribute("test1");
        } else {
            this.innerHTML = this.getAttribute("test2");
        };
    };
    
    var textParent = document.createElement("i");
    textParent.className = "clickLabel";
    var text = document.createTextNode("click below for types, or hover over each variable for its type");
    textParent.appendChild(text);
    // textParent.style = "color: rgba(1, 1, 1, 0.75)";
    funcs[i].parentNode.insertBefore(textParent, funcs[i]);
    funcs[i].parentNode.insertBefore(document.createElement("br"), textParent.nextSibling);
};

// add "show/hide comments" buttons to all <pre> elements
var pre = document.getElementsByTagName("pre");

for (var i = 0; i < pre.length; i++) {
    var textParent = document.createElement("div");
    textParent.className = "ShowHideText";
    
    // link 1: show
    var show = document.createElement("a");
    show.href = "javascript:";
    show.setAttribute("onclick", "showComments(this.parentNode.parentNode, true);");
    show.onclick = "showComments(this.parentNode.parentNode, true);";
    show.appendChild(document.createTextNode("Show"));
    textParent.appendChild(show);
    
    // /
    textParent.appendChild(document.createTextNode(" / "));
    
    // link 2: hide
    var hide = document.createElement("a");
    hide.href = "javascript:";
    hide.setAttribute("onclick", "showComments(this.parentNode.parentNode, false);");
    hide.onclick = "showComments(this.parentNode.parentNode, false);";
    hide.appendChild(document.createTextNode("Hide"));
    textParent.appendChild(hide);
    
    // comments
    textParent.appendChild(document.createTextNode(" comments"));
    
    // credits
    var credits = document.createElement("font");
    credits.appendChild(document.createTextNode("?"));
    credits.className = "tooltip";
    credits.style = "float: right; position: relative; bottom: 32px; font-size: 24px;";
    credits.setAttribute("title", "Code Highlighting - Rainbow by Craig Campbell (http://rainbowco.de/)\n(See Main page for link)");
    // click support because why not
    credits.onclick = "alert(\"" + credits.getAttribute("title").replace("\n", "\\n") + "\");";
    credits.setAttribute("onclick", "alert(\"" + credits.getAttribute("title").replace("\n", "\\n") + "\");");
    textParent.appendChild(credits);
    
    pre[i].insertBefore(textParent, pre[i].childNodes[0]);
    pre[i].insertBefore(document.createElement("br"), pre[i].childNodes[1]);
};

// show or hide comments
function showComments(node, show) {
    for (var h = 0; h < node.getElementsByTagName("code").length; h++) {
        // find the <code> object
        var code = node.getElementsByTagName("code")[h];
        
        // loop through every comment
        var comments = code.getElementsByClassName("comment");
        
        for (var i = 0; i < comments.length; i++) {
            // fade in or out
            if (show == true)
                comments[i].style.animation = "fade-in 1s ease-in-out forwards";
            else
                comments[i].style.animation = "fade 1s -500ms linear forwards";
        };
    };
};

/////////////////////////////////////////
// on page load: load the page "index" //
/////////////////////////////////////////
document.getElementById("jserror").parentNode.removeChild(document.getElementById("jserror"));

// redirects from pages like "index.html#learn_lua" to "index.html"
function redirectUrl() {window.location = window.location.toString().split("/index.html")[0] + "/index.html";};

// if the document name has an anchor, pass it to loadPage
if (window.location.toString().split("/index.html")[1] != "") {
    loadPage(window.location.toString().split("/index.html")[1].split("#")[1]);
    redirectUrl();
};
