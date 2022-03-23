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

	handleMouseOut = () => {
		if (!this.state.open) {
			const timeoutId = setTimeout(() => this.setState({type: 'static'}), 100);
			this.setState({timeoutId});
		}
	};

	handleMouseOver = () => {
		clearTimeout(this.state.timeoutId);
	};

	showSingle = () => () => {
		const {point, setSingleObject} = this.props;

		this.setState({open: true});
		setSingleObject(point);
	};

	render () {
		const {active, point} = this.props;
		const {data, geopositions, icon} = point;
		const {equipType, type} = data;
		const iconMarker = getCustomOrDefaultIconMarker(equipType || type, active, icon);

		return (
			<Marker
				icon={iconMarker}
				onClick={this.showSingle()}
				onMouseOut={this.handleMouseOut}
				onMouseOver={this.handleMouseOver}
				position={[geopositions[0].latitude, geopositions[0].longitude]}
			>
				<TooltipPoint title={data.header} />
			</Marker>
		);
	}
}

export default connect(props, functions)(PointStatic);
