'use strict';

let Company = require('../models/company.js');

function companyHandler(){
  this.getCompanies = (callback) => {
    Company
      .find({active:true})
      .exec((err, results) => {
        if (err) return callback(err);
        return callback(false, results);
      });
  },
  this.addCompany = (company, callback) => {
    let newCompany = Company.newInstance(company.Symbol, company.Name);
    newCompany.save((err, result) => {
      if (err) return callback(err);
      return callback(false, result);
    });
  }
}

module.exports = companyHandler;
