var jwt = require("jsonwebtoken");
//a secret key for jwt token sign
const JWT_SECRET = "meriMazry$123";


const fetchuser = (req, res, next)=>{
    //get the user from the jwt token and add id to req object
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid Token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid Token" });

    }


}

module.exports = fetchuser;