import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameMode from "../../enums/GameMode";
import RankedStatus from "../../enums/RankedStatus";
import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';
import sanitizeHtml = require("sanitize-html");
import Grade from "../../enums/Grade";

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

            const user = await Users.FetchUser(req, req.params.id);

            if (!user)
                return Responses.ReturnUserNotFound(req, res);

            if (req.params.id != user.info.id) {
                res.redirect(301, '/user/' + user.info.id);
                return;
            }

            if(!req.query.mode && user.info.information && user.info.information.default_mode !== undefined && !isNaN(user.info.information.default_mode)) {
                mode = user.info.information.default_mode;
            }

            const best = await Users.GetBestScores(req, res, user, mode);
            const mapSetsRanked = await Users.GetUploadedMapSetsRanked(req, res, user.info.id, 0);

            let friend: any = null;

            if (req.user) {
                friend = await Users.IsFriend(req, res, user);
            }

            let informationFlag = true;

            if (user.info.information) {
                // Ignore notification field
                delete user.info.information.notif_action_mapset;
                delete user.info.information.default_mode;
                // Check if information fields are empty
                for (let key in user.info.information) {
                    if ((user.info.information[key] !== null && user.info.information[key] != ""))
                        informationFlag = false;
                }
            }

            if (informationFlag) user.info.information = null;

            Responses.Send(req, res, "user", `${user.info.username}'s Profile | Quaver`, {
                user,
                mode,
                best,
                recent: [],
                firstPlace: [],
                mapSetsRanked,
                mapSetsUnRanked: [],
                playlists: [],
                GameMode,
                RankedStatus,
                friend,
                grades: ["X", "SS", "S", "A", "B", "C", "D"]
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    public static async UserAboutMe(req: any, res: any): Promise<any> {
        try {
            const user = await Users.FetchUser(req, req.params.id);

            if (!user)
                return Responses.ReturnUserNotFound(req, res);

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
                            'a': ['href', 'target'],
                            // 'span': ['style'],
                            'img': ['src']
                        },
                        allowedClasses: {
                          'img': ['lazy']
                        },
                        transformTags: {
                            'a': function (tagName, attribs) {
                                attribs['target'] = "_blank";
                                return {
                                    tagName: tagName,
                                    attribs: attribs
                                }
                            }
                        },
                        disallowedTagsMode: 'escape'
                    });

                if (bio !== "") {
                    bio = bio.split(/\r\n|\n|\r/);
                }
            }

            Responses.Send(req, res, 'user/user-about-me', 'About Me', {
                bio
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

    private static async GetScoresGrade(req: any, res: any, grade: any, user: any, mode: number, page: number): Promise<any> {
        const apiScores = await API.GET(req, `v1/users/scores/grades?id=${user}&mode=${mode}&grade=${grade}&page=${page}&limit=15`);

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
     */
    static async FetchUser(req: any, id: any): Promise<any> {
        const response = await API.GET(req, `v1/users/full/${id}`);

        if (response.status != 200)
            return null;

        response.user.online_status = await API.GET(req, `v1/server/users/online/${response.user.info.id}`);

        return response.user;
    }

    public static async UserAchievementsPOST(req: any, res: any): Promise<void> {
        try {
            const userId: number = (req.query.id) ? req.query.id : 0;
            const response = await API.GET(req, `v1/users/${userId}/achievements`);

            Responses.Send(req, res, "user/user-profile-achievements", ``, {
                achievements: response.achievements
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async UserPlaylistsPOST(req: any, res: any): Promise<void> {
        try {
            const userId: number = (req.query.id) ? req.query.id : 0;
            const response = await API.GET(req, `v1/users/${userId}/playlists`);

            Responses.Send(req, res, "user/user-profile-playlists", ``, {
                playlists: response.playlists
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
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
     * Fetches and returns score grades
     * @param req
     * @param res
     * @constructor
     */

    public static async UserScoresGradePOST(req: any, res: any): Promise<void> {
        try {
            req.query = req.body;

            const userId: number = (req.query.id) ? req.query.id : 0;
            const mode: GameMode = (req.query.mode) ? req.query.mode : GameMode.Keys4;
            const grade: Grade = (req.query.grade) ? req.query.grade : "None";
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;

            const scores = await Users.GetScoresGrade(req, res, grade, userId, mode, page);

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
    public static async UserMapsetsPOST(req: any, res: any): Promise<void> {
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
