import Responses from "../../utils/Responses";
import SqlDatabase from "../../database/SqlDatabase";

const crypto = require('crypto');

const config = require("../../config/config.json");

export default class Applications {
    public static applicationsLimit = 10;

    public static async GET(req: any, res: any): Promise<void> {
        const fetchApplications = await SqlDatabase.Execute("SELECT * FROM applications WHERE user_id = ? AND active = 1 ORDER BY id DESC", [req.user.id]);

        Responses.Send(req, res, "developers/applications", "Applications | Quaver", {
            applications: fetchApplications
        });
    }

    public static async CreateGET(req: any, res: any): Promise<void> {
        Responses.Send(req, res, "developers/application", "Create Application | Quaver", {
            edit: false
        });
    }

    public static async ViewGET(req: any, res: any): Promise<void> {
        const applicationId = req.params.id;
        const application = await Applications.ApplicationCheck(req, applicationId);

        if (!application) {
            req.flash('error', 'You are not the owner of this application!');
            return res.redirect(303, `/developers/applications`);
        }

        const fetchApplication = await SqlDatabase.Execute("SELECT * FROM applications WHERE id = ? LIMIT 1", [applicationId]);

        const authorizeUrl = `${config.baseUrl}/oauth2/authorize?client_id=${fetchApplication[0].client_id}&redirect_uri=${fetchApplication[0].redirect_url}`;

        Responses.Send(req, res, "developers/application", "Application | Quaver", {
            edit: true,
            application: fetchApplication[0],
            authorizeUrl: authorizeUrl
        });
    }

    public static async SavePOST(req: any, res: any): Promise<void> {
        const applicationId = req.body.application_id;
        const name = await Applications.htmlEntities(req.body.application_name);
        const redirectUrl = req.body.application_redirect_url;
        let isEdit = false;

        if (name === "" || redirectUrl === "") {
            req.flash('error', 'Empty fields!');
            return res.redirect(303, `/developers/applications/create`);
        }

        if (applicationId !== undefined) {
            const application = await Applications.ApplicationCheck(req, applicationId);
            if (!application) {
                req.flash('error', 'You are not the owner of this application!');
                return res.redirect(303, `/developers/applications`);
            }

            isEdit = true;
        } else {
            // Check if user can create more applications
            const userApplications = await SqlDatabase.Execute("SELECT COUNT(id) as count FROM applications WHERE user_id = ? AND active = 1", [req.user.id]);

            if(userApplications[0].count >= Applications.applicationsLimit) {
                req.flash('error', `You cannot create more than ${Applications.applicationsLimit} applications!`);
                return res.redirect(303, `/developers/applications`);
            }
        }

        try {
            // Validates the redirect url
            new URL(redirectUrl);

            if (!isEdit) {
                const client_id = await Applications.GenerateToken(16);
                const client_secret = await Applications.GenerateToken(32);
                const now = Math.round((new Date()).getTime());

                const newApplication = await SqlDatabase.Execute("INSERT INTO applications (user_id, name, redirect_url, client_id, client_secret, timestamp) VALUES " +
                    "(?, ?, ?, ?, ?, ?)", [req.user.id, name, redirectUrl, client_id, client_secret, now]);

                req.flash('success', 'Application successfully created!');

                return res.redirect("/developers/applications/" + newApplication.insertId);
            } else {
                await SqlDatabase.Execute("UPDATE applications SET name = ?, redirect_url = ? WHERE id = ?", [name, redirectUrl, applicationId]);

                req.flash('success', 'Changes successfully saved!');

                return res.redirect("/developers/applications/" + applicationId);
            }
        } catch (e) {
            req.flash('error', 'Invalid Redirect URL!');
            if (isEdit) return res.redirect(303, `/developers/applications/token`);
            else return res.redirect(303, `/developers/applications/create`);
        }
    }

    public static async ResetPOST(req: any, res: any): Promise<void> {
        const applicationId = req.params.id;
        const application = await Applications.ApplicationCheck(req, applicationId);

        if (!application) {
            req.flash('error', 'You are not the owner of this application!');
            return res.redirect(303, `/developers/applications`);
        }

        const key = await Applications.GenerateToken(32);

        await SqlDatabase.Execute("UPDATE applications SET client_secret = ? WHERE id = ?", [key, applicationId]);

        req.flash('success', 'New token is generated!');

        return res.redirect(303, `/developers/applications/` + applicationId);
    }

    public static async DeletePOST(req: any, res: any): Promise<void> {
        const applicationId = req.params.id;
        const application = await Applications.ApplicationCheck(req, applicationId);

        if (!application) {
            req.flash('error', 'You are not the owner of this application!');
            return res.redirect(303, `/developers/applications`);
        }

        await SqlDatabase.Execute("UPDATE applications SET active = 0 WHERE id = ?", [applicationId]);

        req.flash('success', 'The application is deleted!');

        return res.redirect(303, `/developers/applications`);
    }

    private static async ApplicationCheck(req: any, id: number): Promise<boolean> {
        const userId = req.user.id;

        const fetch = await SqlDatabase.Execute("SELECT 1 FROM applications WHERE id = ? AND user_id = ? AND active = 1 LIMIT 1", [id, userId]);

        if (fetch.length) return true;
        return false;
    }

    public static async VerifyToken(token): Promise<boolean> {
        const fetch = await SqlDatabase.Execute("SELECT 1 FROM applications WHERE client_secret = ? AND active = 1 LIMIT 1", [token]);

        if (fetch.length) return true;
        return false;
    }

    public static async FetchClientSecret(clientId: string) {
        const fetch = await SqlDatabase.Execute("SELECT client_secret, redirect_url FROM applications WHERE client_id = ? AND active = 1 LIMIT 1", [clientId]);

        if (fetch.length) {
            return fetch[0];
        }

        return null;
    }

    public static async ApplicationUsage(client_secret): Promise<void> {
        const fetch = await SqlDatabase.Execute("SELECT id FROM applications WHERE client_secret = ? AND active = 1 LIMIT 1", [client_secret]);

        if (fetch.length) {
            const now = Math.round((new Date()).getTime());

            await SqlDatabase.Execute("INSERT INTO applications_usage (application_id, timestamp) VALUES (?, ?)", [fetch[0].id, now]);
        }
    }

    private static async GenerateToken(size: number): Promise<string> {
        return crypto.randomBytes(size).toString('hex');
    }

    private static async htmlEntities(str: any): Promise<string> {
        return String(str).replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}