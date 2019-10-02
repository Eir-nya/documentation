// turns the button yellow or orange
function switchFontbt() {
    var fontbtn = document.getElementById("fontbt");
    
    fontbtn.setAttribute("src", "img/btn/fontbt_" + (1 - fontbtn.getAttribute("src")[15]).toString() + ".png");
};

// switches to the right font
function updateFont() {
    // first: see if the document's cookies already have an entry for which font to use
    var useAltFont = document.cookie.indexOf("switch=true") > -1;
    
    // then: switch the font based on the value just detected
    document.body.className = (useAltFont ? "altfont" : "");
    
    // last: set the document's cookie to track what font to use
    document.cookie = "switch=" + useAltFont.toString();
};

// switches fonts
function fontSwitch() {
    document.cookie = "switch=" + !(document.cookie.indexOf("switch=true") > -1);
    updateFont();
}

updateFont();
