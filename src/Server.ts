import express from "express";
import Router from "./router/Router";
import path from "path";
import Logger from "./logging/Logger";
import Login from "./controllers/login/Login";

const bodyParser = require("body-parser");
const passport = require("passport");
const config = require("./config/config.json");
const twig = require("twig");

export default class Server {
    /**
     * The port the server will run on
     */
    public Port: Number;

    /**
     * The express server
     */
    public ExpressApp: express.Application;

    /**
     * @param port 
     */
    constructor(port: number) {
        this.Port = port;
        this.ExpressApp = express();

        this.InitializeServer();
    }

    /**
     * Initializes and runs the server.
     * @constructor
     */
    private InitializeServer(): void {
        this.ExpressApp.use(express.static(path.join(__dirname, "../src/static")));
        this.ExpressApp.set("views", path.join(__dirname, "../src/views"));
        this.ExpressApp.set("twig options", {
            allow_async: true
        });

        this.ExpressApp.set("view engine", "twig");
        this.ExpressApp.set("view options", { layout: false });

        if (this.ExpressApp.get('env') === 'development') {
            twig.cache(false);
        }

        this.ExpressApp.use(bodyParser.json());
        this.ExpressApp.use(bodyParser.urlencoded({extended: true}));

        this.ExpressApp.use(require('express-session')({ secret: config.expressSessionSecret, resave: true, saveUninitialized: true }));
        
        Login.Initialize();
        Login.ConfigurePassport();
        
        this.ExpressApp.use(passport.initialize());
        this.ExpressApp.use(passport.session());

        this.ExpressApp.disable('x-powered-by');
        
        this.ExpressApp.use("/", Router.InitializeRouter(this.ExpressApp));
        this.ExpressApp.listen(this.Port, () => Logger.Success(`Quaver.Website server has started on port: ${config.port}`));
    }
}