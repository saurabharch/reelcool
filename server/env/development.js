module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/fsg-app",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "INSERT_TWITTER_CONSUMER_KEY_HERE",
    "consumerSecret": "INSERT_TWITTER_CONSUMER_SECRET_HERE",
    "callbackUrl": "INSERT_TWITTER_CALLBACK_HERE"
  },
  "FACEBOOK": {
    "clientID": "187529994913938",
    "clientSecret": "f04793b66d68d99cd5afe5446ade0262",
    "callbackURL": "http://localhost:1337/auth/facebook/callback"
  },
  "GOOGLE": {
    "clientID": "762218954684-qcmnv52fe0ivcvb12vr24hqdcepjj7v5.apps.googleusercontent.com",
    "clientSecret": "e5pFlmGOXCn-jB_lLHiufE4M",
    "callbackURL": "http://localhost:1337/auth/google/callback"
  }
};