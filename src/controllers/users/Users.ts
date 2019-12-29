import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

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

            const tab = req.query.tab || "info";

            const user = await Users.FetchUser(req, req.params.id);

            if (!user)
                return res.status(404).json({ status: 404, error: "User not found" });

            switch (tab) {
                case "best":
                    return await Users.GetBestScores(req, res, user, mode);
                case "recent":
                    return await Users.GetRecentScores(req, res, user, mode);
                case "firstplace":
                    return await Users.GetFirstPlaceScores(req, res, user, mode);
                case "mapsets":
                    return await Users.GetUploadedMapsets(req, res, user, mode);
                case "playlists":
                    return await Users.GetPlaylists(req, res, user, mode);
                default:
                    Responses.Send(req, res, "user/user-profile-info", `${user.info.username}'s Profile | Quaver`, { 
                        user, 
                        mode
                    });
                    break;
            }
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
    private static async GetBestScores(req: any, res: any, user: any, mode: number): Promise<void> {
        try {
            const page = parseInt(req.query.page) || 0;

            let scores = [];

            const apiScores = await API.GET(req, `v1/users/scores/best?id=${user.info.id}&mode=${mode}&page=${page}`);
            scores = apiScores.scores;

            Responses.Send(req, res, "user/user-profile-best", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                scores
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Renders th epage that displays the user's recent scores
     * @param req 
     * @param res 
     * @param user 
     * @param mode 
     */
    private static async GetRecentScores(req: any, res: any, user: any, mode: number): Promise<void> {
        try {
            const page = parseInt(req.query.page) || 0;

            let scores = [];

            const apiScores = await API.GET(req, `v1/users/scores/recent?id=${user.info.id}&mode=${mode}&page=${page}`);
            scores = apiScores.scores;

            Responses.Send(req, res, "user/user-profile-recent", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                scores
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

        /**
     * Renders th epage that displays the user's first place scores
     * @param req 
     * @param res 
     * @param user 
     * @param mode 
     */
    private static async GetFirstPlaceScores(req: any, res: any, user: any, mode: number): Promise<void> {
        try {
            const page = parseInt(req.query.page) || 0;

            let scores = [];

            const apiScores = await API.GET(req, `v1/users/scores/firstplace?id=${user.info.id}&mode=${mode}&page=${page}`);
            scores = apiScores.scores;

            Responses.Send(req, res, "user/user-profile-first-place", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                scores
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Renders the page which displays the user's uploaded mapsets
     * @param req 
     * @param res 
     * @param user 
     */
    private static async GetUploadedMapsets(req: any, res: any, user: any, mode: number): Promise<void> {
        try {
            const ranked = await API.GET(req, `v1/users/mapsets/${user.info.id}?status=2`);
            const unranked = await API.GET(req, `v1/users/mapsets/${user.info.id}?status=2`);

            Responses.Send(req, res, "user/user-profile-mapsets", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                ranked: ranked.mapsets,
                unranked: unranked.mapsets
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Renders the page that displays the user's created playlists
     * @param req 
     * @param res 
     * @param user 
     * @param mode 
     */
    private static async GetPlaylists(req: any, res: any, user: any, mode: number): Promise<void> {
        try {
            const playlists =  await API.GET(req, `v1/users/${user.info.id}/playlists`);

            Responses.Send(req, res, "user/user-profile-playlists", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                playlists: playlists.playlists
            });
        } catch  (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches information for an individual user
     * @param req 
     * @param id 
     */
    private static async FetchUser(req: any, id: any): Promise<any> {
        try {
            const response = await API.GET(req, `v1/users/full/${id}`);

            if (response.status != 200)
                return null;

            const onlineStatusResponse = await API.GET(req, `v1/server/users/online/${response.user.info.id}`);
            response.user.online_status = onlineStatusResponse;
            
            return response.user;     
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }
}