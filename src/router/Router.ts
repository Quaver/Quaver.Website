import * as express from "express";
import Home from "../controllers/home/Home";
import Login from "../controllers/login/Login";
import Team from "../controllers/team/Team";
import LeaderBoard from "../controllers/leaderboard/Leaderboard";
import Maps from "../controllers/maps/Maps";
import Users from "../controllers/users/Users";
import Playlists from "../controllers/playlists/Playlists";

export default class Router {
    /**
     * @param app 
     */
    public static InitializeRouter(app: Express.Application): express.Router {
        const router: express.Router = express.Router();

        router.route("/").get(Home.GET);
        router.route("/leaderboard").get(LeaderBoard.GET)
        router.route("/leaderboard/hits").get(LeaderBoard.TotalHitsGET);
        router.route("/leaderboard/multiplayer").get(LeaderBoard.MultiplayerGET);
        router.route("/mapset/:id").get(Maps.MapsetGET);
        router.route("/mapset/map/:id").get(Maps.MapGET);
        router.route("/playlist/:id").get(Playlists.GET);
        router.route("/user/:id").get(Users.GET);
        // router.route("/wiki").get(Wiki.HomeGET);
        // router.route("/wiki/*").get(Wiki.WikiPageGET);
        router.route("/login").get(Login.GET);
        router.route("/login/verify").get(Login.VerifyGET);
        router.route("/logout").get(Login.LogoutGET);
        router.route("/team").get(Team.GET);

        // Redirect old routes
        router.get('/profile/*', function(req, res){
            res.redirect('/user/' + req.params[0], 301);
        });
        router.get('/mapsets/*', function(req, res){
            res.redirect('/mapset/' + req.params[0], 301);
        });

        router.route("*").get((req, res) => res.send("404"));

        return router;
    }
}