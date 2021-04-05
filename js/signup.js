var userdata;
$(document).ready(function () {
    var $isLogin = $(".islogin");
    var $textboxInput = $(".textbox input");
    var $loginBtn = $(".login-btn");
    var $signUpForm = $("#signUpForm");
    $isLogin.hide();
    $textboxInput.focusout(function () {
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
            $loginBtn.attr("disable", false);
            $loginBtn.addClass("active");
        } else {
            $loginBtn.attr("disable", true);
            $loginBtn.removeClass("active");
        }
    });
    $signUpForm.submit(function (evt) {
        evt.preventDefault();
        $textboxInput.focusout();


        var isAllFilled = true;//check if all boxes are filled
        $textboxInput.siblings().each(function () {
            if ($(this).hasClass("hidden") == false)//at least one is empty
                isAllFilled = false;
        });

        var isChecked = $(".checked").css("display") == "block";//agree with our privacy policy
        if (isChecked == false) {
            //inform user to agree our policy
            ourAlert("請勾選 同意 Colorfy 的隱私權條款");
        }

        if (isChecked && isAllFilled) {//start send data
            userdata = {//collect userdata
                firstname: $("#firstName > input").val(),
                lastname: $("#lastName > input").val(),
                nickname: $("#nickName > input").val(),
                //birthday: $("#bday > input").val(), //bug
                account: $("#email > input").val(),
                password: $("#password > input").val()
            }
            var url = "/api/user";
            var $userRequest = $.ajax({
                url: url, data: JSON.stringify(userdata), contentType: "application/json", type: "POST",
                success: function () {
                    ourAlert("註冊成功 跳轉登入頁面…");
                    window.location.href = window.location.origin + "/login";
                },//end success
                error: function () {
                    var message = "Unknow Reason";
                    if (typeof $userRequest.responseJSON.message !== "undefined")
                        message = $userRequest.responseJSON.message;
                    if (typeof $userRequest.responseJSON.error !== "undefined")
                        message = $userRequest.responseJSON.error;
                    ourAlert("註冊失敗:" + message);
                },//end error
            });//end ajax
        }//end send data
    });//end submit
});//end ready