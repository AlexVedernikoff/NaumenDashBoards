// @flow
import CircleMarker from 'components/atoms/CircleMarker';
import {connect} from 'react-redux';
import type {Geoposition} from 'types/geoposition';
import {iconMarker} from 'helpers/icon';
import {Marker} from 'react-leaflet';
import type {Props, State} from './types';
import {functions, props} from './selectors';
import React, {Component} from 'react';
import TooltipMarker from 'components/atoms/TooltipMarker';

export class PointDynamic extends Component<Props, State> {
	constructor (props: Props) {
		super(props);

		this.state = {
			open: false,
			/**
			 * Таймаут используется для устранения эффекта мерцания маркера при hover
			 * Перерискова и вывод изображения маркера занимает некоторое время, из-за это мы получаем множество смен событий onMouseOver и onMouseOut
			 * **/
			timeoutId: null,
			type: 'dynamic'
		};
	}

	renderCircle = (geoposition: Geoposition, color: string) => (<CircleMarker geoposition={geoposition} color={color} />);

	handleMouseOver = () => {
		clearTimeout(this.state.timeoutId);
		this.setState({type: 'dynamicHover'});
	};

	handleMouseOut = () => {
		if (!this.state.open) {
			const timeoutId = setTimeout(() => this.setState({type: 'dynamic'}), 100);

			this.setState({timeoutId});
		}
	}

	showSingle = () => () => {
		const {point, setSinglePoint} = this.props;

		this.setState({open: true});
		setSinglePoint(point);
	};

	shouldComponentUpdate (nextProps: Props, nextState: State) {
		if (nextProps.active !== this.props.active || nextProps.color !== this.props.color || nextState.type !== this.state.type) {
			return true;
		} else {
			return false;
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {active} = this.props;

		if (prevProps.active && !active) {
			this.setState({open: false, type: 'dynamic'});
		}
		if (!prevProps.active && active) {
			this.setState({open: true, type: 'dynamicHover'});
		}
	}

	render () {
		const {color, point} = this.props;
		const {geoposition, data} = point;
		const {type} = this.state;
		const icon = iconMarker(type, color);

		return (
			<Marker
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				icon={icon}
				position={[geoposition.latitude, geoposition.longitude]}
				onClick={this.showSingle()}
			>
				{this.renderCircle(geoposition, color)}
				<TooltipMarker title={data[0].header} />
			</Marker>
		);
	}
}
export default connect(props, functions)(PointDynamic);
