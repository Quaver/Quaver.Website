function submitForm() {
    $('#maps_search input').each(function () {
        const input = $(this);
        if (input.val() === "") {
            input.prop('disabled', true);
        }
    });
    $('form').submit();
}

function initLazy() {
    new LazyLoad({
        elements_selector: ".lazy"
    });
    $('[data-toggle="tooltip"]').tooltip();
}

initLazy();

let page = 1;

document.addEventListener("DOMContentLoaded", function (event) {
    $('#searchMap').on('click', function (e) {
        e.preventDefault();
        submitForm();
    });

    $('#filters input').on('keypress', function (e) {
        if(e.keyCode === 13) {
            e.preventDefault();
            submitForm();
        }
    });

    $('#more').on('click', function () {
        query['page'] = page;
        $.post(baseUrl() + '/maps/load', query ,function(data) {
            $(data).appendTo("#maps");
            initLazy();
        });
        page += 1;
    });

    $('input[type=checkbox]').change(function() {
        submitForm();
    });
});