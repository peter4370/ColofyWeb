$(document).ready(function () {
    var $setArea = $('.scrEvent');
    var $link = $("#link");
    var $InviteButton = $("#InviteButton");
    var showHeight = 200;
    $setArea.css({ display: 'block', opacity: '0' });
    $(window).on('load scroll resize', function () {
        $setArea.each(function () {
            var $setThis = $(this);
            var areaTop = $setThis.offset().top;
            if ($(window).scrollTop() > (areaTop + showHeight) - $(window).height()) {
                $setThis.stop().animate({ opacity: '1' }, 500);
            } else {
                $setThis.stop().animate({ opacity: '0' }, 500);
            }
        });
    });
    $link.val(window.location.href);//display link
    $InviteButton.click(function (evt) {//copy Link
        evt.preventDefault();
        $link.select();
        document.execCommand("Copy");
    });//end invite click
})