'use strict';
const axios = require('axios');
const BearerStrategy = require('passport-http-bearer').Strategy;
const User  = require('../models/User');

function hookBearerStrategy(passport) {
    passport.use(new BearerStrategy(
        async function(token, done) {
            try {
                const response = await axios.get(
                    "https://api.spotify.com/v1/me",
                    {
                        headers: {
                            "Authorization" : `Bearer ${token}`
                        }
                    }
                )
                if (response){
                    User.findOne({
                        where:{
                            spotify_id: response.data.id
                        }
                    }).then(
                        res => {
                            if (!res){
                                var user = {
                                    spotify_id: response.data.id,
                                    birthdate: response.data.birthdate,
                                    country: response.data.country,
                                    display_name: response.data.display_name,
                                    email: response.data.email,
                                    href: response.data.href,
                                    product: response.data.product,
                                    type: response.data.type,

                                }
                                response.data.images.length != 0 ? user['photo'] = response.data.images[0].url : null
                                User.create(user).then(
                                    user => {
                                        if (!user) { return done(null, false); }
                                        user.dataValues.token = token
                                        return done(null, user, { scope: 'all' });
                                    }
                                )
                            }
                            else{
                                res.dataValues.token = token
                                return done(null, res, { scope: 'all' });
                            }
                        }
                    )
                }

                else{
                    // console.log(response.responseonse.config.responseonse)
                    done(response.response);
                }
            }
            catch (e) {
                console.log(`catch ${e}`)
                return done(e)
            }


        }
    ))

}

module.exports = hookBearerStrategy;