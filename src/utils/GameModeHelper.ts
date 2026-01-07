export default class GameModeHelper {
    /**
     * Maps GameMode ID to key count if it differs
     */
    private static MODE_KEY = {
        1: 4,
        2: 7,
        3: 1,
        4: 2,
        5: 3,
        6: 5,
        7: 6,
    };

    /**
     * Convert game mode to key count
     * @constructor
     * @param gm
     */
    public static gameModeKey(gm: number): number {
        return gm in GameModeHelper.MODE_KEY ? GameModeHelper.MODE_KEY[gm] : gm;
    }

    /**
     * Convert game mode to string
     * @constructor
     * @param gm
     */
    public static gameMode(gm: number): string {
        return `${GameModeHelper.gameModeKey(gm)}K`;
    }
}