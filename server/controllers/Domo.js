const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
    Domo.DomoModel.findByOwner(req.session.account.id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occured' });
        }
        return res.render('app', { domos: docs });
    })
};

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');


let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,
        trim: true,
        set: setName
    },
    age: {
        type: Number,
        min: 0,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    return DomoModel.find(search).select('name age').lean().exec(callback);
};
DomoModel = mongoose.model('Domo', DomoSchema);

const makeDomo = (req, res) => {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'RAWR!Both Name and age are required' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id
    };

    const newDemo = newDomo.DomoModel(domoData);
    const domoPromise = newDomo.save();

    domoPromise.then(() => res.json({ redirec: '/maker' }))

    domoPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists' });
        }
        return res.status(400).json({ error: 'an error occured' });
    });
    return domoPromise;
}

module.exports.makerPage = makerPage;
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;