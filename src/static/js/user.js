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

function rankProgression() {
    let chartRank = document.getElementById('rankProgression');

    let dataLabels = rank.map(x => x.timestamp);
    let dataStats = rank.map(x => x.rank);

    dataLabels.pop();
    dataStats.pop();

    const now = moment();

    dataLabels.push("Now");
    dataStats.push(currentRank);

    // dataLabels = [];
    // dataStats = [];
    // for(let i = 90; i > 0; i--) {
    //     dataStats.push(Math.floor(Math.random() * 9000));
    //     dataLabels.push(i);
    // }
    // dataLabels.push("Now");

    const min = Math.min(...dataStats);
    const max = Math.max(...dataStats);

    let spread = 10;

    if(dataStats.length < 10) {
        spread = 2;
    }

    new Chart(chartRank, {
        type: 'line',
        data: {
            labels: dataLabels,
            datasets: [{
                pointBackgroundColor: 'rgba(15, 186, 229, 1)',
                borderColor: '#0FBAE5',
                backgroundColor: 'rgba(15, 186, 229, 0.4)',
                data: dataStats,
                fill: "start"
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 1,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        reverse: true,
                        fontColor: 'rgb(255,255,255)',
                        beginAtZero: false,
                        suggestedMin: min,
                        suggestedMax: max,
                        precision: 0
                    },
                    gridLines: {
                        display: false,
                        color: 'rgb(255,255,255)',
                        lineWidth: 0.5
                    }
                }],
                xAxes: [{
                    ticks: {
                        callback: function (tick, index, array) {
                            if (tick !== "Now") {
                                const date = moment(tick);
                                const days = now.diff(date, "days");
                                return index % spread ? null : days + " days ago";
                            } else {
                                return "Now";
                            }
                        },
                        maxRotation: 0,
                        minRotation: 0
                    },
                    gridLines: {
                        display: false,
                        color: 'rgb(255,255,255)',
                        lineWidth: 0.5
                    }
                }]
            },
            tooltips: {
                displayColors: false,
                custom: function (tooltip) {
                    if (!tooltip) return;
                },
                callbacks: {
                    title: function (tooltipItem, data) {
                        return "Global rank: " + tooltipItem[0].value;
                    },
                    label: function (tooltipItem, data) {
                        if (tooltipItem.xLabel !== "Now") {
                            const date = moment(tooltipItem.xLabel).calendar();
                            return "Date: " + date;
                        }

                        return tooltipItem.xLabel;
                    }
                }
            },
        }
    });
}


document.addEventListener("DOMContentLoaded", function (event) {
    rankProgression();
});