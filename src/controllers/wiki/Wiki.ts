import Logger from "../../logging/Logger";
import Responses from "../../utils/Responses";
const axios = require("axios");
const config = require("../../config/config.json")
const showdown  = require('showdown');
const sanitizeHtml = require('sanitize-html');

export default class Wiki {
    /**
     * Retrieves the wiki home page
     * @param req 
     * @param res 
     */
    public static async HomeGET(req: any, res: any): Promise<void> {
        try {
            const response = await axios.get(`https://raw.githubusercontent.com/${config.wikiRepository}/${config.wikiBranch}/en.md`);

            const converter = new showdown.Converter();
            const html = sanitizeHtml(converter.makeHtml(response.data));

            Responses.Send(req, res, "wiki", "Wiki | Quaver", { wikiContent: html });
        } catch (err) {
            if (err.message.includes("404"))
                return res.status(404).json({ status: 404, error: "Wiki page not found" });

            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }

    /**
     * Retrieves an individual wiki page from GitHub and renders the page
     * @param req 
     * @param res 
     */
    public static async WikiPageGET(req: any, res: any): Promise<void> {
        try {
            const page = req.url.replace("/wiki/", "");

            const response = await axios.get(`https://raw.githubusercontent.com/${config.wikiRepository}/${config.wikiBranch}/${page}/en.md`);

            const converter = new showdown.Converter();
            const html = sanitizeHtml(converter.makeHtml(response.data));

            Responses.Send(req, res, "wiki", "Wiki | Quaver", { wikiContent: html });
        } catch (err) {
            if (err.message.includes("404"))
                return res.status(404).json({ status: 404, error: "Wiki page not found" });

            Logger.Error(err);
            Responses.Return500(req, res);
        }
    }
}