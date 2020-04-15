import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameModeHelper from "../../utils/GameModeHelper";

const showdown  = require('showdown');
const sanitizeHtml = require('sanitize-html');

export default class Maps {
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
                return res.status(404).json({ status: 404, error: "Mapset not found"});

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.description = sanitizeHtml(new showdown.Converter().makeHtml(mapset.description));

            // The selected map in this case is the top difficulty
            const map = mapset.maps[mapset.maps.length - 1];
            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);

            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map, 
                scores: scores,
                comments: comments,
                gameMode: GameModeHelper.gameMode
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
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
                return res.status(404).json({ status: 404, error: "Map not found" });

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            mapset.description = sanitizeHtml(new showdown.Converter().makeHtml(mapset.description));

            if (!mapset)
                return res.status(404).json({ status: 404, error: "Mapset not found"});

            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);
    
            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map, 
                scores: scores,
                comments: comments,
                gameMode: GameModeHelper.gameMode
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
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
                return res.status(404).json({ status: 404, error: "Map not found" });

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            mapset.description = sanitizeHtml(new showdown.Converter().makeHtml(mapset.description));

            if (!mapset)
                return res.status(404).json({ status: 404, error: "Mapset not found"});

            let mods = await Maps.FetchMods(req, map.id);

            const regex_code = new RegExp(/<code>((\d+\|\d)(,(\d+\|\d))*)<\/code>/g);

            for (let m in mods) {
                mods[m].mod.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[m].mod.comment));
                mods[m].mod.comment.replace(regex_code, function (p:any) {
                    const matches = p.split(regex_code);
                    return `<a href="quaver://editor/${matches[1]}"><span>${matches[1]}</span></a>`;
                });
                for (let r in mods[m].mod.replies) {
                    mods[m].mod.replies[r].message.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[m].mod.replies[r].message.comment));
                }
            }

            Responses.Send(req, res, "maps/modding", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                mods: mods,
                modding: true,
                gameMode: GameModeHelper.gameMode
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
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
        return arr.slice().sort(function(a:any, b:any) {
            return a.difficulty_rating - b.difficulty_rating;
        });
    }
}