const mongoose = require('mongoose')

if(process.argv.length<3) {
  console.log('giver password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = 'mongodb+srv://toingasamantha:'+password+'@cluster0.owvn8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0'

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({ name: String, phone: String })

const Person = mongoose.model('Person', phonebookSchema)
if(process.argv.length===3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.phone)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({ name: process.argv[3], phone: process.argv[4] })

  person.save().then(result => {
    console.log('person saved! ' + result)
    mongoose.connection.close()
  })
}

