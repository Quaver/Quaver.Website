import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import TimeHelper from "../../utils/TimeHelper";

export default class Playlists {

    /**
     * Fetches and returns playlists
     * @param req
     * @param res
     * @constructor
     */
    public static async PlaylistsGET(req: any, res: any): Promise<void> {
        try {
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;
            const search = (req.query.search) ? req.query.search : null;

            const playlists = await Playlists.FetchPlayList(req, page, search);

            Responses.Send(req, res, "playlists", `Playlists | Quaver`, {
                playlists: playlists,
                search: search
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnPlaylistNotFound(req, res);
        }
    }

    /**
     * Fetches and returns playlists
     * @param req
     * @param res
     * @constructor
     */
    public static async PlaylistsMoreGET(req: any, res: any): Promise<void> {
        try {
            req.query = req.body;
            const page: number = (!isNaN(req.query.page) && req.query.page >= 0) ? req.query.page : 0;
            const search = (req.query.search) ? req.query.search : null;

            const playlists = await Playlists.FetchPlayList(req, page, search);

            Responses.Send(req, res, "playlists/playlists", ``, {
                playlists: playlists
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches and renders the page which displays a user playlist
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const page = req.query.page || 0;
            let playlist = await API.GET(req, `v1/playlist/${req.params.id}?page=${page}`);

            let sorted = await Playlists.SortDifficulties(playlist.playlist.maps);

            for (let p in sorted) {
                sorted[p].game_modes = [];
                for (let m in sorted[p]) {
                    if (!sorted[p].game_modes.includes(sorted[p][m].game_mode) && sorted[p][m].game_mode !== undefined)
                        sorted[p].game_modes.push(sorted[p][m].game_mode)
                }
            }

            Responses.Send(req, res, "playlists/playlist", `${playlist.playlist.name} | Quaver`, {
                playlist: playlist.playlist,
                orderedPlaylist: sorted,
                convertTime: TimeHelper.convertTime,
                page: page
            });
        } catch (err) {
            if (err.message.includes("404"))
                return res.status(404).json({status: 404, error: "Playlist was not found!"});

            Logger.Error(err);
            Responses.ReturnPlaylistNotFound(req, res);
        }
    }

    private static async FetchPlayList(req: any, page: number, search: string) {
        try {
            const searchParam = (search) ? '&search=' + search : '';
            const response = await API.GET(req, `v1/playlist/all/search?page=${page}${searchParam}`);

            if (response.status != 200)
                return null;
            return response.playlists;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    public static async SortDifficulties(arr: any): Promise<any[]> {
        return arr.reduce(function (rv, x) {
            (rv[x["mapset_id"]] = rv[x["mapset_id"]] || []).push(x);
            return rv;
        }, {});
    }
}