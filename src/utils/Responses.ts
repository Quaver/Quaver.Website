import * as express from "express";
import UserHelper from "./UserHelper";
import UserGroups from "../enums/Usergroups";
import TimeHelper from "./TimeHelper";
import EnvironmentHelper from "./EnvironmentHelper";
import Privileges from "../enums/Privileges";
import ColorHelper from "./ColorHelper";

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
            baseUrl: EnvironmentHelper.baseUrl,
            apiBaseUrl: EnvironmentHelper.apiBaseUrl,
            assets: EnvironmentHelper.assets,
            title,
            currentUser: req.user,
            HasGroup: UserHelper.HasGroup,
            HasPrivilege: UserHelper.HasPrivilege,
            CanAccessDashboard: UserHelper.CanAccessDashboard,
            UserGroups: UserGroups,
            Privileges: Privileges,
            formatDateDistance: TimeHelper.formatDateDistance,
            formatDate: TimeHelper.formatDate,
            formatTime: TimeHelper.formatTime,
            ratingColor: ColorHelper.RatingColor,
            flash: req.flash()
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
        res.status(400);

        Responses.Send(req, res, "404", "Bad Request | Quaver", {
            code: 400,
            text: 'Bad Request'
        });
    }

    /**
     * Returns a 401 (Unauthorized) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return401(req: express.Request, res: express.Response): void {
        res.status(401);

        Responses.Send(req, res, "404", "Unauthorized | Quaver", {
            code: 401,
            text: 'Unauthorized'
        });
    }

    /**
     * Returns a 422 (UNPROCESSABLE ENTITY) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return422(req: express.Request, res: express.Response): void {
        res.status(422);

        Responses.Send(req, res, "404", "Unprocessable Entity | Quaver", {
            code: 422,
            text: 'Unprocessable Entity'
        });
    }

    /**
     * Returns a 500 (Internal Server Error) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return500(req: express.Request, res: express.Response): void {
        res.status(500);

        Responses.Send(req, res, "404", "Internal Server Error | Quaver", {
            code: 500,
            text: 'Internal Server Error'
        });
    }

    /**
     * Returns a 403 (Forbidden) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return403(req: express.Request, res: express.Response): void {
        res.status(403);

        Responses.Send(req, res, "404", "Forbidden | Quaver", {
            code: 403,
            text: 'Forbidden'
        });
    }

    /**
     * Returns a 412 (Request entity too large) to the user.
     * @param req
     * @param res
     * @constructor
     */
    public static Return413(req: express.Request, res: express.Response): void {
        res.status(413);

        Responses.Send(req, res, "404", "Request entity too large | Quaver", {
            code: 413,
            text: 'Request entity too large'
        });
    }

    /**
     * Returns a 401 in regards to a JWT authentication error
     * @param req
     * @param res
     * @constructor
     */
    public static Return401Jwt(req: express.Request, res: express.Response): void {
        res.status(401);

        Responses.Send(req, res, "404", "Your authentication token is either invalid or expired. | Quaver", {
            code: 401,
            text: 'Your authentication token is either invalid or expired.'
        });
    }

    /**
     * User Not Found
     * @param req
     * @param res
     * @constructor
     */
    public static ReturnUserNotFound(req: express.Request, res: express.Response): void {
        res.status(404);

        Responses.Send(req, res, "404", "User Not Found | Quaver", {
            code: 404,
            text: 'User Not Found'
        });
    }

    /**
     * Mapset Not Found
     * @param req
     * @param res
     * @constructor
     */
    public static ReturnMapsetNotFound(req: express.Request, res: express.Response): void {
        res.status(404);

        Responses.Send(req, res, "404", "Mapset Not Found | Quaver", {
            code: 404,
            text: 'Mapset Not Found'
        });
    }

    /**
     * Playlist Not Found
     * @param req
     * @param res
     * @constructor
     */
    public static ReturnPlaylistNotFound(req: express.Request, res: express.Response): void {
        res.status(404);

        Responses.Send(req, res, "404", "Playlist Not Found | Quaver", {
            code: 404,
            text: 'Playlist Not Found'
        });
    }

    /**
     * Playlist Not Found
     * @param req
     * @param res
     * @constructor
     */
    public static ReturnMultiplayerNotFound(req: express.Request, res: express.Response): void {
        res.status(404);

        Responses.Send(req, res, "404", "Multiplayuer Game Not Found | Quaver", {
            code: 404,
            text: 'Multiplayuer Game Not Found'
        });
    }
}