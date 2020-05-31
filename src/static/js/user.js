function initLazy() {
    new LazyLoad({
        elements_selector: ".lazy"
    });
}

initLazy();

function sortData(data) {
    let marv = [], perf = [], great = [], good = [], okay = [], miss = [];
    $.each(data, function (key, value) {
        let absVal = Math.abs(value);
        if (value == -2147483648) miss.push({x: key, y: 0});
        else if (absVal <= 18) marv.push({x: key, y: value});
        else if (absVal <= 43) perf.push({x: key, y: value});
        else if (absVal <= 76) great.push({x: key, y: value});
        else if (absVal <= 106) good.push({x: key, y: value});
        else if (absVal <= 127) okay.push({x: key, y: value});
        else if (absVal <= 164) miss.push({x: key, y: value});
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
    ]};
}

function loadChart(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss) {
    $.ajax({
        type: 'GET',
        url: apiBaseUrl() + `/v1/scores/data/${score_id}`,
        success: function (response) {
            loadScatter(table_class, score_id, response.hits);
            loadJudgements(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss);
        }
    })
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
    let chartJudgements = document.getElementsByClassName('chartScore_' + table_class + '_' + score_id)[0];

    Highcharts.chart({
        chart: {renderTo: chartJudgements, animation: false, backgroundColor: 'transparent', type: "column", spacingTop: 20},
        rangeSelector: {enabled: false},
        navigator: {enabled: false},
        credits: {enabled: false},
        title: {text: null},
        xAxis: {
            visible: true,
            categories: ["Marvelous", "Perfect", "Great", "Good", "Okay", "Miss"],
            lineColor: "#1a1a1a"
        },
        yAxis: {
            visible: true,
            gridLineWidth: 1,
            gridLineColor: "#202020",
            title: {text: null},
            minTickInterval: 100,
            tickAmount: 6
        },
        scrollbar: {enabled: false},
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    formatter:function() {
                        return '<tspan style="color:' + this.point.color + '; text-shadow: 0px 0px 4px black">' + this.point.y + '</tspan>';
                    },
                    style: {
                        color: "",
                        fontWeight: "",
                        textOutline: ""
                    },
                    crop: false,
                    overflow: "allow",
                    y: 0
                }
            },
            series: {
                enableMouseTracking: false,
                animation: {duration: 0},
                lineWidth: 0,
                tooltip: {valueDecimals: 2},
                states: {
                    hover: {lineWidthPlus: 0}
                }
            }
        },
        legend: {enabled: false},
        colors: ['#FBFFB6', '#F2C94C', '#56FE6E', '#0FBAE5', '#EE5FAC', '#F9645D'],
        series: [
            {
                name: "Marv",
                colorByPoint: true,
                borderColor: null,
                pointWidth: 50,
                data: [
                    ["Marv", total_marv],
                    ["Perf", total_perf],
                    ["Great", total_great],
                    ["Good", total_good],
                    ["Okay", total_okay],
                    ["Miss", total_miss],
                ]
            }
        ]
    });
}