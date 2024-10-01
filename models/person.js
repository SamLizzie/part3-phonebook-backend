const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

mongoose.connect(url).then(result => {
  console.log("Connected to MongoDB");
}).catch(error => {
  console.log("Error to connect to MongoDB: " + error.message);
});

const phonebookSchema = new mongoose.Schema(
  {name: {
    type: String, 
    minLength: 3,
    required: true,
  }, 
  phone: {
    type: String, 
    validate:{
      validator: function(v) {
        return /\d{3}-\d{6}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }});

phonebookSchema.set('toJSON', {transform: (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString();
  delete returnedObject._id;
  delete returnedObject.__v;
}
});

module.exports = mongoose.model("Person", phonebookSchema);