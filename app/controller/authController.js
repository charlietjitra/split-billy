import passport from '../config/passport.js';

export const googleAuth = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
};

export const googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
        if (err) return next(err);

        if (!user) return res.redirect('/');

        res.clearCookie('token');
        res.cookie('token', user.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });

        res.redirect('/split/new');
    })(req, res, next);
};
