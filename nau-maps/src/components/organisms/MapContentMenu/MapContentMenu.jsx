// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './MapContentMenu.less';

export class MapContentMenu extends Component<Props> {
	constructor (props: Props) {
		super(props);

		this.pageX = 0;
		this.pageY = 0;
	}

	handleActionClick = () => {
		const {resetSingleObject, singleObject} = this.props;
		const {data: {actions: [action]}} = singleObject;
		const {link} = action;

		resetSingleObject();
		window.open(link, '_blank', 'noopener,noreferrer');
	};

	handleEditForm = () => {
		const {showEditForm, singleObject} = this.props;

		const {data: {uuid}} = singleObject;

		showEditForm(uuid);
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
				<ul className={styles.menuList} style={{left: this.pageX, top: this.pageY}}>
					<li className={styles.menuListItem} onClick={this.handleEditForm}>Редактировать</li>
					<li className={styles.menuListItem} onClick={this.handleActionClick}>{name}</li>
				</ul>
			);
		}

		return null;
	}
}

export default connect(props, functions)(MapContentMenu);
