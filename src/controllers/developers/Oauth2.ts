import Responses from "../../utils/Responses";
import Jwt from "../../utils/Jwt";
import Applications from "./Applications";

export default class Oauth2 {
    public static async Authorize(req: any, res: any): Promise<void> {
        const redirectUrl = req.query.redirect_uri;
        const clientId = req.query.client_id;

        if (clientId == undefined || clientId == "") {
            return res.status(404).json({status: 404, error: "No Client ID provided!"});
        }

        if (redirectUrl == undefined || redirectUrl == "") {
            return res.status(404).json({status: 404, error: "No Redirect URL provided!"});
        }

        try {
            const site = new URL(redirectUrl).hostname;

            Responses.Send(req, res, "authorize", "Authorize | Quaver", {
                redirectUrl: redirectUrl,
                clientId: clientId,
                site: site
            });
        } catch (e) {
            return res.status(404).json({status: 404, error: "Redirect URL invalid!"});
        }
    }

    public static async POST(req: any, res: any): Promise<void> {
        const clientId = req.body.client_id;

        if (clientId == undefined || clientId == "") {
            return res.status(404).json({status: 404, error: "No Client ID provided!"});
        }

        const fetchSecret: any = await Applications.FetchClientSecret(clientId);

        if(fetchSecret) {
            try {
                const site = new URL(fetchSecret.redirect_url);

                const token = await Jwt.Sign({
                    user: {
                        id: req.user.id,
                        steam_id: req.user.steam_id,
                        username: req.user.username,
                        avatar: req.user.avatar_url
                    },
                }, fetchSecret.client_secret, "30s");

                site.searchParams.append("code", token);

                await Applications.ApplicationUsage(fetchSecret.client_secret);

                return res.redirect(site);
            } catch (e) {
                return res.status(404).json({status: 404, error: "Redirect URL invalid!"});
            }
        }

        return res.status(404).json({status: 404, error: "Invalid client ID"});
    }

    public static async VerifyToken(req: any, res: any): Promise<void> {
        const token = req.body.client_secret;
        const code = req.body.code;

        if (token == undefined || token == "") {
            return res.status(404).json({status: 404, error: "No Token provided!"});
        }

        const result = await Jwt.Verify(code, token);

        if (result !== undefined) {
            return res.status(200).json({
                access_token: code,
                expires_in: result.exp,
                refresh_token: "none",
                scope: "read"
            });
        }

        return res.status(404).json({status: 404, error: "Token expired or invalid!"});
    }

    public static async Me(req: any, res: any): Promise<void> {
        const token = req.token;
        const code = req.body.code;

        if(token && code) {
            const result = await Jwt.Verify(code, token);

            return res.status(200).json({
                code: 200,
                user: result.user
            })
        }

        return res.status(404).json({status: 404, error: "Token expired or invalid!"});
    }
}