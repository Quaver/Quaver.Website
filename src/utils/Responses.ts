import * as express from "express";
import UserHelper from "./UserHelper";
import UserGroups from "../enums/Usergroups";
import TimeHelper from "./TimeHelper";

const config = require("../config/config.json");

export default class Responses {
    /**
     * 
     * @param req 
     * @param res 
     * @param template 
     * @param title 
     * @param data 
     */
    public static Send(req: any, res: express.Response, template: string, title: string, data: any) {
        // Build the object of data that will be sent to be use in the template.
        const templateData = { 
            baseUrl: config.baseUrl,
            title, 
            currentUser: req.user,
            HasGroup: UserHelper.HasGroup,
            UserGroups: UserGroups,
            formatDateDistance: TimeHelper.formatDateDistance,
            formatDate: TimeHelper.formatDate
        };

        Object.assign(templateData, data);
        return res.render(template, templateData);
    }

    /**
     * Returns a 400 (Bad Request) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return400(req: express.Request, res: express.Response): void {
        res.status(400).json({
            status: 400,
            error: "Bad Request."
        });
    }

    /**
     * Returns a 401 (Unauthorized) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return401(req: express.Request, res: express.Response): void {
        res.status(401).json({
            status: 401,
            error: "Unauthorized"
        });
    }

    /**
     * Returns a 422 (UNPROCESSABLE ENTITY) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return422(req: express.Request, res: express.Response): void {
        res.status(422).json({
            status: 422,
            error: "Unprocessable Entity"
        });
    }
    
    /**
     * Returns a 500 (Internal Server Error) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return500(req: express.Request, res: express.Response): void {
        res.status(500).json({
            status: 500,
            error: "Internal Server Error"
        });
    }

    /**
     * Returns a 403 (Forbidden) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return403(req: express.Request, res: express.Response): void {
        res.status(403).json({
            status: 403,
            error: "Forbidden"
        });
    }

    /**
     * Returns a 412 (Request entity too large) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return413(req: express.Request, res: express.Response): void {
        res.status(413).json({
            status: 413,
            error: "Request entity too large"
        });
    }

    /**
     * Returns a 401 in regards to a JWT authentication error
     * @param req
     * @param res
     * @constructor
     */
    public static Return401Jwt(req: express.Request, res: express.Response): void {
        res.status(401).json({
            status: 401,
            error: "Your authentication token is either invalid or expired."
        });
    }
}