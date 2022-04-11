// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import {resetSingleObject} from '../../../store/geolocation/actions';
import styles from './MapContentMenu.less';

export class MapContentMenu extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.pageX = 0;
		this.pageY = 0;
	}

	handleClick = () => {
		const {resetSingleObject, singleObject} = this.props;
		const {data: {actions: [action]}} = singleObject;
		const {link} = action;

		resetSingleObject();
		window.open(link, '_blank', 'noopener,noreferrer');
	};

	handleMouseMove = ({pageX, pageY}) => {
		this.pageX = pageX;
		this.pageY = pageY;
	};

	componentDidMount () {
		document.body.addEventListener('mousemove', this.handleMouseMove);
	}

	componentWillUnmount () {
		document.body.removeEventListener('mousemove', this.handleMouseMove);
	}

	render () {
		const {mapContentMenuOpen, singleObject} = this.props;

		if (mapContentMenuOpen) {
			const {data: {actions: [action]}} = singleObject;
			const {name} = action;

			return (
				<div className={styles.contentMenu} onClick={this.handleClick} style={{left: this.pageX, top: this.pageY}}>
					{name}
				</div>
			);
		}

		return null;
	}
}

export default connect(props, functions)(MapContentMenu);
