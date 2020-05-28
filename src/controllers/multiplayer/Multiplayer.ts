import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameModeHelper from "../../utils/GameModeHelper";
import ModStatus from "../../enums/ModStatus";
import GameMode from "../../enums/GameMode";
import RankedStatus from "../../enums/RankedStatus";

export default class Multiplayer {

    /**
     * Fetches and returns multiplayer games
     * @param req
     * @param res
     * @constructor
     */
    public static async MutliplayerGamesGET(req: any, res: any): Promise<void> {
        try {
            const games = await Multiplayer.FetchMultiplayerGames(req);
            const search = (req.query.search) ? req.query.search : '';

            Responses.Send(req, res, "multiplayer", `Multiplayer | Quaver`, {
                games: games,
                search: search
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches and returns multiplayer game
     * @param req
     * @param res
     * @constructor
     */
    public static async MutliplayerGameGET(req: any, res: any): Promise<void> {
        try {
            const games = await Multiplayer.FetchMultiplayerGames(req);
            const search = (req.query.search) ? req.query.search : '';

            Responses.Send(req, res, "multiplayer/game", `Multiplayer | Quaver`, {
                games: games,
                search: search
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    private static async FetchMultiplayerGames(req: any): Promise<any> {
        try {
            const response = await API.GET(req, `v1/multiplayer/games`, {});

            if (response.status != 200)
                return null;
            return response.matches;
        } catch(err) {
            Logger.Error(err);
            return null;
        }
    }
}