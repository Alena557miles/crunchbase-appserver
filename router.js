const express = require('express');
const router = express.Router();
const { findCompanyMatchesAB, someFunction } = require('./service.js');
const { createSpreadSheets } = require('./sheetsService')


router.post('/', createSpreadSheets);
router.post('/fetchdata/:spreadsheetID', findCompanyMatchesAB);
// router.post('/some/:spreadsheetID', someFunction);

module.exports = {
  filesRouter: router
};
