const config = require("../config/config.json");

const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim();

export default class EnvironmentHelper {

    public static baseUrl(path?: string): string {
        if(path === undefined) path = '';
        return config.baseUrl + path;
    }

    public static apiBaseUrl(path?: string): string {
        if(path === undefined) path = '';
        return config.apiBaseUrl + path;
    }

    public static assets(path: string, rev?: boolean): string {
        if (config.environment === "development") {
            return path;
        } else if (config.environment === "production") {
            if (rev)
                return `${config.baseUrl}${path}?v=${revision}`;
            else
                return `${config.baseUrl}${path}`;
        } else {
            // Fall back use static
            return path;
        }
    }
}