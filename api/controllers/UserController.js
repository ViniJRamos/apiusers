require('dotenv').config();
const req = require("express/lib/request");
const res = require("express/lib/response");
let User = require("../models/User");
let PasswordToken = require("../models/PasswordToken");
var bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");


class UserController{

    async index(req, res){
       var users = await User.findAll()
       res.json(users)
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user)
        }
     }


    async create(req, res)
    {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var slug = req.body.slug; //BOTAR PLACEHOLDER PRO SLUG COM VALUE
        if(email == '' || email == ' ' || email == undefined){
            res.status(400);
            res.json({err: "Erro no email, revise as informações e tente novamente."});
            return;
        }

        if(name == '' || name == ' ' || name == undefined || name.length < 4){
            res.status(400);
            res.json({err: "Nome de usuário vazio ou muito curto. (mínimo de 4 dígitos)"});
            return;
        }
        if(password == '' || password == ' ' || password == undefined || password < 4){
            res.status(400);
            res.json({err: "Senha vazia ou muito curta. (mínimo 6 dígitos)"});
            return;
        }
        var slugExist = await User.findSlug(slug);

        while(slugExist == true){
            var slugExist = await User.findSlug(slug);
            var slug = Math.floor(Math.random() * (parseInt('9999') - parseInt('1111') + 1))
        }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "Email já cadastrado!"})
            return;
            
        }

        await User.new(name, email, password, slug);
        res.status(200);
        res.send("Tudo OK!")
        
    }

    async edit(req, res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id, email, name, role)
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }else{
                res.status(406);
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!")
        }

    }

    async remove(req, res){
        var id = req.params.id;
        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Usuário deletado!");
            console.log(result.status)
        }else{
            res.status(406);
            res.send(result.err)
        } 
    }

    async recoverPassword (req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        
        res.status(200);
        res.send("Caso o email esteja correto, em alguns instantes será enviado de recuperação, verifique também a Lixeira e Spam.")
    }

    async changePassword(req, res){
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);
        
        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    async login(req, res){
        let {email, password} = req.body;

        let user = await User.findByEmail(email);

        if(user != undefined){
            let result = await bcrypt.compare(password, user.password);

            if(result){
                let token = jwt.sign({email: user.email, role: user.role}, process.env.SECRET_JWT);
                res.status(200);
                res.json({token: token})
            }else{
                res.status(406);
                res.send("Senha incorreta!")
            }
        }else{
            res.json({status: false})
        }
    }


}

module.exports = new UserController();