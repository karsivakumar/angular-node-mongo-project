import express from 'express';

import cors from 'cors';

import bodyParser from 'body-parser';

import mongoose from 'mongoose';

import IssueDB from './models/Issues';

const app = express();
const router = express.Router();

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Issues', function(err, db) {
    if (err) console.log ('dbconnect error')
    else
    {
    // var db = client.db('Issues')
    db.collection('IssuesCollection').find().toArray(function (err, result) {
      if(err) console.log(err);
      console.log(result);
    })}
});

const connection = mongoose.connection;

console.log(connection);

connection.once('open', () => {
    console.log('mongoose database connection established successfully!');
})

router.route('/issues').get((req, res) => {
    console.log('inside mongoose database connection find!');
    db.collection('Issues').find((err, issues) => {
        if (err)
            console.log(err)
        else
            res.json(issues);
            console.log(issues);
    });
});

router.route('/issues/:id').get((req, res) => {
    IssueDB.findById(req.params.id,(err, issue) => {
        if (err)
            console.log(err)
        else
            res.json(issue);
    });
});

router.route('/issues/add').post((req, res) => {
    let issueadd = new IssueDB(req.body);
    issueadd.save()
        .then(issueadd => {
                res.status(200).json({'msg' : 'issue added successfully!'});
            })
        .catch(err => {
                res.status(400).json({'msg' : 'issue not added!'});
        })
});

router.route('/issues/update/:id').post((req, res) => {
    IssueDB.findById(req.params.id,(err, issue) => {
        if (!issue)
            return next(new Error('could not load document'));
        else
       {
            issue.type        = req.body.type;
            issue.description = req.body.description;
            issue.assigned    = req.body.assigned;
            issue.assignedTo  = req.body.assignedTo;
            issue.severity    = req.body.severity;
            issue.status      = req.body.status;
            
            issue.save().then(issue => {
                res.json('update successful!');
            }).catch(err => {
                res.status(400).send('issue update failed!');
            })
        }
    });
});


router.route('/issues/delete/:id').get((req, res) => {
    IssueDB.findByIdAndRemove({_id: req.params.id},(err, issue) => {
        if (err)
        {
            res.json(err);
        }
            else
        {
            res.json('removed successfully!');
        }
    });
});

app.use('/', router);

app.listen(4000, () => console.log('express server is running on port 4000!'));