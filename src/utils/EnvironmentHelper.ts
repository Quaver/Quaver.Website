const config = require("../config/config.json");

const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim();

export default class EnvironmentHelper {

    public static baseUrl(path?: string): string {
        if(path === undefined) return config.baseUrl;
        return config.baseUrl + path;
    }

    public static apiBaseUrl(path?: string): string {
        if(path === undefined)
            return config.apiBaseUrlPublic;
        return config.apiBaseUrlPublic + path;
    }

    public static assets(path: string, rev: boolean = false): string {
        if (config.environment === "development") {
            return path;
        } else if (config.environment === "production") {
            if (rev)
                return `${config.staticUrl}${path}?v=${revision}`;
            else
                return `${config.staticUrl}${path}`;
        } else {
            // Fall back use static
            return path;
        }
    }
}