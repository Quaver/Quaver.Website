import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameModeHelper from "../../utils/GameModeHelper";
import ScoreboardType from "../../enums/ScoreboardType";
import EnvironmentHelper from "../../utils/EnvironmentHelper";
import TimeHelper from "../../utils/TimeHelper";

const showdown = require('showdown');
const sanitizeHtml = require('sanitize-html');
const moment = require("moment");

const allowedHTML = ['span', 'a', 'strong', 'img', 'center', 'h1', 'h2', 'h3', 'h4', 'h5', 'code', 'b', 'pre',
    'p', 'i', 'u', 'hr', 'ul', 'ol', 'li', 'details', 'summary', 'br', 'em', 'blockquote', 'table', 'tr', 'td', 'th', 'thead', 'tbody'];

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
                return Responses.ReturnMapsetNotFound(req, res);

            // Redirect to latest difficulty
            return res.redirect('/mapset/map/' + mapset.maps[mapset.maps.length - 1].id);
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
            let scoreboardType = ScoreboardType.Global;
            let scoreboardCountry = "";
            let scoreboardModes = 0;

            if (req.query.type || !isNaN(req.query.type))
                scoreboardType = parseInt(req.query.type);

            if (!(scoreboardType in ScoreboardType))
                return Responses.ReturnCustom(req, res, "Invalid Type", "Invalid Scoreboard Type");

            if (req.query.country && req.query.type == ScoreboardType.Country)
                scoreboardCountry = req.query.country;

            if (req.query.modes && !isNaN(req.query.mods) && req.query.type == ScoreboardType.Rate)
                scoreboardModes = req.query.modes;

            const map = await Maps.FetchMap(req, req.params.id);

            if (!map)
                return Responses.ReturnMapsetNotFound(req, res);

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            if (!mapset)
                return Responses.ReturnMapsetNotFound(req, res);

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.descriptionRaw = mapset.description;

            showdown.setFlavor('github');

            mapset.description = sanitizeHtml(new showdown.Converter({
                ghMentionsLink: EnvironmentHelper.baseUrl('/user/{u}')
            }).makeHtml(mapset.description), {
                allowedTags: allowedHTML,
                allowedAttributes: {
                    'a': ['href'],
                    'span': ['style'],
                    'img': ['src']
                },
                disallowedTagsMode: 'escape'
            });

            const scores = await Maps.FetchMapScoreboard(req, map.id, scoreboardType, scoreboardModes, scoreboardCountry);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);

            // Get logged user playlists
            let playlists: any = null;

            if (req.user)
                playlists = await Maps.FetchUserPlaylists(req, req.user.id, map.id);

            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                pb: scores.personalBest,
                scores: scores.scores,
                comments: comments,
                gameMode: GameModeHelper.gameMode,
                playlists: playlists,
                description: `
                BPM: ${map.bpm} | Length: ${TimeHelper.formatTime(map.length)}
                Passes / Fails: ${map.play_count - map.fail_count} / ${map.fail_count}`,
                image: EnvironmentHelper.assets('/img/mapset-image.jpg'),
                ScoreboardType: ScoreboardType,
                SelectedScoreboardType: scoreboardType
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
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
                // await API.POST(req, `v1/mapsets/${req.body.mapset_id}/submitrank`);
                // req.flash('success', 'Your mapset has successfully been submitted for rank!');
                req.flash('success', 'Submit for rank is disabled.');
                res.redirect(303, `/mapset/${req.body.mapset_id}`);
                return;
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
     * Fetches information about an individual mapset
     */
    public static async FetchMapset(req: any, id: number): Promise<any> {
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
    public static async FetchMap(req: any, id: number): Promise<any> {
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
     * @param type
     * @param mods
     * @param country
     */
    private static async FetchMapScoreboard(req: any, id: number, type: number = 0, mods: number = 0, country: string = ""): Promise<any[]> {
        try {
            let params = {
                type: type,
                mods: mods,
            }

            if (country) params['country'] = country;

            const response = await API.GET(req, `v1/scores/map/${id}/scoreboard`, params);

            if (response.status != 200)
                return [];

            return response;
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
    public static async FetchSupervisorComments(req: any, id: number): Promise<any[]> {
        try {
            const response = await API.GET(req, `v1/mapsets/${id}/comments`);

            if (response.status != 200)
                return [];

            let comments = response.comments;

            for (let comment in comments) {
                comments[comment].comment = comments[comment].comment.split(/\r\n|\n|\r/);
            }

            return comments;
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
     * @param map
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