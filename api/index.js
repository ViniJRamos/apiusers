let bodyParser = require('body-parser');
let express = require("express");
let app = express();
let router = require("./routes/routes");
let cors = require("cors")

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use("/",router);


app.listen(8080,() => {
    console.log("Servidor rodando");
});

