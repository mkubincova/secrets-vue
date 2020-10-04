// Install dependency by running: npm install jwt-decode
const jwtDecode = require('jwt-decode')

const rootPath = "http://localhost:3000"

let accessToken = null

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

    } catch (error) {
        throw ["networkError"]
    }

}

function displayError(response) {

    alert(`
		SDK has not been programmed to handle status code ${response.status}
		for the last request sent.
	`)

}




//-----------------ACCOUNTS DB

//---------create
module.exports.createAccount = async (account, callback) => {

    let response

    try {
        response = await sendRequest("POST", "/accounts", account)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let id = -1

    switch (response.status) {

        case 201:
            const locationHeader = response.headers.get("Location")
            id = parseInt(locationHeader.substr("/accounts/".length))
            break

        case 400:
            errors = await response.json()
            break

        case 422:
            errors = ["invalidAccount"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors, id)
} 

//---------update
module.exports.updateAccountById = async (account, callback) => {

    let response

    try {
        response = await sendRequest("PUT", "/accounts/" + account.id, account)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (response.status) {

        case 204:
            break

        case 400:
            errors = await response.json()
            break

        case 401:
            errors = await response.json()
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
            displayError(response)

    }

    callback(errors)
}

//---------delete
module.exports.deleteAccountById = async (id, callback) => {

    let response

    try {
        response = await sendRequest("DELETE", "/accounts/" + id)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (response.status) {

        case 204:
            break

        case 401:
            errors = await response.json()
            break

        case 404:
            errors = ["notFound"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors)
}

//----------------AUTHENTICATION

//---------login
module.exports.login = async function (username, password, callback) {

    const bodyToSend = {
        username,
        password,
        grant_type: "password"
    }

    let response

    try {
        response = await sendRequest("POST", "/tokens", bodyToSend, "application/x-www-form-urlencoded")
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

    switch (response.status) {

        case 200:

            body = await response.json()

            accessToken = body.access_token

            const payload = jwtDecode(body.id_token)
            account.id = payload.sub
            account.username = payload.preferred_username

            break

        case 400:

            body = await response.json()

            switch (body.error) {

                case "invalid_grant":
                    errors = ["wrongCredentials"]
                    break

                default:
                    errors = ["unknownErrorGettingToken: " + body.error]
                    alert(`
						SDK has not been programmed to handle error ${body.error}
						when failing to login.
					`)

            }

            break

        default:
            displayError(response)

    }

    callback(errors, account)

}

//---------login
module.exports.logout = async function (callback) {
    accessToken = null
    callback()
}



//----------------SECRETS DB

//---------create 
module.exports.createSecret = async (secret, callback) => {

    let response

    try {
        response = await sendRequest("POST", "/secrets", secret)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let id = -1

    switch (response.status) {

        case 201:
            const locationHeader = response.headers.get("Location")
            id = parseInt(locationHeader.substr("/secrets/".length))
            break

        case 400:
            errors = await response.json()
            break

        case 401:
            errors = await response.json()
            break

        case 422:
            errors = ["invalidSecret"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors, id)
}

//---------delete
module.exports.deleteSecretById = async (id, callback) => {

    let response

    try {
        response = await sendRequest("DELETE", "/secrets/" + id)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []

    switch (response.status) {

        case 204:
            break

        case 401:
            errors = await response.json()
            break

        case 404:
            errors = ["notFound"]
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors)
}

//---------get all secrets
module.exports.getAllSecrets = async (callback) => {

    let response

    try {
        response = await sendRequest("GET", "/secrets")
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let secrets = []

    switch (response.status) {

        case 200:
            secrets = await response.json()
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors, secrets)

}

//---------get secrets by user
module.exports.getSecretsByAccountId = async (accountId, callback) => {

    let response

    try {
        response = await sendRequest("GET", "/secrets/" + accountId)
    } catch (errors) {
        callback(errors)
        return
    }

    let errors = []
    let secrets = []

    switch (response.status) {

        case 200:
            secrets = await response.json()
            break

        case 500:
            errors = ["backendError"]
            break

        default:
            displayError(response)

    }

    callback(errors, secrets)
}







