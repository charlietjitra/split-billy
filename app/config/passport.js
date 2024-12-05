import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/userSchema.js  ";

dotenv.config();

const callbackURL = process.env.NODE_ENV ===  'production'? process.env.CALLBACK_URL_PROD : process.env.CALLBACK_URL_DEV 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    proxy : "true",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  async (accessToken, refreshToken, profile, done) => {
    try{
      let user = await User.findOne({ googleID: profile.id });
    
      //user doesnt exist
      if(!user){
        user = new User({
          googleID : profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          createdAt: new Date()
        });
        await user.save()
      }

      const userPayload = {
        id: user._id,
        googleID: user.googleID,
        name: user.name,
        email: user.email
      };
      // Generate JWT
      const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return done(null, { user, token });
    }catch(err){
      return done(err,null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
