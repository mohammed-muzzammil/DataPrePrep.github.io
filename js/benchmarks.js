$( document ).ready(function() {
    var results = {};
    var labels = [];
    var benchmarks = [];
    var orms = [];
    var charts = {};

    $.getJSON('/js/results.json', function (data) {
        for (var py in data) {
            if (labels.indexOf(py) === -1) {
                labels.push(py);
            }

            if (benchmarks.length === 0) {
                for (var benchmark in data[py]) {
                    benchmarks.push(benchmark);
                }
            }
        }

        benchmarks.forEach (function (benchmark) {
            var replacement = benchmark.replace(/_/g, '-')
            results[replacement] = {};

            labels.forEach(function (label) {
                var result = data[label][benchmark];

                for (var orm in result) {
                    if (orms.indexOf(orm) === -1) {
                        orms.push(orm);
                    }

                    if (results[replacement][orm] === undefined) {
                        results[replacement][orm] = [];
                    }

                    results[replacement][orm].push(result[orm]);
                }
            });
        });

        labels = labels.map(function (label) {
            label = 'Python ' + label;

            return label;
        });

        for (var benchmark in results) {
            var benchmarkResults = results[benchmark];

            var series = [];
            var i = 0;
            for (var o in benchmarkResults) {
                series.push([]);

                for (var j in labels) {
                    series[i].push(benchmarkResults[o][j]);
                }

                i++;
            }

            var data = {
                labels: labels,
                series: series
            };

            if ($("#benchmark-" + benchmark).length > 0) {
                if (charts["#benchmark-" + benchmark] !== undefined) {
                    //
                } else {
                    var chart = new Chartist.Bar("#benchmark-" + benchmark, data, {
                        seriesBarDistance: 35,

                        plugins: [
                            Chartist.plugins.legend({
                                legendNames: orms,
                            })
                        ]
                    });

                    charts["#benchmark-" + benchmark] = chart;
                }
            }
        }
    });
});
