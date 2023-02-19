const {google} = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let authClient = await loadSavedCredentialsIfExist();
  if (authClient) {
    return authClient;
  }
  authClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (authClient.credentials) {
    await saveCredentials(authClient);
  }


if (authClient == null) {
  throw Error('authentication failed');
}

return authClient;
}

async function createSpreadSheets (req,res,next) {
  const authClient = await authorize();
   const spreadsheet = await sheets.spreadsheets.create({
     requestBody: {
       properties: {
         title: 'DATA FROM CRANCHBASE',
       },
     },
     auth: authClient,
   });
   const spreadsheetId = spreadsheet.data.spreadsheetId;
   const requests = [
     {
       addSheet: {
         properties: {
           title: 'data',
           "sheetId": 1,
         },
       },
     },
   ];
 
   await sheets.spreadsheets.batchUpdate({
     spreadsheetId,
     requestBody: {
       requests,
     },
     auth: authClient,
   });
   console.log("SPREADSHEETS ID: ", spreadsheetId)
   res.status(200).send({spreadsheetId})
}



async function putData (data,spreadsheetId) {
  const authClient = await authorize();
  const request = {
    spreadsheetId: spreadsheetId,  
    range: 'data', 
    valueInputOption: 'USER_ENTERED',  
    resource: {
      values:data
    },
    auth: authClient,
  };
  try {
    const response = (await sheets.spreadsheets.values.update(request)).data;
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
    createSpreadSheets,
    putData
  }