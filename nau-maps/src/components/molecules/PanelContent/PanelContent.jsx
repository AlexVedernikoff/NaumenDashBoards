// @flow
import {connect} from 'react-redux';
import PanelPoint from 'components/molecules/PanelPoint';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelContent.less';
import type {Trail} from 'types/trail';

export class PanelContent extends Component<Props> {
	renderNoSearch = () => {
		return <div className={styles.text}>По такому запросу ничего не найдено.</div>;
	};

	renderObject = (object: Trail, key: number) => {
		return <PanelPoint key={key} point={object} />;
	};

	render () {
		const {points, searchObjects, searchText, showSingleObject, singleObject} = this.props;

		if (showSingleObject) {
			return this.renderObject(singleObject, singleObject.data.uuid);
		}

		if (searchText) {
			if (searchObjects.length) {
				return searchObjects.map(this.renderObject);
			} else {
				return this.renderNoSearch();
			}
		}

		return points.map(this.renderObject);
	}
}

export default connect(props)(PanelContent);
