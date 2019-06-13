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
                ).then((resp) => {
                        if (resp){

                            User.findOne({
                                where:{
                                    spotify_id: resp.data.id
                                }
                            }).then(
                                res => {
                                    if (!res){
                                        var user = {
                                            spotify_id: resp.data.id,
                                            birthdate: resp.data.birthdate,
                                            country: resp.data.country,
                                            display_name: resp.data.display_name,
                                            email: resp.data.email,
                                            href: resp.data.href,
                                            product: resp.data.product,
                                            type: resp.data.type,

                                        }
                                        resp.data.images.length != 0 ? user['photo'] = resp.data.images[0].url : null
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
                            // console.log(resp.response.config.response)
                            done(resp.response);
                        }




                    },
                    (error) => {
                        console.log(error)
                        if (error) { return done(error); }

                    }
                );
            }
            catch (e) {
                console.log(e)
                return done(e)
            }


        }
    ))

}

module.exports = hookBearerStrategy;