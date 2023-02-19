const express = require('express');
const router = express.Router();

const { findCompanyMatchesAB } = require('./service.js');
const { createSpreadSheets } = require('./sheetsService')

router.post('/', createSpreadSheets);
router.post('/fetchdata/:spreadsheetID', findCompanyMatchesAB);

module.exports = {
  filesRouter: router
};
