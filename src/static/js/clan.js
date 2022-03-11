let cached = [];

function judgementBreakdown() {
    let jb = document.getElementById('chartJudgements');
    const colors = ['#FBFFB6', '#F2C94C', '#56FE6E', '#0FBAE5', '#EE5FAC', '#F9645D'];

    let options = {
        series: [{
            name: "Total",
            data: [6, 5, 4, 3, 2, 1]
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

// Fetch rank progression
function fetchRankProgression(userId, mode) {
    $.ajax({
        type: 'GET',
        url: apiBaseUrl() + `/v1/users/graph/rank?id=${userId}&mode=${mode}`,
        success: function (response) {
            const chartRank = document.getElementById('rankProgression');
            let dataRank = [];

            for (let r of response.statistics) {
                dataRank.push([new Date(r.timestamp).getTime(), r.rank]);
            }

            const now = new Date();
            const firstDate = new Date(response.statistics[0].timestamp);

            dataRank.push([now.getTime(), currentRank]);

            let options = {
                series: [{
                    name: "Rank",
                    data: dataRank
                }],
                chart: {
                    id: 'rankProgression',
                    type: 'area',
                    height: 350,
                    toolbar: {show: false},
                    zoom: {enabled: false},
                    animations: {enabled: false},
                    legend: {enabled: false, showForSingleSeries: false},
                    foreColor: '#fff',
                },
                grid: {show: false,},
                colors: ['#44D6F5'],
                stroke: {curve: 'smooth'},
                annotations: {
                    yaxis: [{
                        y: 30,
                        label: {show: false}
                    }],
                    xaxis: [{
                        x: firstDate.getTime(),
                        yAxisIndex: 0,
                        label: {show: false,}
                    }]
                },
                dataLabels: {enabled: false},
                markers: {size: 0,},
                xaxis: {
                    type: 'datetime',
                    min: firstDate.getTime(),
                    tooltip: {enabled: false},
                },
                yaxis: {reversed: true},
                tooltip: {
                    x: {format: 'dd MMM yyyy'},
                    y: {
                        formatter: (value) => {
                            return value
                        },
                    },
                },
                fill: {
                    type: 'solid',
                    opacity: 0,
                },
            };

            let chart = new ApexCharts(chartRank, options);
            chart.render();
        }
    });
}

document.addEventListener("DOMContentLoaded", function (event) {
    judgementBreakdown();
});