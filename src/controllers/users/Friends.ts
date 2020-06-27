import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";

export default class Friends {
    public static async GET(req: any, res: any): Promise<void> {
        try {

            const friends = await Friends.GetFriends(req, res);

            Responses.Send(req, res, "user/friends", `Friends | Quaver`, {
                friends: friends
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    private static async GetFriends(req: any, res: any): Promise<any> {
        const friends = await API.GET(req, `v1/relationships/friends/online`);

        return friends.friends;
    }
}