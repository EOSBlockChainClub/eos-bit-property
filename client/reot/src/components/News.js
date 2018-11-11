import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewsBrowser from './NewsBrowser';
import * as actions from '../actions';
import { getNews } from '../reducers';

class News extends Component {
	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		const { fetchNews } = this.props;
		fetchNews();
	}

	onNewsClick(news) {
		const { url } = news;
		window.open(url);
	}

	render() {
		const { news } = this.props;
		return <NewsBrowser news={news} onNewsClick={this.onNewsClick} />;
	}
}

const mapStateToProps = (state) => ({
	news: getNews(state)
});

News = connect(mapStateToProps, actions)(News);

export default News;
