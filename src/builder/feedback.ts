import {Feedback} from "../model/dto/feedback";
import {FeedbackInfo} from "../model/api/feedback";

export class FeedbackBuilder {
    static build(feedbackInfo: FeedbackInfo): Feedback {
        let feedback: Feedback = new Feedback();

        feedback.id = feedbackInfo.id;
        feedback.author = feedbackInfo.author;
        feedback.comment = feedbackInfo.comment;
        feedback.rating = feedbackInfo.rating;
        feedback.unreliableCount = feedbackInfo.unreliableCount;
        feedback.date = new Date(feedbackInfo.time * 1000);
        feedback.answer = feedbackInfo.answer;

        return feedback;
    }
}
