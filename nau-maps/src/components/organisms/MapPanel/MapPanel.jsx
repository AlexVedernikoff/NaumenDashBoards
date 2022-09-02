// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './MapPanel.less';

export class MapPanel extends Component<Props> {
	constructor (props: Props) {
		super(props);
		this.panelContainerRef = React.createRef();
	}

	handleClick = name => () => {
		const {setMapPanel, toggleMapPanel} = this.props;
		toggleMapPanel();
		setMapPanel(name);
	};

	renderList () {
		const {mapsKeyList} = this.props;

		return (
			<ul className={styles.panelMapList}>
				{Object.keys(mapsKeyList).map(this.renderListItem)}
			</ul>
		);
	}

	renderListItem = name => {
		/* Временная мера из за не возможности работы с google maps */
		if (name === 'google') return null;

		return (
			<li className={styles.panelMapItem} key={name} onClick={this.handleClick(name)}>{name}</li>
		);
	};

	render () {
		const {panelMapOpen} = this.props;

		if (panelMapOpen) {
			return (
				<div className={styles.panelMapWrap}>
					{this.renderList()}
				</div>
			);
		}

		return null;
	}
}

export default connect(props, functions)(MapPanel);
