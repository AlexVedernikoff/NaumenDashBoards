// @flow
import {connect} from 'react-redux';
import {divIconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class PointMultiple extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			type: 'multiple',
			/**
			 * Таймаут используется для устранения эффекта мерцания маркера при hover
			 * Перерискова и вывод изображения маркера занимает некоторое время, из-за это мы получаем множество смен событий onMouseOver и onMouseOut
			 * **/
			timeoutId: null,
			open: false
		};
	}

	handleMouseOver = () => {
		clearTimeout(this.state.timeoutId);
		if (this.state.type !== 'multipleHover') {
			const timeoutId = setTimeout(() => this.setState({type: 'multipleHover'}), 200);

			this.setState({timeoutId});
		}
	};

	handleMouseOut = () => {
		if (!this.state.open) {
			const timeoutId = setTimeout(() => this.setState({type: 'multiple'}), 300);

			this.setState({timeoutId});
		}
	}

	openPopup = () => this.setState({open: !this.state.open}, () => this.handleMouseOut());

	showSingle = () => () => {
		const {point, setSinglePoint} = this.props;

		this.setState({open: true});
		setSinglePoint(point);
	};

	shouldComponentUpdate (nextProps: Props, nextState: State) {
		if (nextProps.active !== this.props.active || nextProps.color !== this.props.color || nextProps.count !== this.props.count || nextState.type !== this.state.type) {
			return true;
		} else {
			return false;
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {active} = this.props;

		if (prevProps.active && !active) {
			this.setState({open: false, type: 'multiple'});
		}
		if (!prevProps.active && active) {
			this.setState({open: true, type: 'multipleHover'});
		}
	}

	render () {
		const {color, count, point} = this.props;
		const {data} = point;
		const {type} = this.state;
		const icon = divIconMarker(type, color, count);

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
export default connect(props, functions)(PointMultiple);
