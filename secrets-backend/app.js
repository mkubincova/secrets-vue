const express = require('express')
const sqlite3 = require('sqlite3')
const bodyParser = require('body-parser')

const app = express()
const db = new sqlite3.Database("secrets-db.db")

app.use(bodyParser.json())

// Enable CORS.
app.use(function (request, response, next) {

    // Allow client-side JS from the following websites to send requests to us:
    // (not optimal, for better security, change * to the URI of your frontend)
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")

    // Allow client-side JS to send requests with the following methods:
    response.setHeader("Access-Control-Allow-Methods", "*")

    // Allow client-side JS to send requests with the following headers:
    // (needed for the Authorization and Content-Type headers)
    response.setHeader("Access-Control-Allow-Headers", "*")

    // Allow client-side JS to read the following headers in the response:
    // (in addition to Cache-Control, Content-Language, Content-Type
    // Expires, Last-Modified, Pragma).
    // (needed for the Location header)
    response.setHeader("Access-Control-Expose-Headers", "*")

    next()

})

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
        console.log("The table 'accounts' has been succesfully created.");
    }
})

db.run(`
	CREATE TABLE IF NOT EXISTS secrets (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
        secret TEXT,
        accountId INTEGER,
        FOREIGN KEY(accountId) REFERENCES accounts(id)
	)
`, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("The table 'secrets' has been succesfully created.");
    }
})




/********************** GET REQUESTS ***************************/

app.get("/accounts", function (req, res) {
    const query = "SELECT * FROM accounts ORDER BY id ASC"
    db.all(query, function (err, accounts) {
        if (err) {
            // If something went wrong, send back status code 500.
            res.status(500).end()
        } else {
            // Otherwise, send back all accounts in JSON format.
            res.status(200).json(accounts)
        }
    })
})

app.get("/secrets", function (req, res) {
    const query = "SELECT * FROM secrets"
    db.all(query, function (err, secrets) {
        if (err) {
            // If something went wrong, send back status code 500.
            res.status(500).end()
        } else {
            // Otherwise, send back all accounts in JSON format.
            res.status(200).json(secrets)
        }
    })
})

app.get("/secrets/:accountId", function (req, res) {
    const accountId = req.params.accountId
    const query = "SELECT * FROM secrets WHERE accountId = ?"
    const values = [accountId]
    db.all(query, values, function (err, secrets) {
        if (err) {
            // If something went wrong, send back status code 500.
            res.status(500).end()
        } else {
            // Otherwise, send back all accounts in JSON format.
            res.status(200).json(secrets)
        }
    })
})

app.get("/accounts/:id", function (req, res) {
    const id = req.params.id
    const query = "SELECT id, username FROM accounts WHERE id = ?"
    const values = [id]

    db.get(query, values, function (err, account) {
        if (err) {
            // If something went wrong, send back status code 500.
            res.status(500).end()
        } else if (!account) {
            // If no account with that id existed.
            res.status(404).end()
        } else {
            // Otherwise, send back the account in JSON format.
            res.status(200).json(account)
        }
    })
})


/********************** POST REQUESTS ***************************/
app.post("/accounts", function (req, res) {
    const account = req.body
    const query = "INSERT INTO accounts (username, password) VALUES (?, ?)"
    const values = [account.username, account.password]
    db.run(query, values, function (err) {
        if (err) {
            res.status(500).end()
        } else {
            const id = this.lastID
            res.header("Location", "/accounts/" + id)
            res.status(201).end()
        }
    })
})

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

/********************** DELETE REQUESTS ***************************/
app.delete("/accounts/:id", function (req, res){
    const id = req.params.id
    const query = "DELETE FROM accounts WHERE id = ?"
    const values = [id]

    db.run(query, values, function (err, account){
        if (err) {
            // If sth went wrong.
            res.status(500).end()
        } else if (!account) {
            // If no account with that id existed.
            res.status(404).end()
        } else {
            // Otherwise, send back ok response.
            res.status(204).end()
        }            
    })

})

app.delete("/secrets/:id", function (req, res) {
    const id = req.params.id
    const query = "DELETE FROM secrets WHERE id = ?"
    const values = [id]

    db.run(query, values, function (err, secret) {
        if (err) {
            // If sth went wrong.
            res.status(500).end()
        } else if (!secret) {
            // If no account with that id existed.
            res.status(404).end()
        } else {
            // Otherwise, send back ok response.
            res.status(204).end()
        }
    })

})

/********************** PUT REQUESTS ***************************/
app.put("/accounts/:id", function (req, res) {
    const id = req.body.id
    const newpassword = req.body.newpassword
    const query = "UPDATE accounts SET password = ? WHERE id = ?"
    const values = [newpassword, id]

    db.run(query, values, function (err) {
        if (err) {
            // If sth went wrong.
            res.status(500).end()
        } else {
            // Otherwise, send back ok response.
            const numberOfUpdatedRows = this.changes
            res.status(204).end()
        }
    })

})

/********************** START SERVER ***************************/
app.listen(3000, function () {
    console.log("Server started on port 3000.");
})