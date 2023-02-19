const { putData } = require('./sheetsService.js');

const searchURLAIRBNB="https://api.crunchbase.com/api/v4/autocompletes?query=airbnb&collection_ids=organization.companies&user_key=961714860c3d144ca5d919e4605f44d1"

async function findCompanyMatchesAB(req,res,next){
  console.log(req.params.spreadsheetID)
  const spreadsheetId = req.params.spreadsheetID
  try{
    const response = await fetch(searchURLAIRBNB, {
      method: 'get',
      headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();
    
    const companyName = await data.entities.map(obj=> {
      return obj.identifier.value
    })
    const short_description = await data.entities.map(obj=> {
        return obj.short_description
    })
    const uuid = await data.entities.map(obj=> {
        return obj.identifier.uuid
    })

    const finalArray = await valuesForSheets(companyName, short_description,uuid)
    const sheetsHead = ['COMPANY NAME', 'COMPANY DESCRIPTION', 'COMPANY UUID']

    finalArray.unshift(sheetsHead)
    putData(finalArray, spreadsheetId)
    const resp= {
      status:200,
      messege: 'successfull'
    }
    res.status(200).send(JSON.stringify(resp));
  } catch (err){
    const resp= {
      status:400,
      messege: 'fail'
    }
    res.status(400).send(JSON.stringify(resp));
  }
}

module.exports = {
 findCompanyMatchesAB,
}


async function valuesForSheets (arr1, arr2, arr3){
  let reArr = []
  for (let i=0; i<arr1.length; i++){
    const result = [arr1[i], arr2[i], arr3[i]]
      reArr.push(result)
  }
  return reArr
}
