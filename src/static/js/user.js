function sortData(data) {
    let marv = [], perf = [], great = [], good = [], okay = [], miss = [];
    $.each(data, function (key, value) {
        if (value.endsWith('L')) value = parseInt(value) / 1.5;
        value = parseInt(value);
        const absValue = Math.abs(value);
        if (absValue === -2147483648) miss.push({x: key, y: 0});
        else if (absValue <= 18) marv.push({x: key, y: value});
        else if (absValue <= 43) perf.push({x: key, y: value});
        else if (absValue <= 76) great.push({x: key, y: value});
        else if (absValue <= 106) good.push({x: key, y: value});
        else if (absValue <= 127) okay.push({x: key, y: value});
        else if (absValue <= 164) miss.push({x: key, y: value});
        else if (absValue > 0) miss.push({x: key, y: 0});
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

function judgementBreakdown() {
    let jb = document.getElementById('chartJudgements');

    const colors = ['#FBFFB6', '#F2C94C', '#56FE6E', '#0FBAE5', '#EE5FAC', '#F9645D'];

    let options = {
        series: [{
            name: "Total",
            data: [stats.total_marv, stats.total_perf, stats.total_great, stats.total_good, stats.total_okay, stats.total_miss]
        }],
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            legend: {
                enabled: false,
                showForSingleSeries: false,
            },
            foreColor: '#fff'
        },
        colors: colors,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            },
            offsetY: -20
        },
        legend: {
            show: false
        },
        annotations: {
            yaxis: [{
                label: {
                    show: false
                }
            }],
            xaxis: [{
                label: {
                    show: false,
                }
            }]
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value.toLocaleString();
                }
            },
        },
        grid: {
            show: false,
        },
        xaxis: {
            categories: ['Marvelous', 'Perfect', 'Great', 'Good', 'Okay', 'Miss'],
            labels: {
                style: {
                    colors: colors,
                    fontSize: '12px'
                }
            }
        }
    };

    let chart = new ApexCharts(jb, options);
    chart.render();
}

function rankProgression() {
    let chartRank = document.getElementById('rankProgression');

    let dataRank = [];

    for(let r of rank) {
        dataRank.push([new Date(r.timestamp).getTime(), r.rank]);
    }

    const now = new Date();
    const firstDate = new Date(rank[0].timestamp);

    dataRank.push([now.getTime(), currentRank]);

    let options = {
        series: [{
            name: "Rank",
            data: dataRank,
            color: "rgba(15, 186, 229, 0.4)",
            gradient: {
                shade: "dark"
            }
        }],
        chart: {
            id: 'rankProgression',
            type: 'area',
            height: 350,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },
            legend: {
                enabled: false,
                showForSingleSeries: false,
            },
            foreColor: '#fff'
        },
        grid: {
            show: false,
        },
        annotations: {
            yaxis: [{
                y: 30,
                label: {
                    show: false
                }
            }],
            xaxis: [{
                x: firstDate.getTime(),
                yAxisIndex: 0,
                label: {
                    show: false,
                }
            }]
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            min: firstDate.getTime(),
            tooltip: {
                enabled: false
            },
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            },
            y: {
                formatter: (value) => { return value },
            },
        },
        fill: {
            type: 'solid'
        },
    };

    let chart = new ApexCharts(chartRank, options);
    chart.render();
}

function copyToClipboard(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text().trim()).select();
    document.execCommand("copy");
    $temp.remove();
}

document.addEventListener("DOMContentLoaded", function (event) {
    rankProgression();
    judgementBreakdown();
});