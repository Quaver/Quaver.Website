function sortData(data) {
    let marv = [], perf = [], great = [], good = [], okay = [], miss = [];
    $.each(data, function (key, value) {
        let absVal = value;
        let flag = 1;

        if(absVal.endsWith('L')) flag = 1.5;

        absVal = absVal.split('L')[0];
        absVal = Math.abs(absVal);
        console.log(value, absVal)

        if (value === -2147483648) miss.push({x: key, y: 0});
        else if (absVal <= 18 * flag) marv.push({x: key, y: value});
        else if (absVal <= 43 * flag) perf.push({x: key, y: value});
        else if (absVal <= 76 * flag) great.push({x: key, y: value});
        else if (absVal <= 106 * flag) good.push({x: key, y: value});
        else if (absVal <= 127 * flag) okay.push({x: key, y: value});
        else if (absVal <= 164 * flag) miss.push({x: key, y: value});
        else if (absVal > 0) miss.push({x: key, y: 0});
        else miss.push({x: key, y: value});
    });

    return {
        datasets: [
            {
                pointRadius: 1,
                label: 'Marv',
                borderColor: '#FBFFB6',
                backgroundColor: '#FBFFB6',
                data: marv
            },
            {
                pointRadius: 1,
                label: 'Perf',
                borderColor: '#F2C94C',
                backgroundColor: '#F2C94C',
                data: perf
            },
            {
                pointRadius: 1,
                label: 'Great',
                borderColor: '#56FE6E',
                backgroundColor: '#56FE6E',
                data: great
            },
            {
                pointRadius: 1,
                label: 'Good',
                borderColor: '#0FBAE5',
                backgroundColor: '#0FBAE5',
                data: good
            },
            {
                pointRadius: 1,
                label: 'Okay',
                borderColor: '#EE5FAC',
                backgroundColor: '#EE5FAC',
                data: okay
            },
            {
                pointRadius: 1,
                label: 'Miss',
                borderColor: '#F9645D',
                backgroundColor: '#F9645D',
                data: miss
            }
        ]
    };
}

let cached = [];

function loadChart(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss) {
    if (cached.includes(score_id)) {

    } else {
        cached.push(score_id);
        $.ajax({
            type: 'GET',
            url: apiBaseUrl() + `/v1/scores/data/${score_id}`,
            success: function (response) {
                loadScatter(table_class, score_id, response.hits);
                loadJudgements(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss);
            }
        });
    }
}

function loadScatter(table_class, score_id, data) {
    let sc = document.getElementsByClassName('scatterScore_' + table_class + '_' + score_id)[0];

    new Chart(sc, {
        type: 'scatter',
        data: sortData(data),
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10
                }
            },
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: true
                    },
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 3,
                        min: -164,
                        max: 164,
                        beginAtZero: true,
                        display: true
                    }
                }]
            }
        }
    });
}

function loadJudgements(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss) {
    let jc = document.getElementsByClassName('chartScore_' + table_class + '_' + score_id)[0];

    new Chart(jc, {
        type: 'bar',
        data: {
            labels: ['Marv', 'Perf', 'Great', 'Good', 'Okay', 'Miss'],
            datasets: [{
                label: '',
                borderColor: 'rgb(255, 99, 132)',
                data: [
                    total_marv,
                    total_perf,
                    total_great,
                    total_good,
                    total_okay,
                    total_miss,
                ],
                backgroundColor: [
                    '#FBFFB6',
                    '#F2C94C',
                    '#56FE6E',
                    '#0FBAE5',
                    '#EE5FAC',
                    '#F9645D'
                ],
            }],
        },
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10
                }
            },
            // plugins: {
            //     datalabels: {
            //         display: true,
            //         align: 'end',
            //         anchor: 'end',
            //         offset: '0',
            //         color: [
            //             '#FBFFB6',
            //             '#F2C94C',
            //             '#56FE6E',
            //             '#0FBAE5',
            //             '#EE5FAC',
            //             '#F9645D'
            //         ],
            //         textShadowColor: 'black',
            //         textShadowBlur: 4
            //         // color: '#CACACA'
            //     }
            // },
            responsive: true,
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    $('#friend_add').submit(function (e) {
        e.preventDefault();
        const id = $(this).find('input[name=id]').val();
        const type = $(this).find('input[name=type]').val();
        if (id) {
            $.post(baseUrl() + '/friend/add', {
                id: id
            }, function (data) {
                $.post(baseUrl() + '/friend/render', {
                    id: id,
                    type: type
                }, function (data) {
                    $('#friend').html(data);
                });
            });
        }
    });
});