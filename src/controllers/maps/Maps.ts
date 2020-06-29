import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameModeHelper from "../../utils/GameModeHelper";
import ModStatus from "../../enums/ModStatus";
import GameMode from "../../enums/GameMode";
import RankedStatus from "../../enums/RankedStatus";
import Authentication from "../../middleware/Authentication";
import EnvironmentHelper from "../../utils/EnvironmentHelper";

const showdown = require('showdown');
const sanitizeHtml = require('sanitize-html');
const moment = require("moment");

export default class Maps {

    /**
     * Fetches and returns maps
     * @param req
     * @param res
     * @constructor
     */
    public static async MapsGET(req: any, res: any): Promise<void> {
        try {
            const maps = await Maps.FetchMaps(req);
            const search = (req.query.search) ? req.query.search : '';
            const status = (req.query.status) ? req.query.status : 2;
            const mode = (req.query.mode) ? req.query.mode : [1, 2];

            Responses.Send(req, res, "maps", `Maps | Quaver`, {
                maps: maps,
                search: search,
                status: status,
                mode: mode,
                form: req.query,
                query: JSON.stringify(req.query)
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
        }
    }

    /**
     * Fetches and returns maps
     * @param req
     * @param res
     * @constructor
     */
    public static async MapsSearchPOST(req: any, res: any): Promise<void> {
        try {
            req.query = req.body;
            const maps = await Maps.FetchMaps(req);
            Responses.Send(req, res, "maps/mapsets", ``, {
                maps: maps
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     *  Fetches and returns the page which displays an individual mapset
     * @param req
     * @param res
     */
    public static async MapsetGET(req: any, res: any): Promise<void> {
        try {
            let mapset = await Maps.FetchMapset(req, req.params.id);
            // Mapset doesn't exist or is hidden, so return a 404.
            if (!mapset)
                return res.status(404).json({status: 404, error: "Mapset not found"});

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.descriptionRaw = mapset.description;

            showdown.setFlavor('github');

            mapset.description = sanitizeHtml(new showdown.Converter({
                ghMentionsLink: EnvironmentHelper.baseUrl('/user/{u}')
            }).makeHtml(mapset.description));

            // The selected map in this case is the top difficulty
            const map = mapset.maps[mapset.maps.length - 1];
            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);

            // Get logged user playlists
            let playlists: any = null;

            if (req.user) {
                playlists = await Maps.FetchUserPlaylists(req, req.user.id, map.id);
            }

            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                scores: scores,
                comments: comments,
                gameMode: GameModeHelper.gameMode,
                playlists: playlists
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
        }
    }

    /**
     * Fetches and returns the page for an individual map (same as the mapset page, but selects an individual map)
     * @param req
     * @param res
     */
    public static async MapGET(req: any, res: any): Promise<void> {
        try {
            const map = await Maps.FetchMap(req, req.params.id);

            if (!map)
                return res.status(404).json({status: 404, error: "Map not found"});

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            if (!mapset)
                return res.status(404).json({status: 404, error: "Mapset not found"});

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.descriptionRaw = mapset.description;

            showdown.setFlavor('github');

            mapset.description = sanitizeHtml(new showdown.Converter({
                ghMentionsLink: EnvironmentHelper.baseUrl('/user/{u}')
            }).makeHtml(mapset.description));

            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);

            // Get logged user playlists
            let playlists: any = null;

            if (req.user) {
                playlists = await Maps.FetchUserPlaylists(req, req.user.id, map.id);
            }

            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                scores: scores,
                comments: comments,
                gameMode: GameModeHelper.gameMode,
                playlists: playlists
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
        }
    }

    /**
     * Fetches and returns the page for modding
     * @param req
     * @param res
     */
    public static async ModsGET(req: any, res: any): Promise<void> {
        try {
            const map = await Maps.FetchMap(req, req.params.id);

            if (!map)
                return res.status(404).json({status: 404, error: "Map not found"});

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.description = sanitizeHtml(new showdown.Converter().makeHtml(mapset.description));

            if (!mapset)
                return res.status(404).json({status: 404, error: "Mapset not found"});

            let mods = await Maps.FetchMods(req, map.id);

            for (let mod in mods) {
                mods[mod].mod.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[mod].mod.comment));
                // Replace <code> with link to editor
                mods[mod].mod.comment = await Maps.ReplaceCode(mods[mod].mod.comment);

                // Mod replies
                for (let reply in mods[mod].mod.replies) {
                    mods[mod].mod.replies[reply].message.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[mod].mod.replies[reply].message.comment));

                    // Replace <code> with link to editor
                    mods[mod].mod.replies[reply].message.comment = await Maps.ReplaceCode(mods[mod].mod.replies[reply].message.comment);
                }
            }

            const filter = req.query.filter ? req.query.filter : '';

            if (filter != null) {
                await Maps.SortMods(mods, filter);
            }

            Responses.Send(req, res, "maps/modding", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                mods: mods,
                modding: true,
                filter: filter,
                gameMode: GameModeHelper.gameMode
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
        }
    }

    private static async SortMods(mods: any, filter: any): Promise<any> {
        const statuses: any = {
            "Pending": 0,
            "Accepted": 1,
            "Denied": 2,
            "Ignored": 3
        };

        switch (filter) {
            case 'status':
                mods.sort((a: any, b: any) => statuses[a.mod.status] - statuses[b.mod.status]);
                break;
            case 'time':
                mods.sort((a: any, b: any) => b.mod.id - a.mod.id);
                break;
            case 'type':
                mods.sort((a: any, b: any) => statuses[a.mod.type] - statuses[b.mod.type]);
                break;
            default:
                mods.sort((a: any, b: any) => b.mod.id - a.mod.id);
                break;
            // mods.sort((a:any, b:any) => a.mod.id - b.mod.id);
            // break;
        }

        return mods;
    }


    public static async HandlePostMods(req: any, res: any): Promise<any> {
        try {
            if (typeof req.body.submit_mod !== 'undefined') {
                const mod = await API.POST(req, `v1/maps/${req.params.id}/mods`, {
                    type: req.body.type,
                    timestamp: req.body.timestamp,
                    comment: req.body.comment
                });

                res.redirect(303, `/mapset/map/${req.params.id}/mods#mod_${mod.mod_id}`);

                return;
            } else if (typeof req.body.submit_comment !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/comment`, {
                    comment: req.body.comment
                });

                res.redirect(303, `/mapset/map/${req.params.id}/mods#mod_${req.body.mod_id}`);

                return;
            } else if (typeof req.body.mod_accept !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Accepted
                });
            } else if (typeof req.body.mod_deny !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Denied
                });
            } else if (typeof req.body.mod_ignore !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Ignored
                });
            } else if (typeof req.body.mod_revert !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Pending
                });
            }

            res.redirect(303, `/mapset/map/${req.params.id}/mods`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    private static async FetchMaps(req: any): Promise<any> {
        try {
            const search: string = (req.query.search) ? req.query.search : '';
            const mode: number[] = (req.query.mode) ? req.query.mode : [1, 2];
            const status: number[] = (req.query.status) ? req.query.status : 2;
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;
            const limit: number = (req.query.limit && req.query.limit <= 50 && req.query.limit > 0 && !isNaN(req.query.limit))
                ? req.query.limit : 50;

            let minDate = Maps.GetUnixTimestampFromDate(req.query.mindateu);
            let maxDate = Maps.GetUnixTimestampFromDate(req.query.maxdateu);

            let minUpdateDate = Maps.GetUnixTimestampFromDate(req.query.mindatelu);
            let maxUpdateDate = Maps.GetUnixTimestampFromDate(req.query.maxdatelu);

            const response = await API.GET(req, `v1/mapsets/maps/search`, {
                search,
                mode,
                status,
                page,
                limit,
                mindiff: req.query.mindiff,
                maxdiff: req.query.maxdiff,
                minlength: req.query.minlen,
                maxlength: req.query.maxlen,
                minbpm: req.query.minbpm,
                maxbpm: req.query.maxbpm,
                minlns: req.query.minnote,
                maxlns: req.query.maxnote,
                minplaycount: req.query.minpc,
                maxplaycount: req.query.maxpc,
                mincombo: req.query.mincombo,
                maxcombo: req.query.maxcombo,
                mindate: minDate,
                maxdate: maxDate,
                mindatelastupdated: minUpdateDate,
                maxdatelastupdated: maxUpdateDate
            });

            if (response.status != 200)
                return null;
            return response.mapsets;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    public static async HandlePost(req: any, res: any): Promise<any> {
        try {
            if (typeof req.body.save_description !== 'undefined') {
                if (req.body.description) {
                    await API.POST(req, `v1/mapsets/${req.body.mapset_id}/description`, {
                        description: req.body.description
                    });
                    req.flash('success', 'Mapset description updated!');
                    res.redirect(303, `/mapset/${req.body.mapset_id}`);
                    return;
                }
            } else if (typeof req.body.submit_delete !== 'undefined') {
                await API.POST(req, `v1/mapsets/${req.body.mapset_id}/delete`);
                req.flash('success', 'Mapset successfully deleted!');
                res.redirect(303, `/maps`);
                return;
            } else if (typeof req.body.submit_for_rank !== 'undefined') {
                await API.POST(req, `v1/mapsets/${req.body.mapset_id}/submitrank`);
            } else if (typeof req.body.submit_comment !== 'undefined') {
                if (req.body.comment !== "")
                    await API.POST(req, `v1/mapsets/${req.body.mapset_id}/comment`, {
                        comment: req.body.comment
                    });

                res.redirect(303, `/mapset/${req.body.mapset_id}#comments`);
                return;
            }
            res.redirect(303, `/mapset/${req.body.mapset_id}`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     *
     * @param timestamp
     * @constructor
     */

    private static async ReplaceCode(timestamp: any): Promise<any> {
        const regex_code = new RegExp(/<code>((\d+\|\d)(,(\d+\|\d))*)<\/code>/g);

        return timestamp.replace(regex_code, function (p: any) {
            const matches = p.split(regex_code);
            return `<a href="quaver://editor/${matches[1]}"><span>${matches[1]}</span></a>`;
        });
    }

    /**
     * Fetches map mods
     */
    private static async FetchMods(req: any, id: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/maps/${id}/mods`);

            if (response.status != 200)
                return null;
            return response.mods;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    /**
     * Fetches information about an individual mapset
     */
    private static async FetchMapset(req: any, id: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/mapsets/${id}`);

            if (response.status != 200)
                return null;

            return response.mapset;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    /**
     * Fetches information aboout an individual map
     * @param req
     * @param id
     */
    private static async FetchMap(req: any, id: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/maps/${id}`);

            if (response.status != 200)
                return null;

            return response.map;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    /**
     * Fetches scores for an individual map
     * @param req
     * @param id
     */
    private static async FetchMapScores(req: any, id: number): Promise<any[]> {
        try {
            const response = await API.GET(req, `v1/scores/map/${id}`);

            if (response.status != 200)
                return [];

            return response.scores;
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

    /**
     * Fetches ranking supervisor comments on an individual mapset
     * @param req
     * @param id
     */
    private static async FetchSupervisorComments(req: any, id: number): Promise<any[]> {
        try {
            const response = await API.GET(req, `v1/mapsets/${id}/comments`);

            if (response.status != 200)
                return [];

            return response.comments;
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

    public static async SortDifficulties(arr: any): Promise<any[]> {
        return arr.slice().sort(function (a: any, b: any) {
            return a.difficulty_rating - b.difficulty_rating;
        });
    }

    /**
     * Returns a unix timestamp from a YYYY-MM-DD formatted date
     * @param date
     */
    private static GetUnixTimestampFromDate(date: any): any {
        if (!date)
            return null;

        return moment(date, 'YYYY/MM/DD').unix() * 1000;
    }

    /**
     * Fetches logged user playlists
     * @param req
     * @param id
     */
    private static async FetchUserPlaylists(req: any, id: number, map: number): Promise<any[]> {
        try {
            const response = await API.GET(req, `v1/users/${id}/playlists/map/${map}`);

            if (response.status != 200)
                return [];

            return response.playlists;
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

    public static async PlaylistAddPOST(req: any, res: any): Promise<any> {
        try {
            const id = req.body.id;
            const map = req.body.map;

            const response = await API.POST(req, `v1/playlist/${id}/add/${map}`);

            if (response.status != 200) {
                Logger.Error(response);
                Responses.Return500(req, res);
                return;
            }

            Responses.ReturnJson(req, res, response);
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

    public static async PlaylistRemoveMapPOST(req: any, res: any): Promise<any> {
        try {
            const id = req.body.id;
            const map = req.body.map;

            const response = await API.POST(req, `v1/playlist/${id}/remove/${map}`);

            if (response.status != 200) {
                Logger.Error(response);
                Responses.Return500(req, res);
                return;
            }

            if (req.body.page == 'playlist') {
                res.redirect(301, '/playlist/' + id);
                return;
            } else if (req.body.page == 'mapset') {
                Responses.ReturnJson(req, res, response);
                return;
            } else {
                return response;
            }
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
            return;
        }
    }
}