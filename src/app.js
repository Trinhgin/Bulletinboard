//assign all the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const { Client } = require('pg')

//set default ext. ejs
app.set('view engine', 'ejs');
app.set('views', '../views');

//set public folder
app.use(express.static('../public/css'))

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }))

const client = new Client ({
    database: process.env.PG_DB_NAME,
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
})

client.connect()
//set a route
app.get('/', (req, res) => {
    res.render('home');
})

app.post('/', (req, res) => {
    
    client.query(`insert into messages (title, body) values ('${req.body.title}','${req.body.body}')`, (err) => {
        console.log(err ? err.stack : 'message created');
        res.redirect('/view');
        // client.end() no need because you need the message to be input more than one time
    })

})

app.get('/view', (req, res) => {
    client.query('select * from messages', (err, result)=>{
        console.log(err ? err.stack : 'message viewed');
        let myResult = result.rows;
        res.render('view', {
            myResult: myResult
        })
    })
})

//set serve
app.listen(3000, () => {
    console.log('App is running on port 3000');
})