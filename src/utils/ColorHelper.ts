export default class ColorHelper {
    public static RatingColor(rating: number): string {
        if (rating < 2) return 'difficulty-rating-beginner';
        else if (rating < 5) return 'difficulty-rating-easy';
        else if (rating < 20) return 'difficulty-rating-normal';
        else if (rating < 40) return 'difficulty-rating-hard';
        else if (rating < 60) return 'difficulty-rating-insane';
        else if (rating < 80) return 'difficulty-rating-expert';
        else if (rating < 100) return 'difficulty-rating-extreme';

        return 'difficulty-rating-master';
    }
}