    const jwt = require("jsonwebtoken");

    async function isAuthenticated(req, res, next) {
        try {
            const token = req.header("Authorization").split(" ")[1];
            // Bearer <token>.split(" "),
            // ["Bearer", "<token>"]

            jwt.verify(token, "secret", (err, user) => {
                if (err) {
                    return res.json({ message: "Invalid token" });
                }
                req.user = user;
                next();
            });
        } catch (err) {
            return res.status(401).json({ message: "Authorization failed" });
        }
    }

    module.exports = isAuthenticated;
