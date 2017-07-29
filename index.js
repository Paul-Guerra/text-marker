let express = require('express');

let app = express();
let server = require('http').createServer(app);

app.use(express.static('dist'));
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/index.html`);
});

server.listen(3000);

