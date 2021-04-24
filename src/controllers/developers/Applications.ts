import Responses from "../../utils/Responses";
import SqlDatabase from "../../database/SqlDatabase";

const crypto = require('crypto');

/*
ToDo
Implement application limit
Implement the token in oauth2
 */

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

        if(!application) {
            req.flash('error', 'You are not the owner of this application!');
            return res.redirect(303, `/developers/applications`);
        }

        const fetchApplication = await SqlDatabase.Execute("SELECT * FROM applications WHERE id = ? LIMIT 1", [applicationId]);

        Responses.Send(req, res, "developers/application", "Application | Quaver", {
            edit: true,
            application: fetchApplication[0]
        });
    }

    public static async SavePOST(req: any, res: any): Promise<void> {
        const applicationId = req.body.application_id;
        const name = await Applications.htmlEntities(req.body.application_name);
        const redirectUrl = req.body.application_redirect_url;
        let isEdit = false;

        if(name === "" || redirectUrl === "") {
            req.flash('error', 'Empty fields!');
            // ToDo return form
            return res.redirect(303, `/developers/applications/create`);
        }

        if (applicationId !== undefined) {
            const application = await Applications.ApplicationCheck(req, applicationId);
            if (!application) {
                req.flash('error', 'You are not the owner of this application!');
                return res.redirect(303, `/developers/applications`);
            }

            isEdit = true;
        }

        try {
            // Validates the redirect url
            new URL(redirectUrl);

            if(!isEdit) {
                const key = await Applications.GenerateToken();
                const now = Math.round((new Date()).getTime());

                const newApplication = await SqlDatabase.Execute("INSERT INTO applications (user_id, name, redirect_url, token, timestamp) VALUES " +
                    "(?, ?, ?, ?, ?)", [req.user.id, name, redirectUrl, key, now]);

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

        if(!application) {
            req.flash('error', 'You are not the owner of this application!');
            return res.redirect(303, `/developers/applications`);
        }

        const key = await Applications.GenerateToken();

        await SqlDatabase.Execute("UPDATE applications SET token = ? WHERE id = ?", [key, applicationId]);

        req.flash('success', 'New token is generated!');

        return res.redirect(303, `/developers/applications/` + applicationId);
    }

    public static async DeletePOST(req: any, res: any): Promise<void> {
        const applicationId = req.params.id;
        const application = await Applications.ApplicationCheck(req, applicationId);

        if(!application) {
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
        const fetch = await SqlDatabase.Execute("SELECT 1 FROM applications WHERE token = ? AND active = 1 LIMIT 1", [token]);

        if (fetch.length) return true;
        return false;
    }

    private static async GenerateToken(): Promise<string> {
        return crypto.randomBytes(32).toString('hex');
    }

    private static async htmlEntities(str: any): Promise<string> {
        return String(str).replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}