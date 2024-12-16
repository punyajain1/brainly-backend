import mongoose, { mongo } from "mongoose"
mongoose.connect("mongodb+srv://admin:VowyYnkBsv1ZGvQu@cluster0.vuzwp.mongodb.net/second-brain");
const ObjectId = mongoose.Schema.Types.ObjectId


const userSchema = new mongoose.Schema({
    email: {type:String , require:true},
    password: {type:String , require:true}
});

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }

});  


const contentSchema = new mongoose.Schema({
    type: {type: String , required: true},
    link: {type: String, required: true },
    title:{type:String, require: true},
    tags: [{type: ObjectId, ref: 'Tag' , default:[]}],
    userId: {type: ObjectId, ref: 'User', required: true },

});

const linkSchema = new mongoose.Schema({
    hash:{ type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});


export const usermodel = mongoose.model("User", userSchema);
export const tagmodel = mongoose.model("Tag", tagSchema);
export const contentmodel = mongoose.model("Content", contentSchema);
export const linkmodel = mongoose.model("Link", linkSchema);