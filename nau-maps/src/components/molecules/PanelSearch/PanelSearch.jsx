// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PointSearch from 'icons/PointSearch';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelSearch.less';

export class PanelSearch extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.throttlingTimeout = null;

		this.state = {
			value: ''
		};
	}

	handleInput = e => {
		clearTimeout(this.throttlingTimeout);

		const {mapObjects, setSearchObjects, setSearchText} = this.props;
		const clearString = v => v.toLowerCase().replace(/\s/g, '');
		const value = e.target.value;

		this.setState({value});

		this.throttlingTimeout = setTimeout(() => {
			setSearchText(value);

			if (value) {
				const objectsSearch = mapObjects.filter(point => {
					return clearString(point.data.header).includes(clearString(value));
				});

				setSearchObjects(objectsSearch);
			} else {
				setSearchObjects([]);
			}
		}, 500);
	};

	renderIcon = () => {
		return (
			<div className={styles.icon}>
				<PointSearch />
			</div>
		);
	};

	renderInput = () => {
		const {value} = this;
		return <input className={styles.input} onInput={this.handleInput} type='text' value={value}></input>;
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
