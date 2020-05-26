const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.json());

let userList = [
  {
    username: "admin",
    password: "admin"
  }
];

// GET de página inicial
app.get("/", (req, res) => {
  // Retorna página inicial
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// GET de página de registro
app.get("/register-page", (req, res) => {
  // Retorna página de registro
  res.sendFile(path.join(__dirname, "../client/register.html"));
});

// GET de Home para logueados
app.get("/home", (req, res) => {
  // Retorna página de home para logueados
  res.sendFile(path.join(__dirname, "../client/home.html"));
});

// GET para frases, acepta queryparam 'search=' para filtrar
app.get("/phrases", (req, res) => {

  getPhrasesList( phrasesList => {

    // Si hay más de 5 frases, trunco la lista en 5.
    // También se podría hacer con .splice(5) o .slice(0, 5);
    if (phrasesList.length > 4) phrasesList.length = 5;

    // Si llegó un queryparam search, filtro la lista
    if (req.query.search) {
      phrasesList = phrasesList.filter( item => item.phrase.includes(req.query.search) );
    }
    
    res.json(phrasesList);

  })
  
})

// POST /register - Registrar usuarix
app.post("/register", (req, res) => {
  console.log(req.body); // { username: 'admin', password: 'admin', passwordConfirm: 'admin' }

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password || !req.body.passwordConfirm) {
    res.status(400).send("No se recibieron los datos correctos.");
    return;
  }

  // Tengo los dos datos, los valido

  // Valido si password y confirmación de password son iguales
  if (req.body.password != req.body.passwordConfirm) {
    res.status(400).send("Los passwords no coinciden, intentelo nuevamente.");
    return;
  }

  // Valido si existe el nombre de usuarix
  if (userList.filter(user => user.username === req.body.username).length > 0) {
    res.status(409).send("Ya existe usuarix con ese nombre.");
    return;
  }

  userList.push({
    username: req.body.username,
    password: req.body.password
  });

  console.log(userList);

  res.status(200).send("Usuarix registradx.");

});

// POST /login - login de usuarix
app.post("/login", (req, res) => {

  console.log(req.body);

  // Verificar si recibí los datos y validarlos
  if (!req.body.username || !req.body.password) {
    res.status(400).send("No se recibieron los datos correctos.");
    return;
  }

  if (userList.filter(user => user.username === req.body.username && user.password === req.body.password).length > 0) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }

});



app.listen(4000, () => {
  console.log("Server iniciado en puerto 4000...")
});

/**
 * Lee un archivo de frases .json y pasa el resultado parseado a una callback
 * @param {function} callback La f que recibira el json parseado como primer parametro
 * 
 */
function getPhrasesList(callback) {

  // leo el archivo asincronamente
  fs.readFile(path.join(__dirname, "phrases.json"), "utf-8", (err, data) => {

    if (err) {

      console.log(`Error: ${error}`);
      // retorno un array vacio para no tener un error tan disruptivo
      callback([]);

    } else {

      callback(JSON.parse(data));

    }

  });

}