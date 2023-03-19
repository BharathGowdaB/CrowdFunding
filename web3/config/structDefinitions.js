module.exports = {
  AttestData :{
    "name" : "string",
    "panNumber" : "string"
  },
  VerificationData:{
    "lastUpdate": "uint",
    "data": "AttestData",
    "state": "VerificationState"
  }
}