const mongoose = require('mongoose');   

const connectionDB = ()=>{
    
    const dbUrl = process.env.MONGO_URI
    mongoose.connect(dbUrl)
        .then(() => {
            app.listen(process.env.PORT || 5000);
            console.log('\x1b[33m app connected to mongoDB! \x1b[0m');

        })
        .catch((err => {
            console.error(err)
        }))}


module.exports = {
    connectionDB
}