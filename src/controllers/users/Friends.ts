import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";

const request = require("request");
const config = require("../../config/config.json");

export default class Friends {
    public static async GET(req: any, res: any): Promise<void> {
        try {

            const friends = await Friends.GetFriends(req, res);

            Responses.Send(req, res, "user/friends", `Friends | Quaver`, {
                friends: friends
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    private static async GetFriends(req: any, res: any): Promise<any> {
        const friends = await API.GET(req, `v1/relationships/friends/online`);

        return friends.friends;
    }

    public static async POST(req: any, res: any): Promise<void> {
        try {
            const token = await API.GetToken(req);

            let headers: any = {};

            if (token)
                headers["Authorization"] = `Bearer ${token}`;

            if (req.body && req.body.id !== undefined) {
                request.post(`${config.apiBaseUrl}/v1/relationships/friends/remove/${req.body.id}`, {
                    headers: headers
                }, function (error, response, body) {
                    console.log(body);
                });

                req.flash('success', 'Friend removed successfully!');
            } else {
                req.flash('error', 'Something went wrong!');
            }

            res.redirect(301, `/friends`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async AddFriendPOST(req: any, res: any): Promise<void> {
        try {
            const token = await API.GetToken(req);

            let headers: any = {};

            if (token)
                headers["Authorization"] = `Bearer ${token}`;

            if (req.body && req.body.id !== undefined) {
                request.post(`${config.apiBaseUrl}/v1/relationships/friends/add/${req.body.id}`, {
                    headers: headers
                }, function (error, response, body) {
                    console.log(body);
                });

                res.redirect(301, `/user/${req.body.id}`);
            } else {
                res.redirect(301, `/user/-1`);
            }
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

}