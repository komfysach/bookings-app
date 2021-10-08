const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authUserHeader = req.get('Authorization');
    if (!authUserHeader) {
        req.isAuth = false;
        return next();
    }
    const tokenUser = authUserHeader.split(' ')[1]; // Bearer token
    if (!tokenUser || tokenUser === '') {
        req.isAuth = false;
        return next();
    }
    let decodedUserToken;
    try {
        decodedUserToken = jwt.verify(tokenUser, 'somesupersecrettokenkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedUserToken) {
        req.isAuth = true;
        req.UserId = decodedUserToken.UserId;
        return next();
    }
}