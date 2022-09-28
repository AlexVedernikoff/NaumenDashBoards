// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {LatLng} from 'leaflet/dist/leaflet-src.esm';
import Mark from 'components/molecules/OpenMap/Mark';
import {Polyline} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class Line extends Component<Props, State> {
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
		const strokeStyleArray = lineStyle === 'dashedLine' ? '7, 11' : '0, 0';
		const positions = geopositions.map(geoposition => new LatLng(geoposition.latitude, geoposition.longitude));

		return <Polyline
			bubblingMouseEvents={false}
			color={color}
			dashArray={strokeStyleArray}
			onClick={this.showSingle}
			onContextMenu={this.showContentMenu}
			opacity={opacityFloat}
			positions={positions}
			weight={weight}
		>
			<TooltipPoint sticky={true} title={tooltip || header} />
		</Polyline>;
	};

	renderMarks = () => {
		const {active, part} = this.props;
		const {geopositions: [positionsStart, positionsFinish], isIcon, iconFirst, iconSecond} = part;

		return (isIcon && <div>
			{<Mark active={active} point={{...part, geopositions: [positionsStart], icon: iconFirst}} />}
			{<Mark active={active} point={{...part, geopositions: [positionsFinish], icon: iconSecond}} />}
		</div>
		);
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
