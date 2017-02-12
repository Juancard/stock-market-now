'use strict';

module.exports = (app, appEnv) => {

  let ApiStockHandler = require(appEnv.path + '/app/controllers/apiStockHandler.server.js');
  let apiStockHandler = new ApiStockHandler();
  let CompanyHandler = require(appEnv.path + '/app/controllers/companyHandler.server.js');
  let companyHandler = new CompanyHandler();

  app.route('/')
		.get( (req, res) => {
      companyHandler.getCompanies((err, results) => {
        let out = {
          companies: (!err)? results : []
        }
        res.render(appEnv.path + '/app/views/index.pug', out);
      })
		});
  app.route('/api/stock/get_company/:symbol')
		.get( (req, res) => {
      let companySymbol = req.params.symbol;
      apiStockHandler.getCompanyData(companySymbol, (err, response, body) => {
        res.json(body);
      });
		});
  app.route('/api/stock/get_historical/:symbol')
		.get( (req, res) => {
      let companySymbol = req.params.symbol;
      let days = undefined;
      apiStockHandler.getHistorical(companySymbol, days, (err, response, body) => {
        res.json(body);
      });
		});
}
