$(document).ready(function () {
    //redirect not login user
    if (window.localStorage.getItem("Authorization") == null)
        window.location.pathname = "/";
    var $getAlbum = $.ajax({
        headers: { "Authorization": window.localStorage.getItem("Authorization") },
        type: "GET", url: "/api/albums",
        success: function () {
            var albumObj = $getAlbum.responseJSON;
            $.each(albumObj.album, function () {
                $selectAlbum.append('<option value = "' + this.ID + '"> ' + this.Title + '</option>');
            });//end each album
        },//end success
        error: function () {
            var message = "";
            if (typeof $uploadData.responseJSON != "undefined") {
                if (typeof $uploadData.responseJSON.message != "undefined")
                    message = $uploadData.responseJSON.message;
                if (typeof $uploadData.responseJSON.error != "undefined")
                    message = $uploadData.responseJSON.error;
            }
            ourAlert("相簿錯誤:" + message);
            console.log($uploadData);
        }
    });//end getAlbum

    var $file = $('input[name="upload"]');
    var $picName = $('input[name="picName"]');
    var $selectAlbum = $('select[name="album"]');
    //TODO:upload
    $("#uploadForm").submit(function (evt) {
        evt.preventDefault();
        if ($file.val() == "") {
            ourAlert("請選擇上傳的照片");
            return;
        }
        if ($picName.val() == "") {
            ourAlert("請填入相片名稱");
            return;
        }
        if ($selectAlbum.find(":selected").val() == "error") {
            ourAlert("請選擇相簿或創建相簿並選擇");
            return;
        }

        //pack img file into form data
        var file_data = $file.prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);

        //upload img only
        var $uploadImg = $.ajax({
            headers: { "Authorization": window.localStorage.getItem("Authorization") },
            url: "/upload",
            processData: false,
            contentType: false,
            data: form_data,
            type: "POST",
            success: function () {//server return a JSON with filename

                //return name intro album
                var picData = { filename: $uploadImg.responseJSON.filename, title: $picName.val(), intro: $('input[name="picIntro"]').val(), albumid: $selectAlbum.find(":selected").val() };
                var $uploadData = $.ajax({
                    headers: { "Authorization": window.localStorage.getItem("Authorization") },
                    url: "/api/photo",
                    type: "POST",
                    data: picData,
                    success: function () {
                        ourAlert("圖片上傳成功");
                        window.location.pathname = "/upload";
                    },
                    error: function () {
                        var message = "";
                        if (typeof $uploadData.responseJSON != "undefined") {
                            if (typeof $uploadData.responseJSON.message != "undefined")
                                message = $uploadData.responseJSON.message;
                            if (typeof $uploadData.responseJSON.error != "undefined")
                                message = $uploadData.responseJSON.error;
                        }
                        ourAlert("上傳錯誤:" + message);
                        console.log($uploadData);
                    }
                });//end uploadData ajax
            },
            error: function () {
                var message = "";
                if (typeof $uploadImg.responseJSON != "undefined") {
                    if (typeof $uploadImg.responseJSON.message != "undefined")
                        message = $uploadImg.responseJSON.message;
                    if (typeof $uploadImg.responseJSON.error != "undefined")
                        message = $uploadImg.responseJSON.error;
                }
                ourAlert("上傳錯誤:" + message);
                console.log($uploadImg);
            }

        });//end ajax
    });//end submit

    //open and close create album window
    $("input[name=newAlbum]").click(function () { $("#createAlbum").show(); });
    $("input[name=cancelCreateAlbum]").click(function () { $("#createAlbum").hide(); });
    
    $("#createAlbum>form").submit(function (evt) {
        evt.preventDefault();
        var $albumName = $('input[name="albumName"]');
        if ($albumName.val() == "") {
            ourAlert("請填入相簿名稱");
            return;
        }

        var albumData = { Title: $albumName.val(), Intro: $('input[name="albumIntro"]').val()};
        var $newAlbum = $.ajax({
            headers: { "Authorization": window.localStorage.getItem("Authorization") },
            url: "/api/album",
            data: albumData,
            type: "POST",
            success: function () {
                ourAlert("創建成功");
                $("input[name=cancelCreateAlbum]").click();//close div
                var newAlbum = $newAlbum.responseJSON;
                $selectAlbum.append('<option value = "' + newAlbum.ID + '"> ' + newAlbum.Title + '</option>');
                window.location.pathname = "/upload";
            },//end success
            error: function () {
                var message = "";
                if (typeof $newAlbum.responseJSON != "undefined") {
                    if (typeof $newAlbum.responseJSON.message != "undefined")
                        message = $newAlbum.responseJSON.message;
                    if (typeof $newAlbum.responseJSON.error != "undefined")
                        message = $newAlbum.responseJSON.error;
                    console.log($newAlbum);
                }
                ourAlert("創建錯誤:" + message);
            }
        });//end newAlbum
    });//end createAlbum


});//end ready