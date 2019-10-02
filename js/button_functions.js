contentboxes = document.getElementsByClassName("contents");

for (var i = 0; i < contentboxes.length; i++) {
	var t1 = document.createTextNode("[");
	var t2 = document.createTextNode("]");
	var a = document.createElement("a");
	var t3 = document.createTextNode("hide");
	a.appendChild(t3);
	a.setAttribute("href", "javascript:;");
	a.setAttribute("onclick", "content_close(this.parentElement.parentElement.parentElement);");
	contentboxes[i].getElementsByClassName("toggle")[0].appendChild(t1);
	contentboxes[i].getElementsByClassName("toggle")[0].appendChild(a);
	contentboxes[i].getElementsByClassName("toggle")[0].appendChild(t2);
    
    // auto-hide the "sub" boxes inside of other boxes
    if (contentboxes[i].className.indexOf("sub") > -1) {
        var targets = contentboxes[i].getElementsByClassName("toggle")[0].getElementsByTagName("a");
        
        for (var j = 0; j < targets.length; j++) {
            if (targets[j].innerHTML == "hide")
                targets[j].click();
        };
    }
}

function content_close(contentbox) {
    var targets = contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a");
    
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].innerHTML == "hide") {
            targets[i].innerHTML = "show";
            targets[i].setAttribute("onclick", "content_open(this.parentElement.parentElement.parentElement);");
            var OL = contentbox.getElementsByTagName("OL")[0];
            OL.setAttribute("style", "display:none;");
        }
    };
    
    /*
	contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a")[0].innerHTML = "show";
	contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a")[0].setAttribute("onclick", "content_open(this.parentElement.parentElement.parentElement);");
	var OL = contentbox.getElementsByTagName("OL")[0];
	OL.setAttribute("style", "display:none;");
    */
};

function content_open(contentbox) {
    var targets = contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a");
    
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].innerHTML == "show") {
            targets[i].innerHTML = "hide";
            targets[i].setAttribute("onclick", "content_close(this.parentElement.parentElement.parentElement);");
            var OL = contentbox.getElementsByTagName("OL")[0];
            OL.setAttribute("style", "");
        }
    };
    
    /*
	contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a")[0].innerHTML = "hide";
	contentbox.getElementsByClassName("toggle")[0].getElementsByTagName("a")[0].setAttribute("onclick", "content_close(this.parentElement.parentElement.parentElement);");
	contentbox.getElementsByTagName("OL")[0].setAttribute("style", "");
    */
};