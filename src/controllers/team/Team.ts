import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

export default class Team {
    /**
     * Fetches and renders the team page
     * @param req 
     * @param res 
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            const team = await API.GET(req, "v1/team");

            Responses.Send(req, res, "team", "Team | Quaver", { 
                team: team.team
            });
        } catch (err) {
            Logger.Error(err);
            return Responses.Return500(req, res);
        }
    }
}