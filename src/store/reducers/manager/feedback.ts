import { Feedback } from 'model/dto/feedback';

export enum FeedbackTypes {
    LOADED = 'FEEDBACK_LOADED',
    SAVING = 'FEEDBACK_SAVING',
    SAVED = 'FEEDBACK_SAVED',
    UPDATE = 'FEEDBACK_UPDATE',
}

export interface IFeedbackState {
    loaded: boolean;
    feedback: Feedback[];
    message?: string;
}

const initialState: IFeedbackState = {
    loaded: false,
    feedback: null,
    message: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FeedbackTypes.UPDATE:
            let editedFeedback: Feedback = action.payload,
                feedbacks = [...state.feedback],
                feedback: Feedback = feedbacks.find((item: Feedback) => editedFeedback.id === item.id);

            feedback.answer = editedFeedback.answer;

            return { ...state, loaded: true, feedback: feedbacks };
        case FeedbackTypes.LOADED:
            return { ...state, feedback: action.payload, loaded: true, message: null };
        case FeedbackTypes.SAVING:
            return { ...state, loaded: false, message: null };
        case FeedbackTypes.SAVED:
            return { ...state, feedback: action.payload, message: null, loaded: true };
        default:
            return state;
    }
}
