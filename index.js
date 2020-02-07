const express = require('express');
const app = express();
const hb = require('express-handlebars');
const setup = require('./setup');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('main-window', {
        setup: JSON.stringify(setup)
    });
});

app.listen(8080, () => console.log("server running"));