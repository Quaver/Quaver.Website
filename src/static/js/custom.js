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

let searchTimer = null;

document.addEventListener("DOMContentLoaded", function (event) {

    // Search
    const search = $('#search');
    const searchMobile = $('#search-mobile');
    let searchHasResults = false;
    let isHovering = false;

    search.on('keyup', function (e) {
        if(e.keyCode === 13) {
            window.location.href = baseUrl() + '/profile/' + $(this).val().trim();
        }
        searchUser($(this).val().trim());
    });

    searchMobile.on('keyup', function () {
        searchUser($(this).val().trim());
    });

    $('.searchBox').hover(function () {
        isHovering = true;
    }, function () {
        isHovering = false;
    });

    search.blur(function () {
        if (!isHovering)
            $('.searchBox').hide();
    });

    search.focus(function () {
        if (searchHasResults)
            $('.searchBox').show();
    });

    searchMobile.blur(function () {
        if (!isHovering)
            $('.searchBox').hide();
    });

    searchMobile.focus(function () {
        if (searchHasResults)
            $('.searchBox').show();
    });

});

function searchUser(searchText) {
    clearTimeout(searchTimer);

    if (searchText === "") {
        $('.searchBox').hide();
        return;
    }

    searchTimer = setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: apiBaseUrl() + `/v1/users/search/${searchText}`,
            success: function (response) {
                if (response.users.length !== 0) {
                    $('.searchBox').show();
                    searchHasResults = true;
                    // Reset results
                    $('.searchBox ul').html('');
                    response.users.forEach(function (user) {
                        $('.searchBox ul').append('<li class="list-group-item align-items-center">' +
                            `<a href="${baseUrl()}/user/${user.id}">` +
                            `<img src="${user.avatar_url}" width="50px" height="50px" onerror="this.src='/img/noavatar.jpg'">` +
                            `<b>${user.username}</b></a></li>`);
                    });
                } else {
                    searchHasResults = false;
                }
            },
            error: function () {
                $('.searchBox').hide();
                searchHasResults = false;
            }
        });
    }, 300);
}