const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const protect = async (req, res, next) => {
    let token;

    // Header'da 'Bearer Token' formatını kontrol et
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1]; //token al

            const decoded = jwt.verify(token, process.env.JWT_SECRET); //token doğrula

            req.user = await User.findById(decoded.id).select('-password'); //token id ile user bul, pass alma

            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token geçersizz veya süresi dolmuş'}); // yetkisiz
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Token bulunamadı, yetkilendirme başarısız'}); // yetkisiz
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Bu işlem için yetkiniz yok'}); // yetkisiz
    }
};

module.exports = { protect, admin };