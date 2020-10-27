import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import MultiplayerGameRuleset from "../../enums/MultiplayerGameRuleset";
import {Multi} from "redis";

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
            Responses.ReturnMultiplayerNotFound(req, res);
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
            const gameId = req.params.id;
            const game = await Multiplayer.FetchMultiplayerGame(req, gameId);
            const live = await Multiplayer.FetchMultiplayerGameLive(req);

            let isLive = false;
            // This is a temporary because live api does not have status if status is 200
            if (live.status == undefined) isLive = true;

            Responses.Send(req, res, "multiplayer/game", `Multiplayer - ${game.multiplayer_game.name} | Quaver`, {
                gameId: gameId,
                mp: game,
                game: game.matches,
                rulesets: MultiplayerGameRuleset,
                isLive: isLive,
                live: live
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnMultiplayerNotFound(req, res);
        }
    }

    /**
     * Fetches and returns multiplayer match
     * @param req
     * @param res
     * @constructor
     */
    public static async MultiplayerMatchPOST(req: any, res: any): Promise<void> {
        try {
            let scores = await Multiplayer.FetchMultiplayerMatch(req);

            let teams = {
                'red': 0,
                'blue': 0
            }

            let players_count = {
                'red': 0,
                'blue': 0
            }

            scores.match.scores.forEach(player => {
                if (player.score.team == 0) {
                    players_count.red += 1;
                    teams.red += player.score.performance_rating;
                } else if (player.score.team == 1) {
                    players_count.blue += 1;
                    teams.blue += player.score.performance_rating;
                }
            });

            if (players_count.red)
                teams.red = teams.red / players_count.red;
            if (players_count.blue)
                teams.blue = teams.blue / players_count.blue;

            Responses.Send(req, res, "multiplayer/scores", ``, {
                scores: scores.match.scores,
                teams,
                type: (scores.match.outcome.team == -1) ? 0 : 1,
                rulesets: MultiplayerGameRuleset,
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async MultiplayerMatchLivePOST(req: any, res: any): Promise<void> {
        try {
            let scores = await Multiplayer.FetchMultiplayerGameLive(req);

            let teams = {
                'red': 0,
                'blue': 0
            }

            let players_count = {
                'red': 0,
                'blue': 0
            }

            let type = 0;

            if (scores.game.type == MultiplayerGameRuleset.Team) {
                scores.players.forEach(player => {
                    if (player.score.team == 0) {
                        players_count.red += 1;
                        teams.red += player.score.performance_rating;
                    } else if (player.score.team == 1) {
                        players_count.blue += 1;
                        teams.blue += player.score.performance_rating;
                    }
                });

                if (players_count.red)
                    teams.red = teams.red / players_count.red;
                if (players_count.blue)
                    teams.blue = teams.blue / players_count.blue;

                type = (scores.match.outcome.team == -1) ? 0 : 1;
            }

            Responses.Send(req, res, "multiplayer/live", ``, {
                live: scores,
                teams,
                type: type,
                rulesets: MultiplayerGameRuleset,
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
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    private static async FetchMultiplayerGame(req: any, id: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/multiplayer/games/${id}`, {});

            if (response.status != 200)
                return null;
            return response;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    private static async FetchMultiplayerMatch(req: any) {
        try {
            const response = await API.GET(req, `v1/multiplayer/match/${req.params.id}`, {});

            if (response.status != 200)
                return null;
            return response;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }

    private static async FetchMultiplayerGameLive(req: any) {
        try {
            const response = await API.GET(req, `v1/multiplayer/games/${req.params.id}/live`, {});

            if (response.status !== undefined && response.status != 404)
                return null;
            return response;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }
}