import * as express from "express";
import Home from "../controllers/home/Home";
import Login from "../controllers/login/Login";
import Team from "../controllers/team/Team";
import LeaderBoard from "../controllers/leaderboard/Leaderboard";
import Maps from "../controllers/maps/Maps";
import Users from "../controllers/users/Users";
import Playlists from "../controllers/playlists/Playlists";
import Download from "../controllers/download/Download";
import Authentication from "../middleware/Authentication";
import Multiplayer from "../controllers/multiplayer/Multiplayer";
import Error from "../controllers/error/Error";
import Friends from "../controllers/users/Friends";
import Donator from "../controllers/users/Donator";
import Settings from "../controllers/users/Settings";
import Sitemap from "../controllers/sitemap/Sitemap";
import Donate from "../controllers/donate/Donate";
import RankingQueue from "../controllers/maps/RankingQueue";
// import Artists from "../controllers/artists/Artists";
import Ranking from "../controllers/ranking/Ranking";
import Oauth2 from "../controllers/developers/Oauth2";
import Applications from "../controllers/developers/Applications";
import Modding from "../controllers/maps/Modding";

export default class Router {
    /**
     * @param app
     */
    public static InitializeRouter(app: Express.Application): express.Router {
        const router: express.Router = express.Router();

        router.route("/").get(Home.GET);

        router.route("/leaderboard").get(LeaderBoard.GET);
        router.route("/leaderboard/hits").get(LeaderBoard.TotalHitsGET);
        // router.route("/leaderboard/multiplayer").get(LeaderBoard.MultiplayerGET);
        router.route("/leaderboard/countries").get(LeaderBoard.CountriesGET);

        router.route('/maps').get(Maps.MapsGET);
        router.route('/maps/load').post(Maps.MapsSearchPOST);

        // router.route('/mapsets/queue').get(RankingQueue.GET);
        router.get('/mapsets/queue', function (req: any, res: any) {
            res.redirect(301, 'https://two.quavergame.com/ranking-queue/1');
        });
        
        router.route("/mapset/:id").get(Maps.MapsetGET);
        router.route("/mapset/map/:id").get(Maps.MapGET);
        router.route("/mapset/map/:id/mods").get(Modding.ModsGET);
        router.route("/mapset/:id").post(Authentication.RequireLogin, Maps.HandlePost);
        router.route("/mapset/map/:id").post(Authentication.RequireLogin, Maps.HandlePost);
        router.route("/mapset/map/:id/mods").post(Authentication.RequireLogin, Modding.HandlePostMods);
        // router.route('/mapset/:id/ranking').get(Ranking.GET);
        router.get('/mapset/:id/ranking', function (req: any, res: any) {
            console.log(req.params[0]);
            res.redirect(301, 'hhttps://two.quavergame.com/mapsets/' + req.params[0] + '/ranking');
        });
        router.route('/mapset/:id/ranking/:action').post(Authentication.RequireLogin, Ranking.POST);
        router.route('/mapset/:id/comment').post(Authentication.RequireLogin, Ranking.CommentPOST);

        router.route("/playlists").get(Playlists.PlaylistsGET);
        router.route("/playlists/load").post(Playlists.PlaylistsMoreGET);
        router.route("/playlist/create").get(Authentication.RequireLogin, Playlists.PlaylistCrate);
        router.route("/playlist/create").post(Authentication.RequireLogin, Playlists.PlaylistCratePOST);
        router.route("/playlist/:id").get(Playlists.GET);
        router.route("/playlist/:id").post(Authentication.RequireLogin, Playlists.POST);
        router.route("/playlist/:id/edit").get(Authentication.RequireLogin, Playlists.EditPlaylist);
        router.route("/playlist/:id/edit").post(Authentication.RequireLogin, Playlists.POST);
        router.route("/playlist/map/add").post(Authentication.RequireLogin, Maps.PlaylistAddPOST);
        router.route("/playlist/map/remove").post(Authentication.RequireLogin, Maps.PlaylistRemoveMapPOST);

        router.route("/multiplayer/games").get(Multiplayer.MutliplayerGamesGET);
        router.route("/multiplayer/game/:id").get(Multiplayer.MutliplayerGameGET);
        router.route("/multiplayer/game/:id/scores").post(Multiplayer.MultiplayerMatchPOST);
        router.route("/multiplayer/game/:id/live").post(Multiplayer.MultiplayerMatchLivePOST);

        router.route("/user/:id").get(Users.GET);
        router.route("/user/maps/load").post(Users.UserMapsetsPOST);
        router.route("/user/scores/grades/load").post(Users.UserScoresGradePOST);
        router.route("/user/scores/load").post(Users.UserScoresPOST);
        router.route("/user/achievements/load").post(Users.UserAchievementsPOST);
        router.route("/user/playlists/load").post(Users.UserPlaylistsPOST);
        router.route('/user/:id/aboutme').get(Users.UserAboutMe);

        router.route("/friends").get(Authentication.RequireLogin, Friends.GET);
        router.route("/friends").post(Authentication.RequireLogin, Friends.POST);
        router.route("/friend/add").post(Authentication.RequireLogin, Friends.AddFriendPOST);
        router.route("/friend/remove").post(Authentication.RequireLogin, Friends.RemoveFriendPOST);

        router.route("/settings").get(Authentication.RequireLogin, Settings.GET);
        router.route("/settings").post(Authentication.RequireLogin, Settings.POST);
        router.route("/settings/donator").get(Authentication.RequireLogin, Donator.GET);
        router.route("/settings/donator").post(Authentication.RequireLogin, Donator.POST);

        // router.route("/donate").get(Donate.GET);
        router.get('/donate', function (req: any, res: any) {
            res.redirect(301, 'https://two.quavergame.com/donate');
        });
        
        router.route("/donate").post(Authentication.RequireLogin, Donate.POST);
        router.route("/donate/complete").post(Authentication.RequireLogin, Donate.GET);
        router.route("/donate/user").post(Donate.CardGET);
        router.route("/donate/connect").get(Authentication.RequireLogin, Donate.DiscordConnect);
        router.route("/donate/unlink").get(Authentication.RequireLogin, Donate.DiscordUnlink);

        // router.route("/artists").get(Artists.GET);
        // router.route("/artist/:id").get(Artists.ArtistGET);

        router.route("/login").get(Login.GET);
        router.route("/login/verify").get(Login.VerifyGET);
        router.route("/logout").get(Login.LogoutGET);
        router.route("/team").get(Team.GET);

        router.route("/developers/applications").get(Authentication.RequireLogin, Applications.GET);
        router.route("/developers/applications/create").get(Authentication.RequireLogin, Applications.CreateGET);
        router.route("/developers/applications/save").post(Authentication.RequireLogin, Applications.SavePOST);
        router.route("/developers/applications/:id").get(Authentication.RequireLogin, Applications.ViewGET);
        router.route("/developers/applications/:id/reset").post(Authentication.RequireLogin, Applications.ResetPOST);
        router.route("/developers/applications/:id/delete").post(Authentication.RequireLogin, Applications.DeletePOST);

        router.route("/oauth2/authorize").get(Authentication.RequireLogin, Oauth2.Authorize);
        router.route("/oauth2/authorize").post(Authentication.RequireLogin, Oauth2.POST);
        router.route("/oauth2/token").post(Oauth2.VerifyToken);
        router.route("/oauth2/me").post(Oauth2.Me);

        router.route("/download/:type/:id").get(Download.GET);

        // Redirect old routes
        router.get('/profile/*', function (req: any, res: any) {
            res.redirect(301, '/user/' + req.params[0],);
        });
        router.get('/mapsets/*', function (req: any, res: any) {
            res.redirect(301, '/mapset/' + req.params[0]);
        });
        router.get('/steam', function (req: any, res: any) {
            res.redirect(301, 'https://store.steampowered.com/app/980610/Quaver/');
        });
        router.get('/wiki/*', function (req: any, res: any) {
            res.redirect(301, 'https://wiki.quavergame.com/docs/' + req.params[0]);
        });
        router.get('/wiki', function (req: any, res: any) {
            res.redirect(301, 'https://wiki.quavergame.com/docs/');
        });
        // router.get('/multiplayer/game/*', function (req: any, res: any) {
        //     res.redirect(301, 'https://old.quavergame.com/multiplayer/game/' + req.params[0]);
        // });
        router.get('/moderators/apply', function (req: any, res: any) {
            res.redirect(301, 'https://forms.gle/1UL3jonAYEWUXD4A6');
        });
        router.get('/packranking', function (req: any, res: any) {
            res.redirect(301, 'https://forms.gle/ZpX6GmYGQEimAAbE6');
        });

        router.route("/sitemap.xml").get(Sitemap.GET);

        router.route("*").get(Error.GET);

        return router;
    }
}
