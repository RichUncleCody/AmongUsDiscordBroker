(function (authenticator) {
    var Promise = require("bluebird");
    const redis = Promise.promisifyAll(require("redis"));
    const client = redis.createClient(`redis://${process.env.DB}`);
    var backend;

    authenticator.auth = function (connectcode) {
 /*       console.log(`Client is ${client.connected}`);
        //Add lookups and errorhandling later
        client.set(connectcode, process.env.BACKEND_SERVER, function () {
            console.log("Set connect code on DB");
            client.expire(connectcode, 60);
            client.get(connectcode, function (err, result) {
                console.log("Received connect code from DB");
                if (backend = result) {
                    console.log(`Found backend server at: ${process.env.BACKEND_SERVER}`);
                } else {
                    backend = "fail";
                }
            });
        });
        console.log(`Waiting...`);
        while (!backend) { }
        if (backend == "fail") {
            console.log(`background returned: ${background}`)
            return null;
        } else {
            console.log(`background returned: ${background}`)
            return backend;
        }*/

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