window.onscroll = function() { handleScroll(); };

function handleScroll() {
    if (document.body.scrollTop > 1710)
        document.getElementById("scrollbtn").className = "anchor";
    else
        document.getElementById("scrollbtn").className = "";
};
