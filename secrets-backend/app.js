require('dotenv').config();
const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcypt = require('bcrypt')

const saltRounds = 10

const YAML = require('yaml')

const app = express()
const db = new sqlite3.Database("secrets-db.db")


//Handle request body in different data formats (YAML, JSON, www-form-urlencoded)
app.use((req, res, next) => {
    
    if (req.headers['content-type'] == "application/yaml") {
        const bodyParts = []
        req.on("data", function (chunk) {
            bodyParts.push(chunk)
        })
        req.on("end", function () {
            const body = Buffer.concat(bodyParts).toString()
            const parsedBody = YAML.parse(body)
            req.body = parsedBody
            next()
        }) 
    } else {
        next()
    }
})
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

//Handle response body in different data formats (YAML, JSON)
function resFormat(req, data) {
    if (req.headers['accept'] == "application/yaml"){
        return YAML.stringify(data);
    } else {
        return JSON.stringify(data);
    }
}


// Enable CORS.
app.use(function (req, res, next) {

    res.setHeader("Access-Control-Allow-Origin", "*")

    res.setHeader("Access-Control-Allow-Methods", "*")

    // (needed for the Authorization and Content-Type headers)
    res.setHeader("Access-Control-Allow-Headers", "*")

    // Allow client-side JS to read the following headers in the res:
    // (in addition to Cache-Control, Content-Language, Content-Type
    // Expires, Last-Modified, Pragma).
    // (needed for the Location header)
    res.setHeader("Access-Control-Expose-Headers", "*")

    next()

})


// Verify access token
function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    //if authHeader exists (Bearer "dlfjdkglflgff..."), split it to get token ("dlfjdkglflgff...")
    const token = authHeader && authHeader.split(' ')[1] 
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}


/********************** DATABASE ***************************/
db.run(`
	CREATE TABLE IF NOT EXISTS accounts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
		password TEXT
	)
`, function(err){
    if (err){
        console.log(err);
    } else {
        console.log("The table 'accounts' is working.");
    }
})

db.run(`
	CREATE TABLE IF NOT EXISTS secrets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
        secret TEXT,
        accountId INTEGER,
        FOREIGN KEY(accountId) REFERENCES accounts(id) ON DELETE CASCADE
	)
`, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The table 'secrets' is working.");
    }
})


/********************** AUTHENTICATION *********************/

//---------login
app.post("/tokens", (req, res) => {

    //get account with matching username
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [req.body.username]

    db.get(query, values, (err, account) => {
        if (err) {
            res.status(500).end()
        } else if (!account) {
            console.log("Account with this username does not exist");
            res.status(404).end()
        } else {
            //compare hashed password from database with value from login form
            bcypt.compare(req.body.password, account.password, (err, result) => {
                if(result){
                    // Generate and send back access token valid for 30 minutes (1800 seconds)
                    const token = jwt.sign({
                        //store account id and username in the token
                        accountId: account.id,
                        preferred_username: account.username
                    }, process.env.TOKEN_SECRET, { expiresIn: '1800s' })

                    const bodyToSend = resFormat(req, token)
                    res.send(bodyToSend)
                    
                } else {
                    console.log("Incorrect password");
                    res.status(401).end()
                }
            })
            
        }
    })
})

/********************** GET REQUESTS ***************************/

//---------get all secrets
app.get("/secrets", function (req, res) {
    const query = "SELECT * FROM secrets"
    db.all(query, function (err, secrets) {
        if (err) {
            res.status(500).end()
        } else {
            const bodyToSend = resFormat(req, secrets)
            res.status(200).send(bodyToSend)
        }
    })
})

//---------get secrets by user 
app.get("/secrets/:accountId",  function  (req, res) {

    const accountId = req.params.accountId

    const query = "SELECT * FROM secrets WHERE accountId = ?"
    const values = [accountId]
    db.all(query, values, function (err, secrets) {
        if (err) {
            res.status(500).end()
        } else {
            const bodyToSend = resFormat(req, secrets)
            res.status(200).send(bodyToSend)
        }
    })
    
})

/********************** POST REQESTS ***************************/

//---------create account 
app.post("/accounts", function (req, res) {
    const account = req.body
    const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"

    bcypt.hash(account.password, saltRounds, (err, hash) => {
        if (!err) {
            const values = [account.username, hash]
            db.run(query, values, function (err) {
                if (err) {
                    console.log("Account with this username already exists");
                    res.status(422).end()
                } else {
                    const id = this.lastID
                    res.header("Location", "/accounts/" + id)
                    res.status(201).end()
                }
            })
        } else {
            console.log("There has been an error hashing your password");
            res.status(500).end()
        }  
    })

    
})

//---------create secret
app.post("/secrets", function (req, res) {
    const secret = req.body
    const query = "INSERT INTO secrets (secret, accountId) VALUES (?, ?)"
    const values = [secret.secret, secret.accountId]
    db.run(query, values, function (err) {
        if (err) {
            res.status(500).end()
        } else {
            const id = this.lastID
            res.header("Location", "/secrets/" + id)
            res.status(201).end()
        }
    })
})



/********************** DELETE REQUEST ***************************/

//---------delete account 
app.delete("/accounts/:id", authenticateToken, function (req, res){

    // Check authorization
    const accountId = req.user.accountId
    
    if (!accountId) {
        // Not logged in
        const bodyToSend = resFormat(req, ["notAuthenticated"])
        res.status(401).send(bodyToSend)
        return
    } else if (req.params.id != accountId) {
        // Not owner of account
        const bodyToSend = resFormat(req, ["notAuthorized"])
        res.status(401).send(bodyToSend)
        return
    }
    
    const query = "DELETE FROM accounts WHERE id = ?"
    const values = [accountId]

    db.run(query, values, function (err, account){
        if (err) {
            res.status(500).end()
        } else if (!account) {
            res.status(404).end()
        } else {
            res.status(204).end()
        }            
    })

})

//---------delete secret 
app.delete("/secrets/:id", function (req, res) {

    const id = req.params.id
    const query = "DELETE FROM secrets WHERE id = ?"
    const values = [id]

    db.run(query, values, function (err, secret) {
        if (err) {
            res.status(500).end()
        } else if (!secret) {
            res.status(404).end()
        } else {
            res.status(204).end()
        }
    })

})

/********************** PUT REQUEST ***************************/

//---------update account 
app.put("/accounts/:id", authenticateToken, function (req, res) {

    // Check authorization
    const accountId = req.user.accountId

    if (!accountId) {
        // Not logged in
        const bodyToSend = resFormat(req, ["notAuthenticated"])
        res.status(401).send(bodyToSend)
        return
    } else if (req.params.id != accountId) {
        // Not owner of account
        const bodyToSend = resFormat(req, ["notAuthorized"])
        res.status(401).send(bodyToSend)
        return
    }
    //Hash new password and update the database
    bcypt.hash(req.body.newpassword, saltRounds, (err, hash) => {
        if (!err) {
            const query = "UPDATE accounts SET password = ? WHERE id = ?"
            const values = [hash, accountId]
            db.run(query, values, function (err) {
                if (err) {
                    res.status(500).end()
                } else {
                    res.status(204).end()
                }
            })
        } else {
            console.log("There has been an error hashing your password");
            res.status(500).end()
        }
    })
})

/********************** START SERVER ***************************/
app.listen(3000, function () {
    console.log("Server started on port 3000.");
})