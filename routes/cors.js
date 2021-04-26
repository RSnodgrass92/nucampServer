const cors = require("cors")

const whitelist= ['http://localhost:3000','https://localhost:3443']
const corsOptionsDelegate = (req, callback) => {
    let corsOptions 
    console.log(req.header('Origin'))
    if(whitelist.indexOf(req.header('Origin')) !== -1)
    {
        corsOptions = { origin: true }
    }
    else
    {
        corsOptions = { origin: false}
    }
    callback(null, corsOptions)
}

//apply this to the endpoints that we are okay with all cross origin requests
exports.cors = cors()

//apply this to the endpoints that we are only okay with the cross origin requests from the sources we have whitelisted
exports.corsWithOptions = cors(corsOptionsDelegate)