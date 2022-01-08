export default class ColorHelper {
    public static RatingColor(rating: number): string {
        if (rating < 1) return 'difficulty-rating-beginner';
        else if (rating < 2.5) return 'difficulty-rating-easy';
        else if (rating < 10) return 'difficulty-rating-normal';
        else if (rating < 20) return 'difficulty-rating-hard';
        else if (rating < 30) return 'difficulty-rating-insane';
        else if (rating < 40) return 'difficulty-rating-expert';
        else if (rating < 50) return 'difficulty-rating-extreme';

        return 'difficulty-rating-master';
    }
}
