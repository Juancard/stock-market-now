'use strict';

let apiUrl = 'http://dev.markitondemand.com/MODApis/Api/v2';
let request = require('request');

function apiStockHandler () {
  this.getCompanyData = (companySymbol, callback) => {
    let url = apiUrl + '/Lookup/json?input=' + companySymbol;
    this.makeRequest(url, callback);
  },

  this.getHistorical = (companySymbol, days=3650, callback) => {
    let parameters = {
      "Normalized": false,
      "NumberOfDays": days,
      "DataPeriod": "Day",
      "Elements":[{
          "Symbol":companySymbol,
          "Type":"price",
          "Params":["ohlc"]
        },
      ]
    };
    let stringedParams = JSON.stringify(parameters);
    let urlHistorical = apiUrl + '/InteractiveChart/json?parameters=' + stringedParams;
    this.makeRequest(urlHistorical, callback);
  },

  this.makeRequest = (url, callback) => {
    request.get({
      url,
      json: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, res, body) => {
      return callback(err, res, body);
    });
  }
}

module.exports = apiStockHandler;
