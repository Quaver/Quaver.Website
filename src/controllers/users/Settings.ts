import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";

export default class Settings {
    public static async GET(req: any, res: any): Promise<void> {
        try {


            Responses.Send(req, res, "user/settings", `Settings | Quaver`, {
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }
}