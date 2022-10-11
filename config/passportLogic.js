//file contains passport logic for local login
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/user')
const localAuth = (passport) => {
    //passport.use() function that uses the LocalStrategy() for username and password based authentication.
    passport.use(
        /*
        passport has many strategies we could use, but we’ll be using the local-strategy — which basically does username and password authentication.
         */
        new LocalStrategy(
        { usernameField: 'email' }, async(email, password, done) => {
            try {
                const user = await User.findOne({ email: email }) 
                
                if (!user) {
                    return done(null, false, { message: 'Incorrect email' });
                }
                //validate password
                const valid = await user.validPassword(password)
                if (!valid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (error) {
                return done(error)
            }
        }
    ));
    /*
    passport.serializeUser() and passport.deserializeUser() helps in order to support login sessions. 
    Passport will serialize and deserialize user instances to and from the session.
     */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
        
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
module.exports = {
    localAuth
}