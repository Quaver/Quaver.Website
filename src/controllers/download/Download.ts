import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import Authentication from "../../middleware/Authentication";
import EnvironmentHelper from "../../utils/EnvironmentHelper";

export default class Download {
    /**
     * Fetches download link
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const type = req.params.type;
            const id = req.params.id;

            if(type === "replay" || type === "map") {
                res.redirect(EnvironmentHelper.apiBaseUrl(`/d/web/${type}/${id}`));
                return;
            }

            if(type === "mapset" && !req.user)
                return res.redirect("/login");

            let link: any = await Download.FetchMapsetDownloadLink(req, res, id);
            if (link !== undefined)
                res.redirect(link);
            else
                Responses.Return500(req, res);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Gets download link for mapset
     * @param req
     * @param res
     * @param path
     * @param id
     */
    private static async FetchMapsetDownloadLink(req: any, res: any, id: number): Promise<void> {
        try {
            const link = await API.GET(req, `d/web/mapset/${id}`);

            return link.download;
        } catch (err) {
            Logger.Error(`Error fetching: ` + err);
        }
    }
}