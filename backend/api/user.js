const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { authSecret } = require('../.env')
const jsonwebtoken = require('jsonwebtoken')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Dados incompletos')
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).send()
                }

                const payload = { id: user.id }
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).send('Usuário não cadastrado!')
        }
    }

    const validateToken = (req, res) => {
        const token = req.body.token || ''
    
        jsonwebtoken.verify(token, authSecret, function (err, decoded) {
            return res.status(200).send({ valid: !err })
        })
    }
    
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = (req, res) => {
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

    return {  signin, validateToken, save }
}