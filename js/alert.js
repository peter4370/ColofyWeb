//提供類似alert的function
function ourAlert(message) {
    var $alert = $('\
    <div id = "alertWindow" style = "display: block;" >\
        <p>'+ message +'</p>\
        <input type="button" value="好">\
    </div>');

    $('body').append($alert);

    $("#alertWindow>input").click(function () {
        $(this).parent().remove();
    });
}