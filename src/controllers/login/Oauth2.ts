import Responses from "../../utils/Responses";


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

            site.searchParams.append("user_id", req.user.id);

            res.redirect(site);
        } catch (e) {
            return res.status(404).json({status: 404, error: "Redirect URL invalid!"});
        }

    }
}