const mongoose = require('mongoose');


MONGO_URI = process.env.MONGO_DB_URI || "mongodb+srv://admin_db_user:3rZm1rBZvbczp0Hu@cluster0.rgepebs.mongodb.net/video-editing?retryWrites=true&w=majority&appName=Cluster0";

const database = async ()=>{
    
 
    try{
       await mongoose.connect(MONGO_URI);
        console.log('Database connection has been successfully installed');
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = database;