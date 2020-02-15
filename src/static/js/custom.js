$(document).ready(function () {
    if (window.location.hash) {
        $('html,body').animate({
            scrollTop: $(window.location.hash).offset().top - 50
        }, 400, 'swing');
    }
});

( function( $ ) {
    $( 'a[href="#"]' ).click( function(e) {
        e.preventDefault();
    } );
} )( jQuery );

$(window).on('hashchange', function (event) {
    event.preventDefault();
    $('html,body').animate({
        scrollTop: $(window.location.hash).offset().top - 50
    }, 400, 'swing');
});