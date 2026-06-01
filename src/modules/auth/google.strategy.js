const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const pool = require("../../config/db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const username =
          profile.displayName || profile.emails[0].value.split("@")[0];

        // check if user exists
        let user = await pool.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);

        // create user
        if (user.rows.length === 0) {
          user = await pool.query(
            `
            INSERT INTO users
            (username, email, google_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [username, email, profile.id],
          );
        }

        // login user
        return done(null, user.rows[0]);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
