const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        min: 8
    },
    links: [{
        type: Schema.Types.ObjectId,
        ref: 'urlLinks'
    }]

})

UserSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
        next();
    }
);


UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }


const userModel = mongoose.model('users', UserSchema)
module.exports = userModel; 