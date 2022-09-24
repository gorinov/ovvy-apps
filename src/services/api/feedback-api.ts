import { BaseApi } from './base.api';
import { FeedbackResponse } from '../../model/api/feedback';
import { BaseResponse } from '../../model/api/base.response';
import { Feedback } from '../../model/dto/feedback';

export class FeedbackApi extends BaseApi {
    public static async getAll(): Promise<FeedbackResponse> {
        const response = await this.instance.get('/api/feedback/', {
            params: {
                action: 'getAll',
            },
        });

        return response.data;
    }

    public static async setAnswer(feedback: Feedback): Promise<BaseResponse> {
        const response = await this.instance.post('/api/feedback/', {
            action: 'setAnswer',
            params: {
                id: feedback.id,
                answer: feedback.answer,
            },
        });

        return response.data;
    }
}
