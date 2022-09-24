export class Feedback {
    id: number;
    rating: number;
    author: string;
    comment: string;
    answer?: string;
    date: Date;
    unreliableCount: number;
}