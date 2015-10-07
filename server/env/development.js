module.exports = {
  "DATABASE_URI": "mongodb://localhost:27017/reelcool",
  "SESSION_SECRET": "Optimus Prime is my real dad",
  "TWITTER": {
    "consumerKey": "Hw3GnG8A1PpzxcW7aCKLWxvpN",
    "consumerSecret": "IcJvqO5zGNtuS7qB08q3P3RdegsJEI8Rj2uyLkIla0YcHwG7zD",
    "callbackUrl": "http://127.0.0.1:1337/auth/twitter/callback" // twitter doesn't like localhost. to test it locally you'll need to have 127.0.0.1 in your address bar as well (instead of localhost).
  },
  "FACEBOOK": {
    "clientID": "187534398246831",
    "clientSecret": "26461318315ebe640696dfbacbcc2821",
    "callbackURL": "http://localhost:1337/auth/facebook/callback"
  },
  "GOOGLE": {
    "clientID": "762218954684-qcmnv52fe0ivcvb12vr24hqdcepjj7v5.apps.googleusercontent.com",
    "clientSecret": "e5pFlmGOXCn-jB_lLHiufE4M",
    "callbackURL": "http://localhost:1337/auth/google/callback"
  }, 
  "INSTAGRAM": {
    "clientID": "4405115650ae467f8ae4b7a7dd936320", 
    "clientSecret": "be8088c1a6f447fa9fa2bb7c8eac154e", 
    "callbackURL": "http://localhost:1337/auth/instagram/callback"
  }
};