const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const { authSecret } = require('../.env')
const jsonwebtoken = require('jsonwebtoken')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ errors: ['Incomplete data'] })
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ errors: ['Login and password not found!'] })
                }

                const payload = { id: user.id }
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).json({ errors: ['Unregistered user!'] })
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

            if (!bcrypt.compareSync(req.body.confirm_password, password)) {
                return res.status(400).send({ errors: ['Passwords do not match.'] })
            }

            app.db('users')
                .insert({
                    name: req.body.name,
                    email: req.body.email,
                    password,
                    created_at: new Date(),
                    updated_at: null
                })
                .returning('id')
                .then(userId => {
                    signin(req, res)
                }).catch(err => res.status(400).json({ errors: [err] }))
        })
    }

    const get = (req, res) => {
        app.db.select(
            {
                id: 'users.id',
                name: 'users.name',
                email: 'users.email'
            }
        ).from('users')
            .then(users => res.json(users))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { signin, validateToken, save, get }
}