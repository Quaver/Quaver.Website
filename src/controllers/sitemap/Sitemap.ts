import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import EnvironmentHelper from "../../utils/EnvironmentHelper";

export default class Sitemap {
    /**
     * Fetches and renders the team page
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            res.type('application/xml');
            res.render('sitemap', {
                baseUrl: EnvironmentHelper.baseUrl,
                date: new Date().toISOString()
            });
        } catch (err) {
            Logger.Error(err);
            return Responses.Return500(req, res);
        }
    }
}