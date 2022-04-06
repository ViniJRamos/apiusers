class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Api de Usuários!");
    }

    async validate(req, res){
        res.send("ok")
    }
}

module.exports = new HomeController();