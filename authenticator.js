(function (authenticator) {
    var Promise = require("bluebird");
    const redis = Promise.promisifyAll(require("redis"));
    const client = redis.createClient(`redis://${process.env.DB}`);
    var backend;

    authenticator.auth = function (connectcode) {
        client.setAsync(connectcode, process.env.BACKEND_SERVER).then(
            function () {
                console.log("Set connect code on DB");
                client.expire(connectcode, 60);
                client.getAsync(connectcode).then(
                    function (result) {
                        console.log(`Backend lookup: ${result}`)
                        backend = result;
                    }
                )
            }
        )
        return backend;
    }
    authenticator.authenticated = () => {
        return backend;
    }
})(module.exports);