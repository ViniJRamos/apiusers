class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Api de Usuários!");
    }

}

module.exports = new HomeController();