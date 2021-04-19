import Responses from "../../utils/Responses";
import Jwt from "../../utils/Jwt";
const config = require("../../config/config.json");

export default class Oauth2 {
    public static async Authorize(req: any, res: any): Promise<void> {
        const redirectUrl = req.query.redirect_url;

        if (redirectUrl == undefined || redirectUrl == "") {
            return res.status(404).json({status: 404, error: "No Redirect URL provided!"});
        }

        try {
            const site = new URL(redirectUrl).hostname;

            Responses.Send(req, res, "authorize", "Authorize | Quaver", {
                redirectUrl: redirectUrl,
                site: site
            });
        } catch (e) {
            return res.status(404).json({status: 404, error: "Redirect URL invalid!"});
        }
    }

    public static async POST(req: any, res: any): Promise<void> {
        const redirectUrl = req.body.redirect_url;

        if (redirectUrl == undefined || redirectUrl == "") {
            return res.status(404).json({status: 404, error: "No Redirect URL provided!"});
        }

        try {
            const site = new URL(redirectUrl);

            const token = await Jwt.Sign({
                user: {
                    id: req.user.id,
                    steam_id: req.user.steam_id,
                    username: req.user.username,
                    avatar: req.user.avatar_url
                },
            }, config.jwtSecret, "30s");

            site.searchParams.append("token", token);

            res.redirect(site);
        } catch (e) {
            return res.status(404).json({status: 404, error: "Redirect URL invalid!"});
        }

    }

    public static async VerifyToken(req: any, res: any): Promise<void> {
        const token = req.body.token;

        if (token == undefined || token == "") {
            return res.status(404).json({status: 404, error: "No Token provided!"});
        }

        const result = await Jwt.Verify(token, config.jwtSecret);

        if (result !== undefined) {
            return res.status(200).json({status: 200, data: result});
        }

        return res.status(404).json({status: 404, error: "Token expired or invalid!"});
    }
}