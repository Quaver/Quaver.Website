document.addEventListener("DOMContentLoaded", function (event) {
    Vue.config.devtools = true;
    Vue.options.delimiters = ['${', '}'];
    Vue.component('$http', VueResource);

    new Vue({
        el: "#multiplay",
        data() {
            return {
                game: '',
                scores: '',
                cache_scores: {},
                live: '',
                offline: '',
                timer: '',
                players: '',
                team_board: [],
                team_live_board: [],
                is_in_progress: false
            }
        },
        methods: {
            sortLeaderboard: function(arr) {
                var ctx = this;
                const temp = arr.slice();
                if (ctx.live.game.in_progress) {
                    // Remove null scores from the list if the game has started
                    for (let i = temp.length - 1; i >= 0; i--) {
                        if (!temp[i].score)
                            temp.splice(i, 1);
                    }
                    switch (ctx.live.rules.ruleset) {
                        case ctx.rulesets.Team:
                            // Sort by rating
                            temp.sort(function(a, b) {
                                return b.score.performance_rating - a.score.performance_rating;
                            });
                            // Then sort by teams
                            temp.sort(function(a, b) {
                                return a.team - b.team;
                            });
                            break;
                        case ctx.rulesets.Free_For_All:
                            temp.sort(function(a, b) {
                                return b.score.performance_rating - a.score.performance_rating;
                            });
                            break;
                        case ctx.rulesets.Battle_Royale:
                            temp.sort(function(a, b) {
                                return b.score.battle_royale_rank - a.score.battle_royale_rank;
                            });
                            break;
                    }
                } else {
                    switch (ctx.live.rules.ruleset) {
                        case ctx.rulesets.Team:
                            // Then sort by teams
                            temp.sort(function(a, b) {
                                return a.team - b.team;
                            });
                            break;
                        default:
                            break;
                    }
                }
                return temp;
            },
            loadMatch: function() {
                this.$http.get(apiBaseUrl() + `/v1/multiplayer/games/${mpId}`).then(function(resp) {
                    this.game = resp.data;
                });
            },
            averageRating: function(players, live = false) {
                let teams = {
                    'red': 0,
                    'blue': 0
                }
                let players_count = {
                    'red': 0,
                    'blue': 0
                }
                players.forEach(player => {
                    if (live) {
                        if (this.live.game.in_progress) {
                            if (player.team === 0 && player.score) {
                                players_count.red += 1;
                                teams.red += player.score.performance_rating;
                            } else if (player.team === 1 && player.score) {
                                players_count.blue += 1;
                                teams.blue += player.score.performance_rating;
                            }
                        }
                    } else {
                        if (player.score.team === 0) {
                            players_count.red += 1;
                            teams.red += player.score.performance_rating;
                        } else if (player.score.team === 1) {
                            players_count.blue += 1;
                            teams.blue += player.score.performance_rating;
                        }
                    }
                });
                if (players_count.red)
                    teams.red = teams.red / players_count.red;
                if (players_count.blue)
                    teams.blue = teams.blue / players_count.blue;
                return teams;
            },
            isLive: function() {
                this.$http.get(apiBaseUrl() + `/v1/multiplayer/games/${mpId}/live`).then(function(resp) {
                    if (resp.data.status === 404) {
                        clearInterval(this.timer);
                        this.timer = '';
                        this.live = '';
                        return;
                    }
                    this.live = resp.data;
                    if (this.live.game.in_progress) {
                        this.is_in_progress = true;
                    } else {
                        if (this.is_in_progress !== this.live.game.in_progress) {
                            $('.collapse').removeClass("show");
                            this.is_in_progress = false;
                        }
                    }
                    this.team_live_board = this.averageRating(resp.data.players, true);
                    this.loadMatch();
                    if (!this.timer)
                        this.timer = setInterval(this.isLive, 6000);
                }, response => {
                    clearInterval(this.timer);
                    this.timer = '';
                    this.live = '';
                });
            },
            loadScores: function(id, index) {
                if (this.cache_scores[id] == null) {
                    this.$http.get(apiBaseUrl() + `/v1/multiplayer/match/${id}`).then(function(resp) {
                        this.cache_scores[id] = resp.data.match.scores;
                        this.scores = resp.data.match.scores;
                        this.team_board = this.averageRating(resp.data.match.scores);
                        setTimeout(function() {
                            $(`#match_${id}`).collapse("toggle");
                        }, 100);
                    });
                } else {
                    this.scores = this.cache_scores[id];
                    this.team_board = this.averageRating(this.cache_scores[id]);
                    $(`#match_${id}`).collapse("toggle");
                }
            }
        },
        created: function () {
            this.loadMatch();
            this.isLive();
        }
    });
});