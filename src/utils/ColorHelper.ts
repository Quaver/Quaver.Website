export default class ColorHelper {
    public static RatingColor(rating: number): string {
        if (rating < 1)
            return 'difficulty-rating-beginner';
        else if (rating < 3.5)
            return 'difficulty-rating-easy';
        else if (rating < 8)
            return 'difficulty-rating-normal';
        else if (rating < 19)
            return 'difficulty-rating-hard';
        else if (rating < 28)
            return 'difficulty-rating-insane';

        return 'difficulty-rating-expert';
    }
}