// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Mark from 'components/molecules/Yandex/Mark';
import {Polyline} from 'react-yandex-maps';
import type {Props, State} from './types';
import React, {Component} from 'react';

class Line extends Component<Props, State> {
	showContentMenu = () => {
		const {part, toggleMapContextMenu} = this.props;
		toggleMapContextMenu(part);
	};

	showSingle = () => {
		const {part, setSingleObject} = this.props;
		setSingleObject(part);
	};

	renderLine = () => {
		const {part} = this.props;
		const {color, data: {header = ''}, geopositions, lineStyle = 'solidLine', opacity = 100, tooltip, weight = 6} = part;
		const opacityFloat = Number(opacity) / 100;
		const strokeStyleArray = lineStyle === 'dashedLine' ? [1, 2] : [0, 0];
		const positions = geopositions.map(geoposition => [geoposition.latitude, geoposition.longitude]);

		return (<Polyline
			geometry={positions}
			key={part.data.uuid}
			onClick={this.showSingle}
			onContextMenu={this.showContentMenu}
			options={{
				balloonCloseButton: false,
				opacity: opacityFloat,
				strokeColor: color,
				strokeStyle: strokeStyleArray,
				strokeWidth: weight
			}}
			properties={{
				hintContent: tooltip || header
			}}>
		</Polyline>);
	};

	renderMarks = () => {
		const {active, part} = this.props;
		const {geopositions: [positionsStart, positionsFinish], isIcon, iconFirst, iconSecond} = part;

		return (isIcon && <div>
			{<Mark active={active} point={{...part, geopositions: [positionsStart], icon: iconFirst}} />}
			{<Mark active={active} point={{...part, geopositions: [positionsFinish], icon: iconSecond}} />}
		</div>);
	};

	render () {
		return (
			<div>
				{this.renderMarks()}
				{this.renderLine()}
			</div>

		);
	}
}

export default connect(props, functions)(Line);
