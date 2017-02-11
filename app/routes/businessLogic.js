'use strict';

module.exports = (app, appEnv) => {

  let StockHandler = require(appEnv.path + '/app/controllers/stockHandler.server.js');
  let stockHandler = new StockHandler();

  app.route('/')
		.get( (req, res) => {
			res.render(appEnv.path + '/app/views/index.pug');
		});
  app.route('/api/stock/get_company/:symbol')
		.get( (req, res) => {
      let companySymbol = req.params.symbol;
      stockHandler.getCompanyData(companySymbol, (err, response, body) => {
        res.json(body);
      });
		});
  app.route('/api/stock/get_historical/:symbol')
		.get( (req, res) => {
      let companySymbol = req.params.symbol;
      let days = undefined;
      stockHandler.getHistorical(companySymbol, days, (err, response, body) => {
        res.json(body);
      });
		});
}
