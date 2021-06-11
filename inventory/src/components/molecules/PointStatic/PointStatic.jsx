// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getCustomOrDefaultIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import React, {Component} from 'react';
import TooltipPoint from 'components/atoms/TooltipPoint';

export class PointStatic extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			/**
			 * Таймаут используется для устранения эффекта мерцания маркера при hover
			 * Перерискова и вывод изображения маркера занимает некоторое время, из-за это мы получаем множество смен событий onMouseOver и onMouseOut
			 */
			timeoutId: null,
			type: 'static'
		};
	}

	shouldComponentUpdate (nextProps: Props, nextState: State) {
		return nextProps.active !== this.props.active || nextState.type !== this.state.type || nextProps.color !== this.props.color;
	}

	handleMouseOver = () => {
		clearTimeout(this.state.timeoutId);
	};

	handleMouseOut = () => {
		if (!this.state.open) {
			const timeoutId = setTimeout(() => this.setState({type: 'static'}), 100);
			this.setState({timeoutId});
		}
	};

	showSingle = () => () => {
		const {point, setSingleObject} = this.props;

		this.setState({open: true});
		setSingleObject(point);
	};

	render () {
		const {point, active} = this.props;
		const {data, icon, geopositions} = point;
		const {equipType, type} = data;
		let iconMarker = getCustomOrDefaultIconMarker(equipType || type, active, icon);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={iconMarker}
				position={[geopositions[0].latitude, geopositions[0].longitude]}
				onClick={this.showSingle()}
			>
				<TooltipPoint title={data.header} />
			</Marker>
		);
	}
}

export default connect(props, functions)(PointStatic);
