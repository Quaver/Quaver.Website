function submitForm() {
    $('#maps_search input').each(function () {
        const input = $(this);
        if (input.val() === "") {
            input.prop('disabled', true);
        }
    });
    $('form').submit();
}

let page = 1;

document.addEventListener("DOMContentLoaded", function (event) {
    $('#searchMap').on('click', function (e) {
        e.preventDefault();
        submitForm();
    });

    $('#filters input').on('keypress', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            submitForm();
        }
    });

    $('#more').on('click', function () {
        const q = Object.assign(query, {'page': page});
        $.post(baseUrl() + '/maps/load', q, function (data) {
            if (data.trim() === "") {
                $("#more").hide();
            } else {
                $(data).appendTo("#maps");
                initLazy();
            }
        });
        page += 1;
    });

    $('input[type=checkbox]').change(function () {
        submitForm();
    });
});