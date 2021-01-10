import Responses from "../../utils/Responses";
import Logger from "../../logging/Logger";
import API from "../../api/API";
import SqlDatabase from "../../database/SqlDatabase";

export default class Settings {
    public static validNames = ["discord", "twitter", "twitch", "youtube"];

    public static async GET(req: any, res: any): Promise<void> {
        try {
            const user = await Settings.FetchUser(req, req.user.id);

            Responses.Send(req, res, "user/settings", `Settings | Quaver`, {
                information: user.info.information,
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
        }
    }

    public static async POST(req: any, res: any): Promise<void> {
        try {
            const user = await Settings.FetchUser(req, req.user.id);

            let information = user.info.information;

            if (req.body.information) {
                for (const [key, value] of Object.entries(req.body.information)) {
                    // Validate allowed inputs
                    if (Settings.validNames.includes(key)) {
                        // Replace any unwanted content
                        information[key] = Settings.htmlEntities(value);
                    }
                }

                await SqlDatabase.Execute("UPDATE users SET information = ? WHERE id = ?", [JSON.stringify(information), req.user.id]);
                req.flash('success', "Profile updated successfully.");
            } else {
                req.flash('error', "Something went wrong.");
            }

            res.redirect(301, `/settings`);
        } catch (err) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    static async FetchUser(req: any, id: any): Promise<any> {
        const response = await API.GET(req, `v1/users/full/${id}`);

        if (response.status != 200)
            return null;

        return response.user;
    }

    static htmlEntities(str: any) {
        return String(str).replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}