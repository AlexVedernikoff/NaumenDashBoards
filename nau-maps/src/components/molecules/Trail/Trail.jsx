// @flow
import {connect} from 'react-redux';
import Part from 'components/molecules/OpenMap/Line';
import type {Part as PartType} from 'types/part';
import type {Props, State} from './types';
import React, {Component} from 'react';

class Trail extends Component<Props, State> {
	renderPart = (part: PartType) => <Part key={part.data.uuid} part={part} />;

	render () {
		const {trail} = this.props;
		const {parts} = trail;

		if (parts && parts.length) {
			return parts.map(this.renderPart);
		}

		return null;
	}
}

export default connect()(Trail);
