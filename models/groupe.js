const mongoose =  require ('./connection/index');

//group schemas:
const GroupeSchemas = new mongoose.Schema({
    members: String,
    expenses: Float,
    //foreign key rembourssment
});

//create group model:
const Group=mongoose.model('Group',GroupeSchemas);

module.exports=Group;