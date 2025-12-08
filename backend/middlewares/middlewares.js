const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { signupSchema, signinSchema, updateInfoSchema } = require("./input-check");

// Signup input validation
function validateSignup(req, res, next) {
    const payload = req.body;
    const parsedPayload = signupSchema.safeParse(payload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            msg : "You sent wrong inputs while signup :("
        })
    }

    next();
}

// Signin input validation
function validateSignin(req, res, next) {
    const payload = req.body;
    const parsedPayload = signinSchema.safeParse(payload);

    if(!parsedPayload.success) {
        return res.status(400).json({
            msg : "You sent wrong inputs while signin :("
        });
    }

    next();
}

// Authorization middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({
            msg : "Authorization Headers are missing :("
        });
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        if(!userId) {
            return res.status(403).json({
                msg : "Token invalid :("
            });
        }

        // Put the userId in the request object
        req.userId = decoded.userId;
        next();

    } catch(err) {
        console.log("Something went wrong while authorization :(");
        console.error(err);
        return res.status(403).json({
            msg : "Something went wrong while authorization :("
        });
    }
}

// update info input validation
function validateUpdateInfo(req, res, next) {
    const payload = req.body;
    const parsedPayload = updateInfoSchema.safeParse(payload);
    if(!parsedPayload.success) {
        return res.status(400).json({
            msg : "You sent wrong inputs for update :("
        });
    }

    next();
}

module.exports = {
    validateSignup, validateSignin, authMiddleware, validateUpdateInfo, 
}