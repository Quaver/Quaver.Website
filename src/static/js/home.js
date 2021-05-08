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
    const number = parseInt($this.text());

    if (number > 999999) {
        $this.text(abbreviateNumber(number));
    } else {
        jQuery({Counter: 0}).animate({Counter: parseInt($this.text())}, {
            duration: 1000,
            easing: 'swing',
            step: function () {
                if ($this.text() === 0) $this.text(0); else $this.text(Math.ceil(this.Counter).toLocaleString());
            },
            complete: function () {
                $this.text(number.toLocaleString())
            }
        });
    }
});

function abbreviateNumber(num, fixed = 0) {
    if (num === null) return null;
    if (num === 0) return '0';

    fixed = (!fixed || fixed < 0) ? 0 : fixed;

    let b = (num).toPrecision(2).split("e"),
        k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
        c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed),
        d = c < 0 ? c : Math.abs(c),
        e = d + ['', 'K', 'M', 'B', 'T'][k];

    return e;
}