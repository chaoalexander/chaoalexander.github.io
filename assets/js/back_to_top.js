window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById("back-to-top").style.display = "block";
    } else {
        document.getElementById("back-to-top").style.display = "none";
    }
};

document.getElementById("back-to-top").addEventListener("click", function() {
    // 计算滚动距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollStep = Math.PI / (500 / 15);
    var cosParameter = scrollTop / 2;
    var scrollCount = 0;
    var scrollMargin;
    var scrollInterval = setInterval(function() {
        if (document.documentElement.scrollTop !== 0) {
            scrollCount = scrollCount + 1;
            scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
            document.documentElement.scrollTop = document.body.scrollTop = scrollTop - scrollMargin;
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
});
