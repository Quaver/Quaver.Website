import Responses from "../../utils/Responses";
import GameModeHelper from "../../utils/GameModeHelper";
import Logger from "../../logging/Logger";
import API from "../../api/API";
import ModStatus from "../../enums/ModStatus";
import Maps from "./Maps";

const showdown = require('showdown');
const sanitizeHtml = require('sanitize-html');

const allowedHTML = ['span', 'a', 'strong', 'img', 'center', 'h1', 'h2', 'h3', 'h4', 'h5', 'code', 'b', 'pre',
    'p', 'i', 'u', 'hr', 'ul', 'ol', 'li', 'details', 'summary', 'br', 'em', 'blockquote', 'table', 'tr', 'td', 'th', 'thead', 'tbody'];

export default class Modding {
    /**
     * Fetches and returns the page for modding
     * @param req
     * @param res
     */
    public static async ModsGET(req: any, res: any): Promise<void> {
        try {
            const map = await Maps.FetchMap(req, req.params.id);

            if (!map)
                return res.status(404).json({status: 404, error: "Map not found"});

            let mapset = await Maps.FetchMapset(req, map.mapset_id);

            // Sort difficulties
            mapset.maps = await Maps.SortDifficulties(mapset.maps);

            mapset.description = sanitizeHtml(new showdown.Converter().makeHtml(mapset.description));

            if (!mapset)
                return Responses.ReturnMapsetNotFound(req, res);

            let mods = await Modding.FetchMods(req, map.id);

            const matchSrc = new RegExp("src=['\"](?:[^\"'\\/]\\/)*([^'\"]+)['\"]");
            const image = `data-src='$1' class="lazy"`;

            for (let mod in mods) {
                mods[mod].mod.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[mod].mod.comment), {
                    allowedTags: allowedHTML,
                    allowedAttributes: {
                        'a': ['href'],
                        // 'span': ['style'],
                        'img': ['src']
                    },
                    disallowedTagsMode: 'escape'
                });
                // Replace <code> with link to editor
                mods[mod].mod.comment = await Modding.ReplaceCode(mods[mod].mod.comment);
                // Make images lazy load - ToDo replaceAll
                mods[mod].mod.comment = mods[mod].mod.comment.replace(matchSrc, image);

                // Mod replies
                for (let reply in mods[mod].mod.replies) {
                    mods[mod].mod.replies[reply].message.comment = sanitizeHtml(new showdown.Converter().makeHtml(mods[mod].mod.replies[reply].message.comment), {
                        allowedTags: allowedHTML,
                        allowedAttributes: {
                            'a': ['href'],
                            'span': ['style'],
                            'img': ['src']
                        },
                        disallowedTagsMode: 'escape'
                    });

                    // Replace <code> with link to editor
                    mods[mod].mod.replies[reply].message.comment = await Modding.ReplaceCode(mods[mod].mod.replies[reply].message.comment);
                    // Make images lazy load - ToDo replaceAll
                    mods[mod].mod.replies[reply].message.comment = mods[mod].mod.replies[reply].message.comment.replace(matchSrc, image);
                }
            }

            const filter = req.query.filter ? req.query.filter : '';

            if (filter != null) {
                await Modding.SortMods(mods, filter);
            }

            Responses.Send(req, res, "modding/modding", `${mapset.artist} - ${mapset.title} by: ${mapset.creator_username} | Quaver`, {
                mapset: mapset,
                map: map,
                mods: mods,
                modding: true,
                filter: filter,
                gameMode: GameModeHelper.gameMode
            });
        } catch (err: any) {
            Logger.Error(err);
            Responses.ReturnMapsetNotFound(req, res);
        }
    }

    private static async SortMods(mods: any, filter: any): Promise<any> {
        const statuses: any = {
            "Pending": 0,
            "Accepted": 1,
            "Denied": 2,
            "Ignored": 3
        };

        switch (filter) {
            case 'status':
                mods.sort((a: any, b: any) => statuses[a.mod.status] - statuses[b.mod.status]);
                break;
            case 'time':
                mods.sort((a: any, b: any) => b.mod.id - a.mod.id);
                break;
            case 'type':
                mods.sort((a: any, b: any) => statuses[a.mod.type] - statuses[b.mod.type]);
                break;
            default:
                mods.sort((a: any, b: any) => b.mod.id - a.mod.id);
                break;
            // mods.sort((a:any, b:any) => a.mod.id - b.mod.id);
            // break;
        }

        return mods;
    }


    public static async HandlePostMods(req: any, res: any): Promise<any> {
        try {
            if (typeof req.body.submit_mod !== 'undefined') {
                const mod = await API.POST(req, `v1/maps/${req.params.id}/mods`, {
                    type: req.body.type,
                    timestamp: req.body.timestamp,
                    comment: req.body.comment
                });

                res.redirect(303, `/mapset/map/${req.params.id}/mods#mod_${mod.mod_id}`);

                return;
            } else if (typeof req.body.submit_comment !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/comment`, {
                    comment: req.body.comment
                });

                res.redirect(303, `/mapset/map/${req.params.id}/mods#mod_${req.body.mod_id}`);

                return;
            } else if (typeof req.body.mod_accept !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Accepted
                });
            } else if (typeof req.body.mod_deny !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Denied
                });
            } else if (typeof req.body.mod_ignore !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Ignored
                });
            } else if (typeof req.body.mod_revert !== 'undefined') {
                await API.POST(req, `v1/maps/mods/${req.body.mod_id}/status`, {
                    status: ModStatus.Pending
                });
            }

            res.redirect(303, `/mapset/map/${req.params.id}/mods`);
        } catch (err: any) {
            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     *
     * @param timestamp
     * @constructor
     */

    private static async ReplaceCode(timestamp: any): Promise<any> {
        const regex_code = /<code>((\d+\|\d(,\d+\|\d)*)|(\d+))<\/code>/g

        return timestamp.replace(regex_code, function (p: any) {
            const matches = p.split(regex_code);
            return `<a href="quaver://editor/${matches[1]}"><span>${matches[1]}</span></a>`;
        });
    }

    /**
     * Fetches map mods
     */
    static async FetchMods(req: any, id: number): Promise<any> {
        try {
            const response = await API.GET(req, `v1/maps/${id}/mods`);

            if (response.status != 200)
                return null;
            return response.mods;
        } catch (err: any) {
            Logger.Error(err);
            return null;
        }
    }
}