import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

export default class Playlists {
    /**
     * Fetches and renders the page which displays a user playlist
     * @param req 
     * @param res 
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const page = req.query.page || 0;
            const playlist = await API.GET(req, `v1/playlist/${req.params.id}?page=${page}`);
            
            Responses.Send(req, res, "playlist", `${playlist.playlist.name} | Quaver`, {
                playlist: playlist.playlist
            });
        } catch (err) {
            if (err.message.includes("404"))
                return res.status(404).json({ status: 404, error: "Playlist was not found!" });

            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}