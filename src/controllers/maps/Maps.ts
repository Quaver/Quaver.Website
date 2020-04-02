import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

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

            // The selected map in this case is the top difficulty
            const map = mapset.maps[mapset.maps.length - 1];
            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);

            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map, 
                scores: scores,
                comments: comments
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

            const mapset = await Maps.FetchMapset(req, map.mapset_id);

            if (!mapset)
                return res.status(404).json({ status: 404, error: "Mapset not found"});

            const scores = await Maps.FetchMapScores(req, map.id);
            const comments = await Maps.FetchSupervisorComments(req, mapset.id);
    
            Responses.Send(req, res, "map", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map, 
                scores: scores,
                comments: comments
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
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