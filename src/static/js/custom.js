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

const search = $('#search');
let searchHasResults = false;
let searchTimer = null;

search.on('keyup', function () {
    clearTimeout(searchTimer);
    let searchText = $(this).val().trim();

    if (searchText === "") {
        $('.searchBox').hide();
        return;
    }

    searchTimer = setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: siteLink() + `/v1/users/search/${searchText}`,
            success: function (response) {
                console.log(response);
                if (response.users.length !== 0) {
                    $('.searchBox').show();
                    searchHasResults = true;
                    // Reset results
                    $('.searchBox ul').html('');
                    response.users.forEach(function (user) {
                        $('.searchBox ul').append('<li class="list-group-item align-items-center">' +
                            '<a href="#">' +
                            `<img src="${user.avatar_url}" width="50px" height="50px">` +
                            `<b>${user.username}</b>` +
                            '</a>' +
                            '</li>');
                    })

                } else {
                    searchHasResults = false;
                }
            },
            error: function (err) {
                $('.searchBox').hide();
                searchHasResults = false;
            }
        });
    }, 300);
});

search.blur(function () {
    $('.searchBox').hide();
});

search.focus(function () {
    if (searchHasResults)
        $('.searchBox').show();
});

function durationParse(time) {
    if (time) {
        const now = new moment();
        const secondDiff = now.diff(new moment(time), "seconds");
        const minuteDiff = now.diff(new moment(time), "minutes");
        const hourDiff = now.diff(new moment(time), "hours");
        const dayDiff = now.diff(new moment(time), "days");
        const monthDiff = now.diff(new moment(time), "months");
        const yearDiff = now.diff(new moment(time), "years");

        if (yearDiff === 1)
            return `${yearDiff} year ago`;

        if (yearDiff > 1)
            return `${yearDiff} years ago`;

        if (monthDiff === 1)
            return `${monthDiff} month ago`;

        if (monthDiff > 1 && monthDiff < 12)
            return `${monthDiff} months ago`;

        if (dayDiff === 1)
            return `${dayDiff} day ago`;

        if (dayDiff > 1 && dayDiff < 31)
            return `${dayDiff} days ago`;

        if (hourDiff === 1)
            return `${hourDiff} hour ago`;

        if (hourDiff > 1 && hourDiff < 24)
            return `${hourDiff} hours ago`;

        if (minuteDiff === 1)
            return `${minuteDiff} minute ago`;

        if (minuteDiff >= 1 && minuteDiff < 60)
            return `${minuteDiff} minutes ago`;

        if (secondDiff === 1)
            return `${secondDiff} second ago`;

        if (secondDiff < 60)
            return `${secondDiff} seconds ago`;

        return "An eternity ago";
    }
}