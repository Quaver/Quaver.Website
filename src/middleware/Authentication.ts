export default class Authentication {
    /**
     * Requires the user to be logged in
     * @param req 
     * @param res 
     * @param next 
     */
    public static async RequireLogin(req: any, res: any, next: any): Promise<void> {
        if (!req.user)
            return res.redirect("/login");

        next();
    }
}