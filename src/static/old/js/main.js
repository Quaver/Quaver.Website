$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

$('body').on('click', '.bio-edit', function () {
    $('#html-bio').toggle();
    $('#bbcode-bio').toggle();
});