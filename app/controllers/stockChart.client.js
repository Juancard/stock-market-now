'use strict';

(function () {

  let urlHistoricData = appUrl + '/api/stock/get_historical/',
      urlCompanyData = appUrl + '/api/stock/company';

  let sectionCompanies = document.getElementById("companies");
  let companiesSymbol = getCompaniesSymbol(sectionCompanies);

  let btnAddCompany = document.getElementById('btnAdd');
  btnAddCompany.addEventListener('click', addCompany);
  let inputAddCompany = document.getElementById('toAdd');

  let chart;

  ajaxFunctions.ready(() => {

    chart = createChart();

    companiesSymbol.forEach((companySymbol, i) => {
      let url = urlHistoricData + companySymbol;
      ajaxFunctions.ajaxRequest('GET', url, null, (data) => {
        data = JSON.parse(data);
        addHistoricalToChart(chart, companiesSymbol, data);
      });
    });

  });

  function addCompany(event){
    event.preventDefault();
    let companySymbol = inputAddCompany.value;
    if (!companySymbol) return;
    let urlThisCompany = urlCompanyData + '/' + companySymbol;
    ajaxFunctions.ajaxRequest('GET', urlThisCompany, null, (data) => {
      data = JSON.parse(data);
      if (data.length == 0)
        return alert("Error: not existing stock code");
      let company = data[0];
      let urlThisHistorical = urlHistoricData + company.Symbol;
      urlThisCompany = urlCompanyData + '/' + company.Symbol;
      ajaxFunctions.ajaxRequest('GET', urlThisHistorical, null, (data) => {
        data = JSON.parse(data);
        addHistoricalToChart(chart, companySymbol, data);
      })
      ajaxFunctions.ajaxRequest('POST', urlThisCompany, {company}, (data) => {
        data = JSON.parse(data);
        addCompanyElement(sectionCompanies, data);
      })
    });
  }

  function addHistoricalToChart(chart, companySymbol, historical){
    chart.addSeries(makeSeries(companySymbol, historical), true);
  }

  function addCompanyElement(element, company){
    element.appendChild(createCompanyElement(company));
  }

  function makeSeries(companySymbol, data) {
    let ohlcData = getOhlcData(data);

    // set the allowed units for data grouping
    let groupingUnits = [[
      'week',                         // unit name
      [1]                             // allowed multiples
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]];

    return {
      name: companySymbol,
      data: ohlcData,
      dataGrouping: {
        units: groupingUnits
      }
    };
  }

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

  function createChart() {

    return new Highcharts.stockChart('stockChart', {

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

      series: []
    });
  }

  function getCompaniesSymbol(elementContainer){
    let elementCompanies = elementContainer.childNodes;
    let companiesSymbol = [];
    for (let i=0; i<elementCompanies.length; i++){
      companiesSymbol.push(elementCompanies[i].id);
    }
    return companiesSymbol;
  }

})();
