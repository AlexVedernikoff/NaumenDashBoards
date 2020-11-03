// @flow
import {connect} from 'react-redux';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class PointStatic extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			/**
			 * Таймаут используется для устранения эффекта мерцания маркера при hover
			 * Перерискова и вывод изображения маркера занимает некоторое время, из-за это мы получаем множество смен событий onMouseOver и onMouseOut
			 * **/
			timeoutId: null,
			type: 'static'
		};
	}

	handleMouseOver = () => {
		clearTimeout(this.state.timeoutId);
		this.setState({type: 'staticHover'});
	}

	handleMouseOut = () => {
		if (!this.state.open) {
			const timeoutId = setTimeout(() => this.setState({type: 'static'}), 100);

			this.setState({timeoutId});
		}
	}

	showSingle = () => () => {
		const {point, setSinglePoint} = this.props;

		this.setState({open: true});
		setSinglePoint(point);
	};

	shouldComponentUpdate (nextProps: Props, nextState: State) {
		if (nextProps.active !== this.props.active || nextState.type !== this.state.type) {
			return true;
		} else {
			return false;
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {active} = this.props;

		if (prevProps.active && !active) {
			this.setState({open: false, type: 'static'});
		}
		if (!prevProps.active && active) {
			this.setState({open: true, type: 'staticHover'});
		}
	}

	render () {
		const {color, point} = this.props;
		const {data} = point;
		const {type} = this.state;
		const icon = iconMarker(type, color);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[point.geoposition.latitude, point.geoposition.longitude]}
				onClick={this.showSingle()}
			>
				<TooltipMarker title={data[0].header} />
			</Marker>
		);
	}
}
export default connect(props, functions)(PointStatic);
