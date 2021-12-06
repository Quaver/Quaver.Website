import Responses from "../../utils/Responses";
import Maps from "../maps/Maps";
import GameModeHelper from "../../utils/GameModeHelper";
import UserHelper from "../../utils/UserHelper";
import Privileges from "../../enums/Privileges";
import API from "../../api/API";
import Logger from "../../logging/Logger";
import MapsetRankingStatus from "../../enums/MapsetRankingStatus";
import Modding from "../maps/Modding";

export default class Ranking {

    public static async GET(req: any, res: any): Promise<void> {

        let mapset = await Maps.FetchMapset(req, req.params.id);
        // Mapset doesn't exist or is hidden, so return a 404.
        if (!mapset)
            return Responses.ReturnMapsetNotFound(req, res);

        // Check if mapset is submitted for rank
        if (!mapset.mapset_ranking_queue_id) {
            req.flash('error', "Mapset is not submitted for rank!");
            return res.redirect('/mapset/' + mapset.id);
        }

        const rankingConfig = await Ranking.GetRankingConfig(req, res);

        // Get modding count
        for(const map of mapset.maps) {
            let mods = await Modding.FetchMods(req, map.id);
            map.count = mods.length;
        }

        const comments = await Maps.FetchSupervisorComments(req, mapset.id);
        let votes: any = null
        if (req.user) {
            votes = await Ranking.GetVotes(req, res);
        }
        const map = mapset.maps[mapset.maps.length - 1];

        // Sort difficulties
        mapset.maps = await Maps.SortDifficulties(mapset.maps);

        Responses.Send(req, res, "ranking/ranking", `Ranking ${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
            mapset: mapset,
            map: map,
            comments: comments,
            gameMode: GameModeHelper.gameMode,
            votes: votes,
            votesNeeded: rankingConfig.ranking.votesNeeded
        });
    }

    public static async POST(req: any, res: any): Promise<void> {
        let mapset = await Maps.FetchMapset(req, req.params.id);
        // Mapset doesn't exist or is hidden, so return a 404.
        if (!mapset)
            return Responses.ReturnMapsetNotFound(req, res);

        if(mapset.ranking_queue_status === MapsetRankingStatus.Ranked) {
            req.flash('error', "Mapset already ranked!");
            return res.redirect('/mapset/' + mapset.id);
        }

        // Check if logged user is Ranking Supervisor
        if (!UserHelper.HasPrivilege(req.user, Privileges.RankMapsets)) {
            req.flash('error', "No privileges!");
            return res.redirect('/mapset/' + mapset.id);
        }

        const action = req.params.action;

        const response: any = await API.POST(req, `v1/mapsets/${req.params.id}/ranking/${action}`, {});

        req.flash('success', response.msg);
        return res.redirect('/mapset/' + mapset.id + '/ranking');
    }

    public static async CommentPOST(req: any, res: any): Promise<void> {
        try {
            if (typeof req.body.submit_comment !== 'undefined') {
                if (req.body.comment !== "")
                    await API.POST(req, `v1/mapsets/${req.body.mapset_id}/comment`, {
                        comment: req.body.comment
                    });

                res.redirect(303, `/mapset/${req.body.mapset_id}/ranking#comments`);
                return;
            }
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async GetVotes(req: any, res: any): Promise<any> {
        try {
            const id = req.params.id;

            const response = await API.POST(req, `v1/mapsets/${id}/ranking/votes`);

            if (response.status != 200) {
                Logger.Error(response);
                Responses.Return500(req, res);
                return;
            }

            return response;
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

    public static async GetRankingConfig(req: any, res: any): Promise<any> {
        try {
            const response = await API.GET(req, `v1/ranking/config`);

            if (response.status != 200) {
                Logger.Error(response);
                Responses.Return500(req, res);
                return;
            }

            return response;
        } catch (err) {
            Logger.Error(err);
            return [];
        }
    }

}