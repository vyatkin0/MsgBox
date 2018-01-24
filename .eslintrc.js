module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "plugins": ["prettier"],

    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "prettier/prettier": "error"
    }
};