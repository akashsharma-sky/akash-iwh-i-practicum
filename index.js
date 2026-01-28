require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT = '2-56450032';
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// TODO: ROUTE 1 - Homepage route to list all custom object data. Render the data in a pug template.

app.get('/', async (req, res) => {
    axios.get(`https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT}?properties=model,company,model_year`, { 
        headers 
    })
}).then(response => {
    const data = response.data.results;
    res.render('homepage', { 
        title: 'Car Table', 
        data 
    });
}).catch(error => {
    console.error('Error fetching custom object data:', error);
    res.send('Error fetching data');
});

// TODO: ROUTE 2 - Show Form Page to create or update car data.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Car Form' 
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { model, company, model_year } = req.body;
    axios.post(`https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT}`, 
        { 
        properties: {
            model,
            company,
            model_year
        }
    }, { headers })
        .then((response) => {
            res.redirect('/');
        })
        .catch((error) => {
            console.error('Error creating/updating car data:', error);
            res.send('Error creating/updating data');
        });
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));