const jwt = require("jsonwebtoken");

export default class Jwt {
    /**
     * Signs and returns a JWT
     * @param data
     * @param secret
     * @param expires
     * @constructor
     */
    public static async Sign(data: any, secret: string, expires: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.sign(data , secret, { expiresIn: expires }, (err: any, token: any) => {
                if (err)
                    return reject(err);
                
                return resolve(token);
            }); 
        });
    }

    /**
     * Verifies a JWT token
     * @param token
     * @param secret
     * @constructor
     */
    public static async Verify(token: string, secret: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err: any, decoded: any) => resolve(decoded));
        })
    }
}