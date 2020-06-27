export default class GameModeHelper {
    /**
     * Convert game mode to string
     * @constructor
     * @param gm
     */
    public static gameMode(gm: number): string {
        if (gm == 1)
            return '4K';
        else
            return '7K';
    }
}