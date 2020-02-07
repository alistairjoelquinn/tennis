const express = require('express');
const app = express();
const hb = require('express-handlebars');
const { user, computer, net, line1, line2, horizontal, ball } = require('./setup');

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
        user, computer, net, line1, line2, horizontal, ball
    });
});

app.listen(8080, () => console.log("server running"));