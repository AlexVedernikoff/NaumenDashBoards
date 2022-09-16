// @flow
import {connect} from 'react-redux';
import PanelPoint from 'components/molecules/PanelPoint';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import type {Trail} from 'types/trail';

export class PanelContent extends Component<Props> {
	renderObject = (object: Trail, key: number) => {
		return <PanelPoint key={key} point={object} />;
	};

	render () {
		const {points, showSingleObject, singleObject} = this.props;

		if (showSingleObject) {
			return this.renderObject(singleObject, singleObject.data.uuid);
		}

		return points.map(this.renderObject);
	}
}

export default connect(props)(PanelContent);
