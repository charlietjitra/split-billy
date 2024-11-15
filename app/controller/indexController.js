export const getLandingPage = (req, res) => {
    res.render('index');
};

export const getRegisterPage = (req,res) => {
    res.render('register');
}

export const userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err); 
        res.clearCookie('token');
        req.session.destroy((err) => {
            if (err)  return next(err); 
            res.redirect('/');
        });
    });
};
