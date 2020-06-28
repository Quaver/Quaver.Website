# Quaver.Website

The front-end website for Quaver.

# Seting Up

* Install the dependencies using `npm install`
* Compile the project using `tsc`
* Create a `config` folder in the `dist` directory and copy the `config.example.json` file renamed to `config.json`
* Fill in the appropriate configuration details
* Run using `node index.js`

**Note:** Quaver.Website often makes calls to Quaver's API server. Some endpoints may require JWT authentication for logged in users. Because of this, **the jwtSecret property in config must be matching that of the API server. Be sure to keep this value a secret.**

# License
This project is licensed under the [AGPL-3.0](https://github.com/Swan/Quaver.Website/blob/master/LICENSE) license.
