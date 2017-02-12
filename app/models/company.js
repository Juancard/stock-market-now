'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Company = new Schema({
  symbol: String,
  name: String,
  active: Boolean
});

Company
  .statics.newInstance = function newInstance(symbol,
    name, active=true) {
    let companyInstance = new this();
    companyInstance.symbol = symbol;
    companyInstance.name = name;
    companyInstance.active = active;
    return companyInstance;
  };

module.exports = mongoose.model('Company', Company);
