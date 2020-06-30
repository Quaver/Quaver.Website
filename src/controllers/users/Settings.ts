import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";
import Users from "./Users";

const request = require("request");
const config = require("../../config/config.json");

export default class Settings {
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const user = await Users.FetchUser(req, req.user.id, 1);

            Responses.Send(req, res, "user/settings", `Settings | Quaver`, {
                bio: user.info.userpage
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    public static async POST(req: any, res: any): Promise<void> {
        try {
            const token = await API.GetToken(req);

            let headers: any = {};

            if (token)
                headers["Authorization"] = `Bearer ${token}`;

            if (req.body && req.body.aboutme !== undefined) {
                if (req.body.aboutme.length > 3000) {
                    req.flash('error', 'Your userpage must not be greater than 3,000 characters.');
                } else {
                    request.post(`${config.apiBaseUrl}/v1/users/profile/userpage`, {
                        form: {
                            userpage: req.body.aboutme.trim()
                        },
                        headers: headers
                    }, function (error, response, body) {
                        console.log(body);
                    });
                }
            }

            if (req.files && req.files.profile_cover) {
                headers["Content-Type"] = "multipart/form-data";

                req.files.profile_cover.data = Buffer.from(req.files.profile_cover.data).toString("base64");

                request.post(`${config.apiBaseUrl}/v1/users/profile/cover`, {
                    form: {
                        cover: req.files.profile_cover
                    },
                    headers: headers
                }, function (error, response, body) {
                    console.log(body);
                });
            }

            req.flash('success', 'Settings is updated!');

            res.redirect(301, `/settings`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}