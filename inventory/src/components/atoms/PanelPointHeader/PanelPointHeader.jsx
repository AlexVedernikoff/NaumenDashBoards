// @flow
import type {Action} from 'types/action';
import {changeResponsible, changeState} from 'utils/api';
import cn from 'classnames';
import {connect} from 'react-redux';
import {functions} from './selectors';
import KebabIcon from 'icons/KebabIcon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPointHeader.less';
import {truncatedText} from 'components/atoms/TruncatedText';

export class PanelPointHeader extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			openAction: false
		};
	}

	componentDidUpdate () {
		const {showKebab} = this.props;
		const {openAction} = this.state;

		if (!showKebab && openAction) {
			this.setState({openAction: false});
		}
	}

	callChangeResponsible = async (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		const {fetchGeolocation, uuid} = this.props;
		const response = await changeResponsible(uuid);

		if (response) {
			fetchGeolocation();
		}
	};

	callChangeState = (states: Array<string>) => async (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		const {fetchGeolocation, uuid} = this.props;
		const response = await changeState(uuid, states);

		if (response) {
			fetchGeolocation();
		}
	};

	handleMouseOut = () => this.setState({openAction: false});

	openActions = (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		this.setState({openAction: !this.state.openAction});
	}

	renderAction = (action: Action, index: number) => {
		const {inPlace, link, name, states, type} = action;
		const target = !inPlace ? '_blank' : '_top';

		switch (type) {
			case 'open_link':
				return (
					<div key={index} className={styles.actionContainer}>
						<div className={styles.actionItem}>
							<a
								href={link}
								target={target}
								onClick={event => event.stopPropagation()}
							>
								<div>{truncatedText(name, 1)}</div>
							</a>
						</div>
					</div>
				);
			case 'change_responsible':
				return (
					<div key={index} className={styles.actionContainer}>
						<div
							className={styles.actionItem}
							onClick={this.callChangeResponsible}
						>
							{truncatedText(name, 1)}
						</div>
					</div>
				);
			case 'change_state':
				return (
					<div key={index} className={styles.actionContainer}>
						<div
							className={styles.actionItem}
							onClick={this.callChangeState(states)}
						>
							{truncatedText(name, 1)}
						</div>
					</div>
				);
		}
	};

	renderActions = () => {
		const {actions} = this.props;
		const {openAction} = this.state;

		if (openAction) {
			return (
				<div className={styles.actionsContainer}>
					{actions.map(this.renderAction)}
				</div>
			);
		}
	};

	renderHeader = (header: string) => <div className={styles.contentHeader}>{truncatedText(header, 2)}</div>

	renderKebabIcon = () => {
		const {openAction} = this.state;
		const kebabIconCN = cn({
			[styles.kebabIcon]: true,
			[styles.kebabIconActive]: openAction
		});

		return (
			<div className={kebabIconCN} onClick={this.openActions} title="Действия">
				<KebabIcon/>
			</div>
		);
	}

	renderKebab = () => {
		const {showKebab} = this.props;

		if (showKebab) {
			return (
				<div className={styles.kebabContainer} onMouseLeave={this.handleMouseOut}>
					{this.renderKebabIcon()}
					{this.renderActions()}
				</div>
			);
		}
	};

	render () {
		const {header} = this.props;

		return (
			<div className={styles.contentHeaderContainer}>
				{this.renderHeader(header)}
				{this.renderKebab()}
			</div>
		);
	}
}

export default connect(null, functions)(PanelPointHeader);
