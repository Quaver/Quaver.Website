import Responses from "../../utils/Responses";
import SqlDatabase from "../../database/SqlDatabase";
import EnvironmentHelper from "../../utils/EnvironmentHelper";
const passport = require("passport");
const LocalStrategy = require("passport-local");
const openid = require("openid");
const request = require('request');
const config = require("../../config/config.json");

export default class Login {
    /**
     * Relying party for the openid
     */
    public static RelyingParty: any = null;

    /**
     * Initializes the login handler/relying party for Steam OpenID
     * @constructor
     */
    public static Initialize(): void {
        Login.RelyingParty = new openid.RelyingParty(`${config.baseUrl}/login/verify`, config.baseUrl, true, true, []);
    }

    /**
     * Redirects the user to log into Steam
     * 
     * Route: /login
     * @constructor
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const referer = req.header('Referer');
            if(referer === undefined) {
                res.cookie('currentPage', EnvironmentHelper.baseUrl(), {
                    maxAge: 24 * 60 * 60
                });
            } else {
                res.cookie('currentPage', referer, {
                    maxAge: 24 * 60 * 60
                });
            }

            const url = await Login.Authenticate();
            return res.redirect(url);
        } catch (err) {
            console.error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Logs the user out
     * @param req
     * @param res
     * @constructor
     */
    public static async LogoutGET(req: any, res: any): Promise<void> {
        req.logout();
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    }
    
    /**
     * Verifies the user's login
     * 
     * Route: /verify
     * @param req
     * @param res
     * @constructor
     */
    public static async VerifyGET(req: any, res: any): Promise<void> {
        try {
            const verification = await Login.VerifyAssertion(req);
            
            // Make sure the user is properly authenticated
            if (!verification.authenticated)
                return Responses.Return401(req, res);

            const steamId = verification.claimedIdentifier.replace('https://steamcommunity.com/openid/id/', "");
            
            // Get the user by steam id.
            const result = await SqlDatabase.Execute("SELECT * FROM users WHERE steam_id = ? LIMIT 1", [steamId]);
            
            if (result.length == 0)
                return Responses.Return401(req, res);
            
            const user = result[0];
            
            // Prevent ban users from logging in
            if (!user.allowed)
                return Responses.Return401(req, res);

            req.login(user, (err: any)  => {
                if (err) {
                    console.error(err);
                    return Responses.Return401(req,  res);
                } 

                if(req.cookies.currentPage !== undefined)
                    return res.redirect(req.cookies.currentPage);
                else
                    return res.redirect("/");
            });
            
        } catch (err) {
            console.error(err);
            return res.send("no");
        }
    }
    
    /**
     * Retrieves an authentication URL to log into Steam.
     * @constructor
     */
    public static async Authenticate(): Promise<any> {
        return new Promise((resolve, reject) => {
            Login.RelyingParty.authenticate("http://steamcommunity.com/openid", false, (err: any, url: any) => {
                if (err)
                    console.error(err);

                if (err || !url)
                    return resolve(undefined);

                return resolve(url);
            });
        });
    }

    /**
     * Verifies that an incoming login request user is who they claim to be.
     * @param req
     * @constructor
     */
    public static async VerifyAssertion(req: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Login.RelyingParty.verifyAssertion(req, (err: any, result: any) => {
                if (err)
                    return reject(err);

                if (!result || !result.authenticated)
                    return reject("Failed to authenticate user");

                return resolve(result);
            });
        });
    }
    
    public static ConfigurePassport(): void {
        passport.serializeUser((user: any, done: any) => {
            done(null, user);
        });

        passport.deserializeUser(async (user: any, done: any) => {
            const result = await SqlDatabase.Execute("SELECT * FROM users WHERE id = ? AND allowed = 1 LIMIT 1", [user.id]);
            
            if (result.length == 0)
                return done(null, false);
            
            return done(null, result[0]);
        });
    } 
}