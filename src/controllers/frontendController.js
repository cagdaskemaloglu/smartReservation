// AnaSayfa
const getIndexPage = async (req, res) => {
    res.render('index', { 
        pageTitle: 'Rezervasyon Sistemi' 
    });
};

// Giriş Sayfası
const getLoginPage = (req, res) => {
    res.render('login', {
        pageTitle: 'Giriş Yap'
    });
};

// Raporlar Sayfası
const getReportsPage = (req, res) => {
    res.render('reports', {
        pageTitle: 'Reports'
    });
};

module.exports = { getIndexPage, getLoginPage, getReportsPage };