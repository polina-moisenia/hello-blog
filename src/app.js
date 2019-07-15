const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const { setCookie, deleteCookie } = require('./cookie-handler.js');
const postsRouter = require('./posts-router.js');
const commentsRouter = require('./comments-router.js');
const usersRouter = require('./users-router.js');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app = express();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/login', (req, res) => { setCookie(req, res); });
app.get('/logout', (req, res) => { deleteCookie(req, res); });

app.use('/posts', postsRouter);

app.use('/posts/:postId/comments', function (req, res, next) {
  req.postId = req.params.postId;
  next();
}, commentsRouter);

app.use('/users', usersRouter);

app.use(function (req, res, next) {
  res.status(404).send('Sorry, can\'t find that endpoint!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(`Something broke! More info : ${err}`);
})

app.listen(app.get('port'), function () {
  console.log(`Node app is running at localhost: ${app.get('port')}`);
});