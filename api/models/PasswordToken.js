let knex = require("../database/connection");
let User = require("../models/User");
const { v4: uuidv4 } = require('uuid');

class PasswordToken{
    async create(email){
        var user = await User.findByEmail(email);
        
        try{
            var token = uuidv4();

            await knex.insert({
                user_id: user.id,
                used: 0,
                token: token
            }).table("passwordtokens");
            return {status: true, token: token}
        }catch(err){
            return {status: false, err: err}
        }
    }

    async validate(token){
        try{
            let result = await knex.select().where({token: token}).table("passwordtokens");

            if(result.length > 0){
                let tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }
            }else{
                return {status: false};
            }
        }catch(err){
            console.log(err);
            return {status: false};
        }


    }



}

module.exports = new PasswordToken;