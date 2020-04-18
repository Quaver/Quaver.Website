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

    return [{data: marv, name: "Marvelous"}, {data: perf, name: "Perfect"}, {data: great, name: "Great"}, {data: good, name: "Good"}, {data: okay, name: "Okay"}, {data: miss, name: "Miss"}];
}

function loadChart(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss) {
    loadScatter(table_class, score_id);
    loadJudgements(table_class, score_id, total_marv, total_perf, total_great, total_good, total_okay, total_miss);
}

function loadScatter(table_class, score_id) {
    let sc = document.getElementsByClassName('scatterScore_' + table_class + '_' + score_id)[0];

    Highcharts.getJSON(apiBaseUrl() + `/v1/scores/data/${score_id}`, function (data) {
        Highcharts.chart({
            chart: {renderTo: sc, animation: false, backgroundColor: 'transparent', draggableY: false, type: "scatter"},
            title: {text: null},
            rangeSelector: {enabled: false},
            navigator: {enabled: false},
            credits: {enabled: false},
            xAxis: {visible: false},
            yAxis: {
                height: 230,
                visible: true,
                gridLineWidth: 0,
                labels: {enabled: true},
                title: {text: null},
                tickPositions: [-164, 0, 164],
                plotBands: [
                    {
                        from: 164,
                        to: 127,
                        color: "rgba(249, 100, 93, 0.1)"
                    },
                    {
                        from: 127,
                        to: 106,
                        color: "rgba(238, 95, 172, 0.1)"
                    },
                    {
                        from: 106,
                        to: 76,
                        color: "rgba(15, 186, 229, 0.1)"
                    },
                    {
                        from: 76,
                        to: 43,
                        color: "rgba(86, 254, 110, 0.1)"
                    },
                    {
                        from: 43,
                        to: 18,
                        color: "rgba(242, 201, 76, 0.1)"
                    },
                    {
                        from: 18,
                        to: 0,
                        color: "rgba(251, 255, 182, 0.1)"
                    },
                    {
                        from: 0,
                        to: -18,
                        color: "rgba(251, 255, 182, 0.1)"
                    },
                    {
                        from: -18,
                        to: -43,
                        color: "rgba(242, 201, 76, 0.1)"
                    },
                    {
                        from: -43,
                        to: -76,
                        color: "rgba(86, 254, 110, 0.1)"
                    },
                    {
                        from: -76,
                        to: -106,
                        color: "rgba(15, 186, 229, 0.1)"
                    },
                    {
                        from: -106,
                        to: -127,
                        color: "rgba(238, 95, 172, 0.1)"
                    },
                    {
                        from: -127,
                        to: -164,
                        color: "rgba(249, 100, 93, 0.1)"
                    }
                ]
            },
            legend: {enabled: false},
            plotOptions: {
                series: {
                    enableMouseTracking: true,
                    animation: false,
                    lineWidth: 0,
                    marker: {
                        symbol: 'circle',
                        enabled: true,
                        radius: 1
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b> ms<br/>',
                        headerFormat: '<span style="font-size: 10px">{point.x}</span><br/>'
                    },
                    turboThreshold: data.hits.length,
                    states: {
                        hover: {lineWidthPlus: 0},
                        inactive: {enabled: false}
                    }
                }
            },
            colors: ['#FBFFB6', '#F2C94C', '#56FE6E', '#0FBAE5', '#EE5FAC', '#F9645D'],
            series: sortData(data.hits)
        });
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