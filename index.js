const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = process.env.PORT || 8080;

const mySQLString = process.env.CLEARDB_DATABASE_URL;
const database = new Prohairesis(mySQLString);

app
    
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .post('/api/contact', async (req, res) => {
        const body = req.body;
        await database.execute(`
            INSERT INTO contact (
                first,
                last,
                phone,
                email,
                added
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
            email: body.email,
            address: body.address,
            
        })
        res.json("Inquiry sent successfully!");
    })


    .listen(port, () => console.log(`Server listening on port ${port}`));