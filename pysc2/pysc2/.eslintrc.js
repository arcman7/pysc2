module.exports = {
    "extends": [
        "airbnb-base",
        "plugin:vue/recommended"
    ],
    "plugins": [
        "import"
    ],
    "rules": {
        "comma-dangle": 0,
        "valid-jsdoc": 0,
        "eqeqeq": 0,
        "dot-notation": 0,
        "spaced-comment": 0,
        "no-var": 0,
        "import/no-mutable-exports": 0,
        "indent": ["error", 4],
        "space-before-function-paren": 0,
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,
        "no-bitwise": 0,
        "object-shorthand": 0,
        "no-console": 0,
        "no-param-reassign": [2, { "props": false }],
        "quote-props": 0,
        "consistent-return": 0,
        "guard-for-in": 0,
        "no-plusplus": 0,
        "prefer-arrow-callback": 0,
        "import/extensions": ["error", "never", { "packages": "always" }],
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "linebreak-style": 0,
        "max-len": "off",
        "vue/no-side-effects-in-computed-properties": 0,
        "vue/html-indent": 0,
        "vue/html-self-closing": 0,
        "vue/html-closing-bracket-newline": 0,
        "vue/attribute-hyphenation": 0,
        "camelcase": 0,
    },
    "env": {
        "browser": true,
        "jquery": true,
        "jest": true
    },
    "globals": {
        "Vue": true
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": "build/webpack.dev.config.js"
            }
        }
    }
};
