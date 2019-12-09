import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
import API from "../../api/API";

export default class Users {
    /**
     * Fetches and retrieves a user profile
     * @param req 
     * @param res 
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            let mode = parseInt(req.query.mode) || 1;

            if (mode < 1 || mode > 2)
                mode = 1;

            const tab = req.query.tab || "info";

            const user = await Users.FetchUser(req, req.params.id);

            if (!user)
                return res.status(404).json({ status: 404, error: "User not found" });

            switch (tab) {
                default:
                    Responses.Send(req, res, "user-info", `${user.info.username}'s Profile | Quaver`, { 
                        user, 
                        mode
                    });
                    break;
            }
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Fetches information for an individual user
     * @param req 
     * @param id 
     */
    private static async FetchUser(req: any, id: any): Promise<any> {
        try {
            const response = await API.GET(req, `v1/users/full/${id}`);

            if (response.status != 200)
                return null;

            const onlineStatusResponse = await API.GET(req, `v1/server/users/online/${response.user.info.id}`);
            response.user.online_status = onlineStatusResponse;
            
            return response.user;     
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }
}