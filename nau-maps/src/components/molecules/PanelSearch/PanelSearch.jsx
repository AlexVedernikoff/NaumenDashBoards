// @flow
import {clearString, debounce} from 'helpers/core';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PointSearch from 'icons/PointSearch';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelSearch.less';

export class PanelSearch extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.debounceSearch = debounce(this.handleSearch);

		this.state = {
			value: ''
		};
	}

	componentDidUpdate (prevProps: Props) {
		const {searchQuery} = this.props;

		if (searchQuery !== this.state.value && !searchQuery.length && prevProps.searchQuery.length) {
			this.setState({value: ''});
		}
	}

	handleInput = ({target: {value}}) => {
		this.debounceSearch(value);
		this.setState({value});
	};

	handleSearch = (value: string) => {
		const {searchMapObject} = this.props;
		searchMapObject(clearString(value));
	};

	renderIcon = () => {
		return (
			<div className={styles.icon}>
				<PointSearch />
			</div>
		);
	};

	renderInput = () => {
		return <input className={styles.input} onInput={this.handleInput} type='text' value={this.state.value}></input>;
	};

	render () {
		return (
			<div className={styles.container} >
				{this.renderIcon()}
				{this.renderInput()}
			</div>
		);
	}
}

export default connect(props, functions)(PanelSearch);
