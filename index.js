const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 8080;

const mySQLString="mysql://ba2bf48fa8c275:1e0708e6@us-cdbr-east-06.cleardb.net/heroku_c2cc8d646114427?reconnect=true";
const database = new Prohairesis(mySQLString);


app
    .use(express.static('public'))
    .use(morgan('dev'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .post('/api/contact', (req, res) => {
        database.execute(`
            INSERT INTO contact (
                first,
                last,
                phone,
                email,
                date_added
            ) VALUES (
                @first,
                @last,
                @phone,
                @email,
                NOW()
            )
            )
        `)


        res.json(req.body);
    })

    .listen(port, () => console.log(`Server listening on port ${port}`));
