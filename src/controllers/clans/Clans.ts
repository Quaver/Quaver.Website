import API from "../../api/API";
import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";

export default class Clans {
    public static async CreateClanGET(req: any, res: any): Promise<void> {
        try {
            Responses.Send(req, res, "clans/create", `Create clan | Quaver`, {
                title: 'Create clan'
            });
        } catch (err: any) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async CreateClanPOST(req: any, res: any): Promise<void> {
        try {
            const clanName = req.body.clan_name;
            const clanTag = req.body.clan_tag;

            if (clanName === "" || clanTag === "") {
                req.flash('error', 'Empty fields!');
                return res.redirect(303, `/clans/create`);
            }

            const clan: any = await Clans.CreateClanAPI(req, clanName, clanTag);

            if (clan.clan_id) {
                return res.redirect(303, '/clans/' + clan.clan_id);
            } else {
                req.flash('error', clan.error);
                return res.redirect(303, `/clans/create`);
            }
        } catch (err: any) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async ClanGET(req: any, res: any): Promise<void> {
        try {
            const clan: any = await Clans.FetchClan(req, req.params.id);

            if (clan.status !== 200) {
                req.flash('error', clan.error);
                return res.redirect(303, `/404`);
            }

            Responses.Send(req, res, "clans/clan", `${clan.clan.name} | Quaver`, {
                title: clan.clan.name,
                clan: clan.clan
            });
        } catch (err: any) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    // API REQUESTS

    private static async CreateClanAPI(req: any, name: string, tag: string): Promise<any[]> {
        try {
            return await API.POST(req, `v1/clans/create`, {
                name: name,
                tag: tag
            });
        } catch (err: any) {
            Logger.Error(err);
            return [];
        }
    }

    private static async FetchClan(req: any, id: number): Promise<any[]> {
        try {
            return await API.GET(req, `v1/clans/${id}`);
        } catch (err: any) {
            Logger.Error(err);
            return [];
        }
    }
}