'use strict';

(function () {

  let urlHistoricData = appUrl + '/api/stock/get_historical/',
      urlCompanyData = appUrl + '/api/stock/company';

  let sectionCompanies = document.getElementById("companies");
  sectionCompanies.addEventListener('click', onSectionClick, false);
  let companiesSymbol = getCompaniesSymbol(sectionCompanies);

  let btnAddCompany = document.getElementById('btnAdd');
  btnAddCompany.addEventListener('click', sendAddCompany);
  let inputAddCompany = document.getElementById('toAdd');

  let chart;

  let socket = io();
  socket.on('company_added', (company, historicalData) => {
    addCompany(company, historicalData);
  });
  socket.on('company_removed', (company) => {
    removeCompany(company);
  });

  ajaxFunctions.ready(() => {

    chart = createChart();

    companiesSymbol.forEach((companySymbol, i) => {
      let url = urlHistoricData + companySymbol;
      ajaxFunctions.ajaxRequest('GET', url, null, (data) => {
        data = JSON.parse(data);
        addHistoricalToChart(chart, companySymbol, data);
      });
    });

  });

  function onSectionClick(e){
    let companySymbol;
    if (e.target && e.target.nodeName === "BUTTON") {
      companySymbol = e.target.parentNode.id;
    } else if (e.target && e.target.nodeName === "SPAN") {
      companySymbol = e.target.parentNode.parentNode.id;
    }
    removeCompany(companySymbol);
    e.stopPropagation();
  }

  function sendRemoveCompany(symbol){
    let urlThisCompany = urlCompanyData + '/' + symbol;
    if (sectionCompanies.childNodes.length <= 1) {
      return alert("Sorry: Chart has to have at least one company stock");
    }
    ajaxFunctions.ajaxRequest('DELETE', urlThisCompany, null, (data) => {
      data = JSON.parse(data);
      if (data) {
        if (data.error) return alert(data.message || data.error);
        removeCompany(data);
        socket.emit('company_removed', data);
      }
    })
  }

  function removeCompany(company){
    document.getElementById(company.symbol).outerHTML = "";
    chart.series.filter(s => s.name == company.symbol)[0].remove(true);
  }

  function sendAddCompany(event){
    event.preventDefault();

    // Get company to add from value in input
    let companySymbol = inputAddCompany.value;

    // If value in input is empty, do nothing
    if (!companySymbol) return;

    // Is it a valid company symbol?
    let urlThisCompany = urlCompanyData + '/' + companySymbol;
    ajaxFunctions.ajaxRequest('GET', urlThisCompany, null, (data) => {
      data = JSON.parse(data);

      // if no companies matches the symbol, error
      if (data.length == 0)
        return alert("Error: not existing stock code");

      // get first company that matches symbol
      let company = data[0];

      //company exists, but... is it already in chart?
      if (!isCompanyInChart(chart, company.Symbol)) {
        //company is not in chart. then:

        // add company data to db
        urlThisCompany = urlCompanyData + '/' + company.Symbol;
        ajaxFunctions.ajaxRequest('POST', urlThisCompany, {company}, (data) => {
          let newCompany = JSON.parse(data);

          // get historical stock data
          let urlThisHistorical = urlHistoricData + newCompany.symbol;
          ajaxFunctions.ajaxRequest('GET', urlThisHistorical, null, (data) => {
            let historicalData = JSON.parse(data);

            addCompany(newCompany, historicalData);
            socket.emit('company_added', newCompany, historicalData);
          })
        })
      }
    });
    function isCompanyInChart(chart, symbol){
      return chart.series.filter(s => s.name == symbol).length > 0;
    }
  }

  function addCompany(company, historicalData){
    addCompanyElement(sectionCompanies, company);
    addHistoricalToChart(chart, company.symbol, historicalData);
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
/*
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },*/

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
