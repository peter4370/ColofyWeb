//operating cookies
function setCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date;
}
function getCookie(name) {
    var reg = RegExp(name + "=([^;]+)");
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
}
function delCookie(name) {
    setCookie(name, null, -1);
}

$(document).ready(function () {
    var $isLogin = $(".islogin");
    var $textboxInput = $(".textbox input");
    var $loginBtn = $(".login-btn");
    $isLogin.hide();
    $textboxInput.focusout(function () { // 登入偵測 input 特效
        if ($(this).val() == "") {
            $(this).siblings().removeClass("hidden");
            $(this).css("border-left", "solid 10px #ee4e4e");
        } else {
            $(this).siblings().addClass("hidden");
            $(this).css("border-left", "solid 10px #4eee96");
        }
    });

    $textboxInput.keyup(function () {
        if ($textboxInput[0].value != "" && $textboxInput[1].value != "") {
            $loginBtn.attr("disabled", false);
            $loginBtn.addClass("active");
        } else {
            $loginBtn.attr("disabled", true);
            $loginBtn.removeClass("active");
        }
    });

    //get elements
    var $account = $("#account");
    var $password = $("#password");
    var $rememberMe = $(".remember-me input");
    var $loginForm = $("#loginForm");
    //if cookie has data then fill in
    if (getCookie('account') && getCookie('password')) {
        $account.val(getCookie('account'));
        $password.val(getCookie('password'));
    }
    $(".textbox input").keyup();//update login button after auto fill
    //remove cookie when user uncheck remember-me
    $rememberMe.change(function () {
        if (this.checked) {
            delCookie('account');
            delCookie('password');
        }
    });
    $loginForm.submit(function (evt) {
        evt.preventDefault();
        $textboxInput.focusout();

        var isAllFilled = $account.val() != "" &&
            $password.val() != "";//check if all boxes are filled

        if (isAllFilled) {//start send data
            //if remember-me then setCookie
            if ($rememberMe[0].checked) {
                setCookie('account', $account.val(), 7);
                setCookie('password', $password.val(), 7);
            }

            loginData = {//collect userdata
                account: $account.val(),
                password: $password.val(),
            }
            var url = "/api/login";
            var $loginRequest = $.ajax({
                url: url, data: JSON.stringify(loginData), contentType: "application/json", type: "POST",
                Authorization: "Bearer token",
                success: function () {
                    var loginResponse = JSON.parse($loginRequest.responseText)
                    localStorage.setItem("Authorization", "Bearer " + loginResponse.token);
                    window.location.assign("profile")
                },//end success
                error: function () {
                    var message = "Unknow Reason";
                    if (typeof $loginRequest.responseJSON !== "undefined")
                        if (typeof $loginRequest.responseJSON.message !== "undefined")
                            message = $loginRequest.responseJSON.message;
                    ourAlert("登入失敗:" + message)

                }//end error
            });//end ajax
            console.log($loginRequest);//remove later
            //TODO play logining animation
        }//end send data
    });

});