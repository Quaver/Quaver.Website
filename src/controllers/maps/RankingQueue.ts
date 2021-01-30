import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";
import GameMode from "../../enums/GameMode";
import Ranking from "../ranking/Ranking";

export default class RankingQueue {
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const mode: number = (!isNaN(req.query.mode) && (req.query.mode >= 0 && req.query.mode <= 2)) ? req.query.mode : 0;
            const page: number = isNaN(req.query.page) ? 1 : req.query.page;

            const queue = await RankingQueue.FetchQueue(req, mode, page - 1);

            const rankingConfig = await Ranking.GetRankingConfig(req, res);

            Responses.Send(req, res, "maps/queue", `Ranking Queue | Quaver`, {
                queue: queue.queue,
                mode: mode,
                page: page,
                pages: queue.pages,
                votesNeeded: rankingConfig.ranking.votesNeeded
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    private static async FetchQueue(req: any, mode: GameMode, page: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/mapsets/queue?page=${page}&mode=${mode}`);

            if (response.status != 200)
                return null;

            return response;
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }
}