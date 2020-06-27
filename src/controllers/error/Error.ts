import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";

export default class Home {
    /**
     * Returns error
     * @param req
     * @param res
     */
    public static async GET(req: any, res: any): Promise<void> {
        try {
            return Responses.Send(req, res, "404", "Page Not Found | Quaver", {
                code: 404,
                text: 'The page you are looking for could not be found!'
            });
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}