'use strict';

(function () {

  let seriesOptions = [],
      seriesCounter = 0,
      names = ['MSFT', 'AAPL', 'GOOG'];
  let urlHistoricData = appUrl + '/api/stock/get_historical/',
      urlCompanyData = appUrl + '/api/stock/get_company/';

  let chart;

  function createChart() {

    chart = new Highcharts.stockChart('container', {

      rangeSelector: {
        selected: 4
      },

      title: {
        text: 'Historical Price'
      },

      yAxis: {
        labels: {
            formatter: function () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
          },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },

      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },

      series: seriesOptions
    });
  }

  ajaxFunctions.ready(() => {

    names.forEach((name, i) => {
      let url = urlHistoricData + name;
      ajaxFunctions.ajaxRequest('GET', url, null, (data) => {

        data = JSON.parse(data);

        let ohlcData = getOhlcData(data);

        // set the allowed units for data grouping
        var groupingUnits = [[
          'week',                         // unit name
          [1]                             // allowed multiples
        ], [
          'month',
          [1, 2, 3, 4, 6]
        ]];

        seriesOptions[i] = {
          name: name,
          data: ohlcData,
          dataGrouping: {
            units: groupingUnits
          }
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
          createChart();
        }
      });
    });
  });

  function getOhlcData(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];

    if (elements[0]){

        for (var i = 0, datLen = dates.length; i < datLen; i++) {
            var dat = fixDate( dates[i] );
            var pointData = [
                dat,
                elements[0].DataSeries['close'].values[i]
            ];
            chartSeries.push( pointData );
        };
    }
    return chartSeries;
  }
  function fixDate(dateIn) {
      var dat = new Date(dateIn);
      return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
  };
})();
