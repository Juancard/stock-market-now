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
    let newCompany = new this();
    newCompany.symbol = symbol;
    newCompany.name = name;
    newCompany.active = active;
    return newCompany;
  };

module.exports = mongoose.model('Company', Company);
