import Jwt from "../utils/Jwt";

const axios = require("axios");
const config = require("../config/config.json");

export default class API {
    /**
     * Makes a GET request to the API
     * Automatically handles authentication if logged in.
     * @param req 
     * @param url 
     * @param params 
     */
    public static async GET(req: any, endpoint: string, params: object = {}): Promise<any> {
        const token = await API.GetToken(req);
        
        let headers: any = {};

        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        const response = await axios.get(`${config.apiBaseUrl}/${endpoint}`, {
            params: params,
            headers: headers
        });

        return response.data;
    }

    /**
     * Makes a POST request to an endpoint on the API
     * Automatically handles authentication if logged in.
     * @param req 
     * @param endpoint 
     * @param data 
     */
    public static async POST(req: any, endpoint: string, data: object = {}): Promise<any> {
        const token = await API.GetToken(req);

        let headers: any = {};

        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        const response = await axios.post(`${config.apiBaseUrl}/${endpoint}`, data, {
            headers: headers
        });

        return response.data;
    }

    /**
     * Generates a token for the logged in user to make requests
     * @param req 
     */
    private static async GetToken(req: any): Promise<string | null> {
        if (!req.user)
            return null;

        // Create and sign a JWT to give back to the user.
        const token = await Jwt.Sign({
            user: {
                id: req.user.id,
                steam_id: req.user.steam_id,
                username: req.user.username,
                privileges: req.user.privileges,
                usergroups: req.user.usergroups,
                country: req.user.country,
                avatar_url: req.user.avatar_url
            }
        }, config.jwtSecret, "1h");

        return token;
    }
}