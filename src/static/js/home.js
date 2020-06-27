let page = 0;
const tabs = $('.tab-pane');
let pages = tabs.length - 1;

$('.next-tab').on('click', function () {
    if (page !== pages) page += 1;

    $.each(tabs, function (key, value) {
        if ($(value).hasClass('show active')) {
            $(value).removeClass('show active');
            $(tabs[page]).addClass('show active');
            return false;
        }
    });
});

$('.previous-tab').on('click', function () {
    if (page !== 0) {
        page -= 1;

        $.each(tabs, function (key, value) {
            if ($(value).hasClass('show active')) {
                $(value).removeClass('show active');
                $(tabs[page]).addClass('show active');
                return false;
            }
        });
    }
});

$('.count').each(function () {
    const $this = $(this);
    jQuery({Counter: 0}).animate({Counter: parseInt($this.text())}, {
        duration: 1000,
        easing: 'swing',
        step: function () {
            if ($this.text() === 0) $this.text(0); else $this.text(Math.ceil(this.Counter).toLocaleString());
        }
    });
});