var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User 
{

    async findAll()
    {
        try{
            var result = await knex.select(["id", "role", "name", "email", "slug"]).table("users");
            return result;
        }catch(err){
            console.log(err)
        }
    }


    async findById(id)
    {
        try{
            var result = await knex.select(["id", "role", "name", "email"]).where({id: id}).table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err)
        }
    }

    async findByEmail(email)
    {
        try{
            var result = await knex.select(["id", "role", "password", "name", "email"]).where({email: email}).table("users");
            
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err)
        }
    }


    async new(name, email, password, slug)
    {
        try
        {

            var hash = await bcrypt.hash(password, 14);
            await knex.insert({name, email, password: hash, role: 0, slug}).table("users")
             
           
        }catch(err)
        {
            console.log(err)
        }
        
    }

    async findEmail(email)
    {
        try
        {
            var result = await knex.select("*").from("users").where({email: email})
            if(result.length > 0)
            {
                return true;
            }else
            {
                return false;
            }

        }catch(err)
        {
            console.log(err);
            return false;
        }
    }

    async findSlug(slug)
    {
        try
        {
            var result = await knex.select(["slug"]).from("users").where({slug: slug})
            if(result.length > 0)
            {
                return true;
            }else
            {
                return false;
            }

        }catch(err)
        {
            console.log(err);
            return false;
        }
    }

    async update(id, email, name, role){
        var user = await this.findById(id);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if(!result){
                        editUser.email = email;
                    }else{
                        return {status: false, err: "Email já cadastrado!"}
                    }
                }
            }

            if(name != undefined){
                editUser.name = name
            }

            if(role != undefined){
                editUser.role = role
            }

            try
            {
                await knex.update(editUser).where({id: id}).table("users")
                return {status: true}
            }catch(err)
            {
                return {status: false, err: err}
            }

        }else{
            return {status: false, err: "Usuário não existe"}
        }
    }

    async delete(id){
        let user = await this.findById(id);

        if(user != undefined){
           
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            }catch(err){
                return {status: false, err: err}
            }

        }else{
            return {status: false, err: "Usuário não existe ou ocorreu outro erro."}
        }
    }
    
    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 14);
        await knex.update({password: hash}).where({id: id}).table("users")
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }







}

module.exports = new User();