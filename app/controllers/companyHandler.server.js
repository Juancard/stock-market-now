'use strict';

let Company = require('../models/company.js');

function companyHandler(){
  this.getCompanies = (callback) => {
    Company
      .find({active:true})
      .exec((err, results) => {
        if (err) return callback(err);
        return results;
      });
  },
  this.addCompany = (company, callback) => {
    let newCompany = Company.newInstance(company.symbol, company.name);
    newCompany.save((err, result) => {
      if (err) return callback(err);
      return result;
    });
  }
}

module.exports = companyHandler;
