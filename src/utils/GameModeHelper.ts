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
     * @param gm
     */
    public static gameModeKey(gm: number): number {
        return gm in GameModeHelper.MODE_KEY ? GameModeHelper.MODE_KEY[gm] : gm;
    }

    /**
     * Convert game mode to string
     * @param gm
     */
    public static gameMode(gm: number): string {
        return `${GameModeHelper.gameModeKey(gm)}K`;
    }

    /**
     * Get badge label for multiple game modes
     * Examples:
     *  - 4K
     *  - 4K / 7K
     *  - 1K / 4K
     *  - Mixed
     * @param gms
     * @returns
     */
    public static modesBadgeLabel(gms: number[]): string {
        if (gms.length <= 2)
            return gms
                .sort((a, b) => GameModeHelper.gameModeKey(a) - GameModeHelper.gameModeKey(b))
                .map(gm => GameModeHelper.gameMode(gm))
                .join(' / ');
        return 'Mixed';
    }

    /**
     * Get badge class for multiple game modes
     * Examples:
     *  - mapset-4k
     *  - mapset-7k
     *  - mapset-4k-7k
     *  - mapset-other
     * @param gms
     * @returns
     */
    public static modesBadgeClass(gms: number[]): string {
        const coloured = gms
            .map(gm => GameModeHelper.gameModeKey(gm))
            .filter(gm => gm === 4 || gm === 7)
            .sort((a, b) => a - b);

        if (coloured.length === gms.length) {
            return `mapset-${coloured.map(c => `${c}k`).join('-')}`
        }
        return 'mapset-other';
    }
}