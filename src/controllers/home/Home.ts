import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
const axios = require("axios");

export default class Home {
    /**
     * Fetches the homepage of the website
     * @param req 
     * @param res 
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const recentlyRanked = await Home.FetchRecentlyRanked(req);
            const stats = await API.GET(req, "v1/stats");
            const blog = await axios.get("https://blog.quavergame.com/feed.json");

            return Responses.Send(req, res, "home", "Home | Quaver", {
                recentlyRanked: recentlyRanked,
                stats: stats.stats,
                blog: blog.data
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Gets the recently ranked mapsets from the API
     * @param req 
     */
    private static async FetchRecentlyRanked(req: any) : Promise<any[]> {
        let recentlyRanked = [];

        try {
            recentlyRanked = await API.GET(req, "v1/mapsets/maps/search?mode=1&mode=2");
            recentlyRanked = recentlyRanked.mapsets;
        } catch (err) {
            Logger.Error(`Error fetching recently ranked maps: ` + err);
        }

        return recentlyRanked;
    }
}