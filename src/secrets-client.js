// Install dependency by running: npm install jwt-decode
const jwt = require('jsonwebtoken');

const rootPath = "http://localhost:3000"

let accessToken = localStorage.getItem('token')

async function sendRequest(method, uri, body = null, contentType = "application/json") {
    let bodyToSend = ""
    const headers = new Headers()

    // Add the access token if signed in.
    if (accessToken != null) {
        headers.append("Authorization", "Bearer " + accessToken)
    }

    // Add the body if available.
    if (body != null) {

        headers.append("Content-Type", contentType)

        switch (contentType) {

            case "application/json":
                bodyToSend = JSON.stringify(body)
                break

            case "application/x-www-form-urlencoded":
                const data = new URLSearchParams()
                for (const key of Object.keys(body)) {
                    data.append(key, body[key])
                }
                bodyToSend = data.toString()
                break

            default:
                alert("ERROR, unknown Content-Type to send body with.")

        }
        
    }

    try {

        const requestInit = {
            method,
            headers,
            credentials: "omit"
        }

        if (bodyToSend != "") {
            requestInit.body = bodyToSend
        }
        return await fetch(rootPath + uri, requestInit)
        
    } catch (err) {
        throw ["networkError"]
    }

}

function displayError(res) {

    alert(`
		SDK has not been programmed to handle status code ${res.status}
		for the last request sent.
	`)

}

//----------------AUTHENTICATION

//---------login
module.exports.login = async function (username, password, callback) {

    const bodyToSend = {
        username,
        password
    }

    let res

    try {
        res = await sendRequest("POST", "/tokens", bodyToSend, "application/x-www-form-urlencoded")
    } catch (errors) {
        callback(errors)
        return
    }
    let errors = []
    let account = {
        id: -1,
        username: ""
    }

    let body

    switch (res.status) {

        case 200:

            accessToken = await res.json()

            const user = jwt.decode(accessToken)

            localStorage.setItem('username', user.preferred_username)
            localStorage.setItem('userId', user.accountId)
            localStorage.setItem('isLoggedIn', true)
            localStorage.setItem('token', accessToken)

            account.id = user.accountId
            account.username = user.preferred_username
            break

        case 400:
            body = await res.json()
            if (body.err) {
                errors = ["unknownErrorGettingToken: " + body.err]
            }
            break

        case 404:
            
            errors = ["Account with this username does not exist"]
            
            break
            
        case 401:
        
            errors = ["Incorrect password"]
            
            break

        default:
            displayError(res)

    }

    callback(errors, account)

}

//---------logout
module.exports.logout = async function (callback) {
    accessToken = null

    localStorage.clear();

    callback()
}


//-----------------ACCOUNTS DB

//---------create
module.exports.createAccount = async (account, callback) => {

    let res

    try {
        res = await sendRequest("POST", "/accounts", account)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let id = -1

    switch (res.status) {

        case 201:
            const locationHeader = res.headers.get("Location")
            id = parseInt(locationHeader.substr("/accounts/".length))
            break

        case 400:
            errors = await res.json()
            break

        case 422:
            errors = ["invalidAccount"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors, id)
} 

//---------update
module.exports.updateAccountById = async (account, callback) => {

    let res

    try {
        res = await sendRequest("PUT", "/accounts/" + account.id, account)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (res.status) {

        case 204:
            break

        case 400:
            errors = await res.json()
            break

        case 401:
            errors = await res.json()
            break

        case 404:
            errors = ["notFound"]
            break

        case 422:
            errors = ["invalidAccount"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors)
}

//---------delete
module.exports.deleteAccountById = async (id, callback) => {

    let res

    try {
        res = await sendRequest("DELETE", "/accounts/" + id)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (res.status) {

        case 204:
            localStorage.clear()
            break

        case 401:
            errors = await res.json()
            break

        case 404:
            errors = ["notFound"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }
    localStorage.clear()
    callback(errors)
}

//----------------SECRETS DB

//---------create 
module.exports.createSecret = async (secret, callback) => {

    let res

    try {
        res = await sendRequest("POST", "/secrets", secret)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let id = -1

    switch (res.status) {

        case 201:
            const locationHeader = res.headers.get("Location")
            id = parseInt(locationHeader.substr("/secrets/".length))
            break

        case 400:
            errors = await res.json()
            break

        case 401:
            errors = await res.json()
            break

        case 422:
            errors = ["invalidSecret"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors, id)
}

//---------delete
module.exports.deleteSecretById = async (id, callback) => {
    let res

    try {
        res = await sendRequest("DELETE", "/secrets/" + id)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (res.status) {

        case 204:
            break

        case 401:
            errors = await res.json()
            break

        case 404:
            errors = ["notFound"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors)
}

//---------get all secrets
module.exports.getAllSecrets = async (callback) => {

    let res

    try {
        res = await sendRequest("GET", "/secrets")
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let secrets = []

    switch (res.status) {

        case 200:
            secrets = await res.json()
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors, secrets)

}

//---------get secrets by user
module.exports.getSecretsByAccountId = async (accountId, callback) => {

    let res

    try {
        res = await sendRequest("GET", "/secrets/" + accountId)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let secrets = []

    switch (res.status) {

        case 200:
            secrets = await res.json()
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(res)

    }

    callback(errors, secrets)
}







