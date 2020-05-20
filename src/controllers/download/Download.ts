import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

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
            let link: any = await Download.FetchDownloadLink(req, res, type, id);
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
     * Gets download link for mapset/map/replay
     * @param req
     * @param res
     * @param path
     * @param id
     */
    private static async FetchDownloadLink(req: any, res: any, path: string, id: number): Promise<void> {
        try {
            const link = await API.GET(req, `d/web/${path}/${id}`);
            return link.download;
        } catch (err) {
            Logger.Error(`Error fetching: ` + err);
        }
    }
}