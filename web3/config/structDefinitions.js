module.exports = {
  AttestData :{
    name : "string",
    panNumber : "string"
  },
  VerificationData:{
    lastUpdate: "uint",
    data: "AttestData",
    state: "VerificationState"
  },
  SortData:{
    skip : "uint",
    noSort : 'bool',
    recent : 'bool', // recently Added
    popular: 'bool', // amountRaised
    onlyCharity: 'bool', // only Charity
    onlyStartup: 'bool', // Only startup
  },
  LogMessage: {
    id : "address",
    body : "string",
    timpstamp : "uint"
  }

  
}