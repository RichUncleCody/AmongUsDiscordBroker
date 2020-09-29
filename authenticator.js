(function (authenticator) {
    authenticator.auth = function (connectcode, authenticated) {
        //Add lookups and errorhandling later
        console.log(`Found backend server at: ${process.env.BACKEND_SERVER}`);
        return process.env.BACKEND_SERVER;
    }
})(module.exports);