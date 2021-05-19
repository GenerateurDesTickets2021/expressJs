const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

//connect to db
const mysql = require('mysql');
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'expressdb'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});

//definir moteur de template
//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajouter le chemin d'accueil et définir la page d'index des etudiants
app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM etudiant";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'gestion etudiants',
            etudiant : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('add', {
        title : 'gestion etudiants'
    });
});

app.post('/save',(req, res) => { 
    let data = {id: req.body.id, nom: req.body.nom};
    let sql = "INSERT INTO etudiant SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `Select * from etudiant where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit', {
            title : 'gestion etudiants',
            e : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const Id = req.body.id;
    let sql = "update etudiant SET id='"+req.body.id+"',  nom='"+req.body.nom+"' where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `DELETE from etudiant where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});