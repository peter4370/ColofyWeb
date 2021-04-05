$(document).ready(function () {
    $('#button-profilebg').click(function () {
        ourAlert('請選擇大小為1375*500的圖片<br>或相同比例大小的圖片');
        $("#update-profilebg").trigger('click');
    })
    $('#button-profilepic').click(function () {
        ourAlert('請選擇大小為250*250的圖片<br>或相同比例大小的圖片');
        $("#update-profilepic").trigger('click');
    })
    var updateProfileBg = document.getElementById('update-profilebg');
    var updateProfilePic = document.getElementById('update-profilepic');
    var newProfileBg = document.getElementById('profilebg');
    var newProfilePic = document.getElementById('profilepic');
    // 監聽change事件:
    updateProfileBg.addEventListener('change', function () {
        // 清除背景圖片:
        newProfileBg.style.backgroundImage = '';
        // 檢查檔案是否選擇:
        if (!updateProfileBg.value) {
            ourAlert('沒有選擇檔案');
            return;
        }
        // 獲取File引用:
        var file = updateProfileBg.files[0];
        // 獲取File資訊:
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            ourAlert('不是有效的圖片檔案!');
            return;
        }
        // 讀取檔案:
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            newProfileBg.style.backgroundImage = 'url(' + data + ')';
        };
        // 以DataURL的形式讀取檔案:
        reader.readAsDataURL(file);
    });
    updateProfilePic.addEventListener('change', function () {
        // 清除背景圖片:
        newProfilePic.style.backgroundImage = '';
        // 檢查檔案是否選擇:
        if (!updateProfilePic.value) {
            ourAlert('沒有選擇檔案');
            return;
        }
        // 獲取File引用:
        var file = updateProfilePic.files[0];
        // 獲取File資訊:
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            ourAlert('不是有效的圖片檔案!');
            return;
        }
        // 讀取檔案:
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            newProfilePic.style.backgroundImage = 'url(' + data + ')';
        };
        // 以DataURL的形式讀取檔案:
        reader.readAsDataURL(file);
    });
    var $addFriend = $("#addfriend");
    var $editProfile = $("#editprofile");
    $addFriend.click(function () {
        $addFriend.text("處理中");
    });
    $editProfile.click(function () {
        if ($editProfile.text() == "編輯完成") {
            $editProfile.text("編輯個人檔案");
        } else {
            $editProfile.text("編輯完成");
        }
    });
    //profile and profile/123 maybe can use same code
    var readURL = /profile\/(\w+)/;//TODO:move these two line down
    var searchResult = window.location.pathname.match(readURL);
    //if (searchResult != null) {
    var profileRequest = $.ajax({
        url: "/api" + window.location.pathname, type: "GET", headers: { "Authorization": window.localStorage.getItem("Authorization") },
        success: function () {
            var userData = {//template only
                cover_pic_url: null, intro: "毫無反應 只是個模板人",
                profile_pic_url: null, username: "模板 人"
            };
            userData = profileRequest.responseJSON;
            $(".username").html(userData.username);
            $("#intro").html(userData.intro);
            $("#profilebg").css("background-image", "url(/img/profile/cover-pic/" + userData.cover_pic_url + ")");
            $("#profilepic").css("background-image", "url(/img/profile/profile-pic/" + userData.profile_pic_url + ")");



        },//end success
        error: function () {
            var message = "server no response";
            if (typeof profileRequest.responseJSON !== "undefined") {
                if (typeof profileRequest.responseJSON.message !== "undefined")
                    message = profileRequest.responseJSON.message;
                if (typeof profileRequest.responseJSON.error !== "undefined")
                    message = profileRequest.responseJSON.error;
            }
            ourAlert("找無人:" + message);
            window.location.pathname = "/";
        },//end error
    });//end ajax
    //}//end if link is profile/123
    //else {//link is profile

    var urlAffix = "";
    if (searchResult != null)
        urlAffix = "/" + searchResult[1];
    var $getPics = $.ajax({
        headers: { "Authorization": window.localStorage.getItem("Authorization") },
        url: "/api/photos" + urlAffix, type: "GET",
        success: function () {
            $.each($getPics.responseJSON, function () {
                var $pic = $('<div class="photos" style="height:300px"> <a href="#"> <img class="Images"> </a></div>');
                $pic.find("img").attr('src', "/img/upload/" + this.FileName);
                $(".p-container").append($pic);
            });//end each
        },//end success
        error: function () {
            var message = "server no response";
            if (typeof $getPics.responseJSON !== "undefined") {
                if (typeof $getPics.responseJSON.message !== "undefined")
                    message = $getPics.responseJSON.message;
                if (typeof $getPics.responseJSON.error !== "undefined")
                    message = $getPics.responseJSON.error;
                ourAlert(message);
            }
        },//end error
    });//end getPics ajax

    var $getAlbums = $.ajax({
        headers: { "Authorization": window.localStorage.getItem("Authorization") },
        url: "/api/albums" + urlAffix, type: "GET",
        success: function () {
            //TODO replace album
        },//end success
        error: function () {
            var message = "server no response";
            if (typeof $getAlbums.responseJSON !== "undefined") {
                if (typeof $getAlbums.responseJSON.message !== "undefined")
                    message = $getAlbums.responseJSON.message;
                if (typeof $getAlbums.responseJSON.error !== "undefined")
                    message = $getAlbums.responseJSON.error;
                ourAlert(message);
            }
        },//end error

    })
    //}
});