require('dotenv').config();
let jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    
    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        let token = bearer[1];

        try{
            let decoded = jwt.verify(token, process.env.SECRET_JWT);
            if(decoded.role === 1){
                next();
            }else if(decoded.role === 2){
                next();
            }else{
                res.status(401);
                res.json({err: "Você não tem permissão."});
                return;
            }
            
        }catch(err){
            res.status(401);
            res.json({err: "Você não tem permissão."});
            return;
        }
    }else{
        res.status(401);
        res.json({err: "Você não tem permissão."});
        return;
    }
}