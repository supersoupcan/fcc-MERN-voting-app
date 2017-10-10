var app = require('../server/server');

app.listen(process.env.PORT, function (){
    console.log('app running at ' + 'https://fcc-mern-voting-app-supersoupcan.c9users.io/');
});