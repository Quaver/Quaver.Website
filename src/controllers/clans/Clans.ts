import API from "../../api/API";
import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";

import bbobHTML from '@bbob/html';
import presetHTML5 from '@bbob/preset-html5';
import sanitizeHtml = require("sanitize-html");

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

            let informationFlag = true;

            // ToDo update when implemented
            if (clan.information) {
                // Check if information fields are empty
                for (let key in clan.information) {
                    if ((clan.information[key] !== null && clan.information[key] != ""))
                        informationFlag = false;
                }
            }

            if (informationFlag) clan.information = null;

            Responses.Send(req, res, "clans/clan", `${clan.clan.name} | Quaver`, {
                title: clan.clan.name,
                clan: clan.clan
            });
        } catch (err: any) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    public static async ClanAboutMe(req: any, res: any): Promise<any> {
        try {
            let clan: any = await Clans.FetchClan(req, req.params.id);

            if (clan.status !== 200) {
                req.flash('error', clan.error);
                return res.redirect(303, `/404`);
            }

            clan = clan.clan;

            let bio: any = null;

            if (clan.about_me) {
                bio = sanitizeHtml(
                    bbobHTML(clan.about_me, presetHTML5(), {
                        onlyAllowTags: ['span', 'a', 'strong', 'b', 'img', 'center', 'p', 'i', 'u',
                            'hr', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'url']
                    }),
                    {
                        allowedTags: ['span', 'a', 'strong', 'img', 'center', 'h1', 'h2', 'h3', 'h4', 'h5',
                            'p', 'i', 'u', 'hr', 'ul', 'ol', 'li', 'details', 'summary'],
                        allowedAttributes: {
                            'a': ['href', 'target'],
                            'img': ['src']
                        },
                        allowedClasses: {
                            'img': ['lazy']
                        },
                        transformTags: {
                            'a': function (tagName, attribs) {
                                attribs['target'] = "_blank";
                                return {
                                    tagName: tagName,
                                    attribs: attribs
                                }
                            }
                        },
                        disallowedTagsMode: 'escape'
                    });

                if (bio !== "") {
                    bio = bio.split(/\r\n|\n|\r/);
                }
            }

            Responses.Send(req, res, 'user/user-about-me', 'About Me', {
                bio
            });
        } catch (err) {
            Logger.Error(err);
            Responses.ReturnUserNotFound(req, res);
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