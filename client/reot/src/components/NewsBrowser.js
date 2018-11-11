import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import ArrowLeft from '../assets/images/icons/arrow-left.svg';
import ArrowRight from '../assets/images/icons/arrow-right.svg';
import NewsItem from './NewsItem';

const previous = (current, length) => (current - 1 + length) % length;
const next = (current, length) => (current + 1) % length;

export default class NewsBrowser extends Component {
	state = {
		currentItem: 0
	};

	indexer = (selector) => selector(this.state.currentItem, this.props.news.length);

	onNext = () => this.setState({ currentItem: this.indexer(next) });

	onPrevious = () => this.setState({ currentItem: this.indexer(previous) });

	provider = () => this.props.news[this.state.currentItem];

	render() {
		const { onNewsClick } = this.props;
		const article = this.provider();

		return (
			<Grid verticalAlign="middle" columns={4}>
				<Grid.Row>
					<Grid.Column textAlign="center">
						<Image className="clickable" src={ArrowLeft} onClick={this.onPrevious} />
					</Grid.Column>
					<Grid.Column width={8} textAlign="left">
						<NewsItem {...article} onClick={() => onNewsClick(article)} />
					</Grid.Column>
					<Grid.Column textAlign="center">
						<Image className="clickable" src={ArrowRight} onClick={this.onNext} />
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
