const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  address : {
    type: String,
    required: true,
  },
  

})