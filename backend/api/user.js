const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { authSecret } = require('../.env')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {
        console.log('req.body', req.body)
        obterHash(req.body.password, hash => {
            const password = hash

            app.db('users')
                .insert({ name: req.body.name, email: req.body.email, password })
                .returning('id')
                .then(userId => {
                    const payload = { id: userId[0] }
                    res.json({
                        name: req.body.name,
                        email: req.body.email,
                        token: jwt.encode(payload, authSecret),
                    })
                }).catch(err => res.status(400).json(err))
        })
    }

    return { save }
}