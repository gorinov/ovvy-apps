import React from 'react';
import {ReactComponent as Star} from '../images/star.svg';
import {Text} from "../utils/text";

interface IProps {
    rating: number;
    votes: number;
}

class Rating extends React.Component<IProps> {
    render() {
        const ratingString = (this.props.rating ^ 0) === this.props.rating ? this.props.rating + '.0' : this.props.rating,
            ratingVotes = this.props.votes;

        return (
            <div className="ov-rating">
                <Star className="ov-rating__icon"/>
                <div className="ov-rating__value">{ratingString}</div>
                <div className="ov-rating__votes">{ratingVotes} {Text.getNumEnding(ratingVotes, ["отзыв", "отзыва", "отзывов"])}</div>
            </div>
        );
    }
}

export default Rating;