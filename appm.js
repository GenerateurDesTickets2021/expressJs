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
//marker

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajouter le chemin d'accueil et définir la page d'index des etudiants
app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM monument";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        //marker(rows.latitude,rows.langitude)
        res.render('indexm', {
            title : 'Gestion Des Monument',
            monument : rows
        });
    });
});

app.get('/addm',(req, res) => {
    res.render('addm', {
        title : 'Gestion Des Monument'
    });
});
app.get('/addvisite/:Id',(req, res) => {
    Id=req.params.Id;
    let sql = `Select * from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
      if(err) throw err;
      res.render('verifier', {
       // v : result[0]
    });
});
});

app.get('/visite',(req, res) => {
    let sql = "SELECT * FROM monument";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('visite', {
            title : 'Les Monument Visités',
            monument : rows
        });
    });
});
app.post('/updatvisite',(req, res) => {
    const Id = req.body.id;
    let sql = "update monument SET etat='True', date=Now() where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/visite');
    });
});
app.post('/savem',(req, res) => { 
    let data = {id: req.body.id, nom: req.body.nom,latitude: req.body.latitude, longitude: req.body.longitude, ville: req.body.ville};
    let sql = "INSERT INTO monument SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      
      res.redirect('/');
    });
});

app.get('/editm/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `Select * from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('editm', {
            title : 'Gestion Des Monument',
            m : result[0]
        });
    });
});

app.get('/editvisite/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `Select * from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('editvisite', {
            title : 'Gestion Des Monument',
            m : result[0]
        });
    });
});

app.post('/updatem',(req, res) => {
    const Id = req.body.id;
    let sql = "update monument SET id='"+req.body.id+"',  nom='"+req.body.nom+"',latitude='"+req.body.latitude+"',longitude='"+req.body.longitude+"',ville='"+req.body.ville+"' where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/deletem/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `DELETE from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});



// Server Listening
app.listen(4000, () => {
    console.log('Server is running at port 4000');
});