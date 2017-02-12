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
    Company
      .findOne({symbol: company.Symbol})
      .exec((err, result) => {
        if (err) return callback(err);
        let newCompany;
        if (result) {
          newCompany = result;
          newCompany.active = true;
        } else {
          newCompany = Company.newInstance(company.Symbol, company.Name);
        }
        newCompany.save((err, result) => {
          if (err) return callback(err);
          return callback(false, result);
        });
      });
  },
  this.deleteCompany = (companySymbol, callback) => {
    Company
      .findOneAndUpdate({symbol: companySymbol}, { active: false })
      .exec((err, result) => {
        result.save((err, result) => {
          if (err) return callback(err);
          return callback(false, result);
        });
      });
  }
}

module.exports = companyHandler;
