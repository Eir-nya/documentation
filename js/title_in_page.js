// write a "page"'s title
function writeTitle(title, location) {
    if (location == null) {
        document.write("<h1 style='padding-top:0px;padding-bottom:0px;margin-bottom:0px;'>");
        document.write(title);
        document.write("</h1>");
        document.write("<div class='separator'></div>");
    } else {
        var h1 = document.createElement("h1");
        h1.style = "padding-top: 0px; padding-bottom: 0px; margin-bottom: 0px;";
        h1.innerHTML = title;
        var separator = document.createElement("div");
        separator.className = "separator";
        location.appendChild(h1);
        location.appendChild(separator);
    };
};
