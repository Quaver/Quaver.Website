import * as express from "express";
import Home from "../controllers/home/Home";
import Login from "../controllers/login/Login";
import Team from "../controllers/team/Team";
import Leaderboard from "../controllers/leaderboard/Leaderboard";
import Maps from "../controllers/maps/Maps";
import Users from "../controllers/users/Users";
import Playlists from "../controllers/playlists/Playlists";
const passport = require('passport');

export default class Router {
    /**
     * @param app 
     */
    public static InitializeRouter(app: Express.Application): express.Router {
        const router: express.Router = express.Router();

        router.route("/").get(Home.GET);
        router.route("/team").get(Team.GET);
        router.route("/leaderboard").get(Leaderboard.GET)
        router.route("/leaderboard/hits").get(Leaderboard.TotalHitsGET);
        router.route("/leaderboard/multiplayer").get(Leaderboard.MultiplayerGET);
        router.route("/mapset/:id").get(Maps.MapsetGET);
        router.route("/map/:id").get(Maps.MapGET);
        router.route("/user/:id").get(Users.GET);
        router.route("/playlist/:id").get(Playlists.GET);
        router.route("/login").get(Login.GET);
        router.route("/login/verify").get(Login.VerifyGET);
        router.route("/logout").get(Login.LogoutGET);
        router.route("*").get((req, res) => res.send("404"));

        return router;
    }
}