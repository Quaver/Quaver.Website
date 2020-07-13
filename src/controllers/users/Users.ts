import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameMode from "../../enums/GameMode";
import RankedStatus from "../../enums/RankedStatus";
import bbobHTML from '@bbob/html';
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
            const mapSetsRanked = await Users.GetUploadedMapSetsRanked(req, res, user.info.id, 0);

            const mapSetsUnRanked = await Users.GetUploadedMapSetsUnRanked(req, res, user.info.id, 0);
            const playlists = await Users.GetPlaylists(req, res, user);

            let friend: any = null;

            if (req.user) {
                friend = await Users.IsFriend(req, res, user);
            }

            let bio: any = null;

            if (user.info.userpage) {
                bio = sanitizeHtml(
                    bbobHTML(user.info.userpage, presetHTML5(), {
                        onlyAllowTags: ['span', 'a', 'strong', 'b', 'img', 'center', 'p', 'i', 'u',
                            'hr', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'url']
                    }),
                    {
                        allowedTags: ['span', 'a', 'strong', 'img', 'center', 'h1', 'h2', 'h3', 'h4', 'h5',
                            'p', 'i', 'u', 'hr', 'ul', 'ol', 'li', 'details', 'summary'],
                        allowedAttributes: {
                            'a': ['href'],
                            'span': ['style'],
                            'img': ['src']
                        },
                        disallowedTagsMode: 'escape'
                    });

                if (bio !== "")
                    bio = bio.split(/\r\n|\n|\r/);
            }

            Responses.Send(req, res, "user", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                bio,
                best,
                recent,
                firstPlace,
                mapSetsRanked,
                mapSetsUnRanked,
                playlists,
                GameMode,
                RankedStatus,
                friend
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    /**
     * Renders the page that displays the user's best scores
     * @param req
     * @param res
     * @param user
     */
    private static async IsFriend(req: any, res: any, user: any): Promise<any> {
        const apiRelationships = await API.GET(req, `v1/relationships/check/${user.info.id}`);

        return apiRelationships.user;
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
     * Renders the page that displays the user's scores
     * @param req
     * @param res
     * @param type
     * @param user
     * @param mode
     */
    private static async GetScores(req: any, res: any, type: any, user: any, mode: number, page: number): Promise<any> {
        const apiScores = await API.GET(req, `v1/users/scores/${type}?id=${user}&mode=${mode}&page=${page}&limit=15`);

        return apiScores.scores;
    }

    /**
     * Renders the page which displays the user's uploaded mapsets
     * @param req
     * @param res
     * @param user
     */
    private static async GetUploadedMapSetsRanked(req: any, res: any, user: any, page: number): Promise<any> {
        const ranked = await API.GET(req, `v1/users/mapsets/${user}?status=2&page=${page}`);

        return ranked.mapsets;
    }

    /**
     * Renders the page which displays the user's uploaded mapsets
     * @param req
     * @param res
     * @param user
     */
    private static async GetUploadedMapSetsUnRanked(req: any, res: any, user: any, page: number): Promise<any> {
        const unranked = await API.GET(req, `v1/users/mapsets/${user}?status=1&page=${page}`);

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
    static async FetchUser(req: any, id: any, mode: any): Promise<any> {
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

    /**
     * Fetches and returns scores
     * @param req
     * @param res
     * @constructor
     */
    public static async UserScoresPOST(req: any, res: any): Promise<void> {
        try {
            req.query = req.body;

            const userId: number = (req.query.id) ? req.query.id : 0;
            const type: any = (req.query.table) ? req.query.table : 'recent';
            const mode: GameMode = (req.query.mode) ? req.query.mode : GameMode.Keys4;
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;

            const scores = await Users.GetScores(req, res, type, userId, mode, page);

            Responses.Send(req, res, "user/scores", ``, {
                data: scores
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches and returns maps
     * @param req
     * @param res
     * @constructor
     */
    public static async UserMapssetsPOST(req: any, res: any): Promise<void> {
        try {
            req.query = req.body;

            const userId: number[] = (req.query.id) ? req.query.id : 0;
            const status: RankedStatus = (req.query.status) ? req.query.status : RankedStatus.Ranked;
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;

            let maps = null;

            if (status == RankedStatus.Ranked)
                maps = await Users.GetUploadedMapSetsRanked(req, res, userId, page);
            else
                maps = await Users.GetUploadedMapSetsUnRanked(req, res, userId, page);

            Responses.Send(req, res, "maps/mapsets", ``, {
                maps: maps
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}
