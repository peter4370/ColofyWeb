//把登入按鈕換成登出
$(document).ready(function () {
    var $loginA = $("#login>a");
    if (window.localStorage.getItem("Authorization") != null) {
        $loginA.html("登出");//TODO: update it due to login state
        $loginA.click(function () {
            window.localStorage.removeItem("Authorization");
        });
    }
    else {
        $("#navUpload").hide();
        $("#navProfile").hide();
    }
})