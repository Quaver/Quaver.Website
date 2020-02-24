$(document).ready(function () {
    if (window.location.hash) {
        $('html,body').animate({
            scrollTop: $(window.location.hash).offset().top - 140
        }, 400, 'swing');
    }
});

$(window).on('hashchange', function (event) {
    event.preventDefault();
    $('html,body').animate({
        scrollTop: $(window.location.hash).offset().top - 140
    }, 400, 'swing');
});
