const User = require('../model/userModel');
const generateToken = require('../utils/generateToken');
  
//Kullanıcı kaydı
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    // email kontrolü
    if (userExists) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
    }

    // Parola hashleme userModel pre-save hook ile otomatik
    const user = await User.create({ name, email, password, role });

    if (user) {
        res.status(201).json({
            _id: user._id, 
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Geçersiz kullanıcı' });
    }
};

// Kullanıcı girişi 
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }else {
        res.status(401).json({ message: 'Geçersiz e-posta veya parola' }); // Yetkisiz
    }
};

const getUserProfile = async (req, res) => {
    const user = req.user;

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // admin || user
        });
    } else {
        res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }
};

module.exports = { registerUser, authUser, getUserProfile };
