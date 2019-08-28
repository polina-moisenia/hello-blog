const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const socketio = require('socket.io');
const connectMongoDB = require ("./utils/mongo-connection.js");
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
const { setCookie, deleteCookie } = require(path.join(__dirname, './controllers/cookie-controller.js'));
const authorizeByCookie = require('./utils/auth-middleware.js');
const postsController = require(path.join(__dirname, './controllers/posts-controller.js'));
const commentsController = require(path.join(__dirname, './controllers/comments-controller.js'));
const userController = require(path.join(__dirname, './controllers/users-controller.js'));
const statisticsController = require(path.join(__dirname, './controllers/statistics-controller.js'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
connectMongoDB();

app = express();

app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/login', (req, res) => { setCookie(req, res); });
app.get('/logout', (req, res) => { deleteCookie(req, res); });

app.use('/posts',
  express.Router()
    .get('/', authorizeByCookie('VIEW_POSTS'), postsController.getPosts)
    .post('/', authorizeByCookie('ADD_POSTS'), postsController.createPost)
    .get('/statistics', authorizeByCookie('VIEW_POSTS'), statisticsController.getPostsStatistics)
    .get('/:id', authorizeByCookie('VIEW_POSTS'), postsController.getPostById)
    .put('/:id', authorizeByCookie('ADD_POSTS'), postsController.updatePost)
    .delete('/:id', authorizeByCookie('DELETE_POSTS'), postsController.deletePost));

app.use('/posts/:postId/comments', function (req, res, next) { req.postId = req.params.postId; next(); },
  express.Router()
    .get('/', authorizeByCookie('VIEW_COMMENTS'), commentsController.getCommentsByPostId)
    .post('/', authorizeByCookie('ADD_COMMENTS'), commentsController.createComment)
    .get('/:id', authorizeByCookie('VIEW_COMMENTS'), commentsController.getCommentById)
    .put('/:id', authorizeByCookie('ADD_COMMENTS'), commentsController.updateComment)
    .delete('/:id', authorizeByCookie('DELETE_COMMENTS'), commentsController.deteleComment));

app.use('/users',
  express.Router()
    .get('/', authorizeByCookie('VIEW_USERS'), userController.getUsers)
    .get('/:id', authorizeByCookie('VIEW_USERS'), userController.getUserById)
    .put('/:id', authorizeByCookie('ADD_USERS'), userController.updateUser)
    .delete('/:id', authorizeByCookie('DELETE_USERS'), userController.deleteUser));

app.use(express.static(__dirname + '/ui-client'))

app.use(function (req, res, next) {
  res.status(404).send('Sorry, can\'t find that endpoint!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(`Something broke! More info : ${err}`);
})

const expressServer = app.listen(app.get('port'), function () {
  console.log(`Node app is running at localhost: ${app.get('port')}`);
});

const io = socketio(expressServer)

// Simple chat
io.on('connection', (socket) => {
  socket.emit('messageToClient', {text: 'hello from server'})
  socket.on('messageToServer', console.log)
  socket.on('newMessageFromClient', msg => {
    io.emit('newMessageToClient', msg)
  })
})
