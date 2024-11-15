import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    const token = req.cookies.token;
    
    if (!token) return res.redirect('/');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/');
        req.user = user; 
        next(); // go to the next middlware/route
    });
}
