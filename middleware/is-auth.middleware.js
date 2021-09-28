const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authAdminHeader = req.get('Authorization');
    if (!authAdminHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authAdminHeader.split(' ')[1]; // Bearer token
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedAdminToken;
    try {
        decodedAdminToken = jwt.verify(token, 'somesupersecrettokenkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedAdminToken) {
        req.isAuth = true;
        req.adminId = decodedAdminToken.adminId;
        return next();
    }
    const authPatronHeader = req.get('Authorization');
    if (!authPatronHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authPatronHeader.split(' ')[1]; // Bearer token
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedPatronToken;
    try {
        decodedPatronToken = jwt.verify(token, 'somesupersecrettokenkey');
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedPatronToken) {
        req.isAuth = true;
        req.patronId = decodedPatronToken.patronId;
        next();
    }
}