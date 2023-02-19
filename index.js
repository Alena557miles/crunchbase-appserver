const express= require('express');
const app = express();
const { filesRouter } = require('./router.js');
const { createSpreadSheets } = require('./sheetsService.js');
const cors = require('cors');

app.use(express.json());
app.use(cors())
app.use('/', filesRouter);

const start = async () => {
    try {
      app.listen(8080);
    } catch (err) {
      console.error(`Error on server startup: ${err.message}`);
    }
  }
  
start();

app.use(errorHandler)

function errorHandler (err, req, res, next) {
  console.error('err')
  res.status(500).send({'message': 'Server error'});
}

