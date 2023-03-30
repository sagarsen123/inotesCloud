const { default: mongoose } = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/iNoteBook";


// connection to mongoDb
const connectToMongo = () =>{
    mongoose.connect(mongoURI).then(res => {console.log('connected to DB')}) 
}


module.exports = connectToMongo;