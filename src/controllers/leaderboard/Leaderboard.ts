import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import LeaderboardType from "./LeaderboardType";

export default class Leaderboard {
    /**
     * Fetches and returns global/country leaderboards
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const mode = req.query.mode || 1;
            const page = req.query.page || 1;
            const country = req.query.country ? `&country=${req.query.country}` : "";
            const limit = 50;

            let pages;
            if(country !== "") {
                const stats = await API.GET(req, "v1/stats/country");
                pages = Math.ceil(stats.countries[req.query.country.toLowerCase()] / limit) + 1;
            } else {
                const stats = await API.GET(req, "v1/stats");
                pages = Math.ceil(stats.stats.total_users / limit);
            }

            const leaderboard = await API.GET(req, `v1/leaderboard?mode=${mode}&page=${page - 1}${country}`);

            Responses.Send(req, res, "leaderboard", "Leaderboard | Quaver", {
                leaderboardType: country == "" ? LeaderboardType.Global : LeaderboardType.Country,
                leaderboard: leaderboard.users,
                mode: mode,
                page: page,
                pages: pages - 1,
                country: country,
                slug: 'leaderboard'
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches and returns the total hits leaderboard
     * @param req
     * @param res
     */
    public static async TotalHitsGET(req: any, res: any): Promise<void> {
        try {
            const mode = req.query.mode || 1;
            const page = req.query.page || 1;

            const leaderboard = await API.GET(req, `v1/leaderboard/hits?page=${page - 1}`);

            const stats = await API.GET(req, "v1/stats");
            const limit = 50;
            const totalUsers = stats.stats.total_users;
            const pages = Math.ceil(totalUsers / limit);

            Responses.Send(req, res, "leaderboard", "Total Hits Leaderboard | Quaver", {
                leaderboardType: LeaderboardType.TotalHits,
                leaderboard: leaderboard.users,
                mode: mode,
                page: page,
                pages: pages - 1,
                slug: 'hits'
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches and returns the multiplayer leaderboard
     * @param req
     * @param res
     */
    public static async MultiplayerGET(req: any, res: any): Promise<void> {
        try {
            const mode = req.query.mode || 1;
            const page = req.query.page || 1;

            const leaderboard = await API.GET(req, `v1/multiplayer/leaderboard?mode=${mode}&page=${page - 1}`);

            const stats = await API.GET(req, "v1/stats");
            const limit = 50;
            const totalUsers = stats.stats.total_users;
            const pages = Math.ceil(totalUsers / limit);

            Responses.Send(req, res, "leaderboard", "Multiplayer Leaderboard | Quaver", {
                leaderboardType: LeaderboardType.Multiplayer,
                leaderboard: leaderboard.users,
                mode: mode,
                page: page,
                pages: pages - 1,
                slug: 'multiplayer'
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}