(function (authenticator) {
    var Promise = require("bluebird");
    const redis = Promise.promisifyAll(require("redis"));
    const client = redis.createClient(`redis://${process.env.DB}`);
    var backend;

    authenticator.auth = function (connectcode) {
        /*Yes I know this code is dumb, it sets the backend and reads it right back...
         * It's just for testing purposes, once the backends support advertising
         * through the Redis DB, you can remove the set and expire and it will
         * auto-connect to whatever backend is designated to service a request*/
        client.setAsync(connectcode, process.env.BACKEND_SERVER).then(
            function () {
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