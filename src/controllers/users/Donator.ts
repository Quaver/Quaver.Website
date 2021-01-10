import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";

const request = require("request");
const config = require("../../config/config.json");

export default class Donator {
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const user = await Donator.FetchUser(req, req.user.id);

            Responses.Send(req, res, "user/settings-donator", `Donator Settings | Quaver`, {
                bio: user.info.userpage,
                canChange: user.change,
                discord: config.discord.discordUrl
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

            if (req.body) {
                let response: any = null;

                if (req.body.submitAboutme !== undefined) {
                    if (req.body.aboutme.length > 3000) {
                        req.flash('error', 'Your userpage must not be greater than 3,000 characters.');
                    } else {
                        response = await new Promise(resolve => {
                            request.post(`${config.apiBaseUrl}/v1/users/profile/userpage`, {
                                form: {
                                    userpage: req.body.aboutme.trim()
                                },
                                headers: headers,
                                json: true
                            }, function (error, response, body) {
                                resolve(body);
                            });
                        }).then(body => body);
                    }
                } else if (req.body.submitCover !== undefined) {
                    if (req.files && req.files.profile_cover) {
                        req.files.profile_cover.data = Buffer.from(req.files.profile_cover.data).toString("base64");

                        response = await new Promise(resolve => {
                            request.post(`${config.apiBaseUrl}/v1/users/profile/cover`, {
                                form: {
                                    cover: req.files.profile_cover
                                },
                                headers: headers,
                                json: true
                            }, function (error, response, body) {
                                resolve(body);
                            });
                        }).then(body => body);
                    }
                } else if (req.body.submitUsername !== undefined) {
                    response = await new Promise(resolve => {
                        request.post(`${config.apiBaseUrl}/v1/users/profile/username`, {
                            form: {
                                username: req.body.username
                            },
                            headers: headers,
                            json: true
                        }, function (error, response, body) {
                            resolve(body);
                        });
                    }).then(body => body);
                }

                if (response) {
                    if (response.status == 200) req.flash('success', response.message);
                    else if (response.message) req.flash('error', response.message);
                    else if (response.error) req.flash('error', response.error);
                }
            }

            res.redirect(301, `/settings/donator`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    static async FetchUser(req: any, id: any): Promise<any> {
        const response = await API.GET(req, `v1/users/full/${id}`);

        if (response.status != 200)
            return null;

        response.user.change = await API.GET(req, `v1/users/profile/username`);

        return response.user;
    }
}