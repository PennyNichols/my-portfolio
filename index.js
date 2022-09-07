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

    .post('/api/contact', async(req, res) => {
        const body = req.body;
        await database.execute(`
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
        `, {
            first: body.first,
            last: body.last,
            phone: body.phone,
            email: body.email
        });


        res.end('Inquiry sent successfully!');
    })

    .listen(port, () => console.log(`Server listening on port ${port}`));
