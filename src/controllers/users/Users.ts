import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
// @ts-ignore
import bbobHTML from '@bbob/html';
// @ts-ignore
import presetHTML5 from '@bbob/preset-html5';
import sanitizeHtml = require("sanitize-html");

export default class Users {
    /**
     * Fetches and retrieves a user profile
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            let mode = parseInt(req.query.mode) || 1;

            if (mode < 1 || mode > 2)
                mode = 1;

            const user = await Users.FetchUser(req, req.params.id, mode);

            if (!user)
                return res.status(404).json({status: 404, error: "User not found"});

            const best = await Users.GetBestScores(req, res, user, mode);
            const recent = await Users.GetRecentScores(req, res, user, mode);
            const firstPlace = await Users.GetFirstPlaceScores(req, res, user, mode);
            const mapSetsRanked = await Users.GetUploadedMapSetsRanked(req, res, user);
            const mapSetsUnRanked = await Users.GetUploadedMapSetsUnRanked(req, res, user);
            const playLists = await Users.GetPlaylists(req, res, user);
            const bio = bbobHTML(sanitizeHtml(user.info.userpage, {
                allowedTags: ['span', 'a'],
                allowedAttributes: {
                    'a': ['href'],
                    'span': ['style']
                }
            }), presetHTML5());

            Responses.Send(req, res, "user", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                bio,
                best,
                recent,
                firstPlace,
                mapSetsRanked,
                mapSetsUnRanked,
                playLists
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Renders the page that displays the user's best scores
     * @param req
     * @param res
     * @param user
     * @param mode
     */
    private static async GetBestScores(req: any, res: any, user: any, mode: number): Promise<any> {
        const apiScores = await API.GET(req, `v1/users/scores/best?id=${user.info.id}&mode=${mode}&page=0&limit=15`);

        return apiScores.scores;
    }

    /**
     * Renders th epage that displays the user's recent scores
     * @param req
     * @param res
     * @param user
     * @param mode
     */
    private static async GetRecentScores(req: any, res: any, user: any, mode: number): Promise<any> {
        const apiScores = await API.GET(req, `v1/users/scores/recent?id=${user.info.id}&mode=${mode}&page=0&limit=15`);

        return apiScores.scores;
    }

    /**
     * Renders the page that displays the user's first place scores
     * @param req
     * @param res
     * @param user
     * @param mode
     */
    private static async GetFirstPlaceScores(req: any, res: any, user: any, mode: number): Promise<any> {
        const apiScores = await API.GET(req, `v1/users/scores/firstplace?id=${user.info.id}&mode=${mode}&page=0&limit=15`);

        return apiScores.scores;
    }

    /**
     * Renders the page which displays the user's uploaded mapsets
     * @param req
     * @param res
     * @param user
     */
    private static async GetUploadedMapSetsRanked(req: any, res: any, user: any): Promise<any> {
        const ranked = await API.GET(req, `v1/users/mapsets/${user.info.id}?status=2`);

        return ranked.mapsets;
    }

    /**
     * Renders the page which displays the user's uploaded mapsets
     * @param req
     * @param res
     * @param user
     */
    private static async GetUploadedMapSetsUnRanked(req: any, res: any, user: any): Promise<any> {
        const unranked = await API.GET(req, `v1/users/mapsets/${user.info.id}?status=1`);

        return unranked.mapsets;
    }

    /**
     * Renders the page that displays the user's created playlists
     * @param req
     * @param res
     * @param user
     */
    private static async GetPlaylists(req: any, res: any, user: any): Promise<any> {
        const playlists = await API.GET(req, `v1/users/${user.info.id}/playlists`);

        return playlists.playlists;
    }

    /**
     * Fetches information for an individual user
     * @param req
     * @param id
     * @param mode
     */
    private static async FetchUser(req: any, id: any, mode: any): Promise<any> {
        const response = await API.GET(req, `v1/users/full/${id}`);

        if (response.status != 200)
            return null;

        const onlineStatusResponse = await API.GET(req, `v1/server/users/online/${response.user.info.id}`);
        const achievementsResponse = await API.GET(req, `v1/users/${response.user.info.id}/achievements`);
        // const graphRankResponse = await API.GET(req, `v1/users/graph/rank?id=${response.user.info.id}&mode=${mode}`);
        response.user.online_status = onlineStatusResponse;
        response.user.achievements = achievementsResponse.achievements;

        return response.user;
    }
}
