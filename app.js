/**
 * Created by deepak on 06/06/15.
 */


var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    url = 'mongodb://localhost:27017/MEAN_App_Using_Mongoose',
    port = 3000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.use(bodyParser.json());

path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.use('/js', express.static(__dirname));

// mongoose model start
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name : {
        type : String
    }
});

mongoose.model('Users', UserSchema);
// mongoose model end


// mongoDB connection start
mongoose.connect(url);

var db = mongoose.connection;

db.on('connected', function () {
    console.log('Connected To MongoDB Database');
});
db.on('error', function (err) {
    console.log('Error in connecting to mongoDB ', err);
});

app.listen(port, function () {
    console.log('listening for requests on localhost:%s', port);
});
// mongoDB connection end

var Users = mongoose.model('Users');

app.post('/users', function (req, res) {
    var User = new Users(req.body);
    User.save(function (err) {
        if(err) {
            return res.status(500).json({'error' : 'error in saving user'});
        } else {
            res.json(User);
        }
    });
});

app.get('/users', function (req, res) {
    Users.find({}, function (err, users) {
        if(err) {
            return res.status(500).json({'error' : 'error in fetching users'});
        }
        res.json(users);
    })
});

app.delete('/users/:userId', function (req, res) {
    Users.findByIdAndRemove(req.params.userId, function (err) {
        if(err) {
            return res.status(500).json({'error':'error while deleting user'});
        }
        res.json({'status':'user deleted successfully'});
    });
});

app.put('/users/:userId', function (req, res) {
    Users.findByIdAndUpdate(req.params.userId, req.body, {new : true}, function (err, user) {
        if(err) {
            return res.status(500).json({'error':'error while updating user'});
        }
        res.json(user);
    });
});