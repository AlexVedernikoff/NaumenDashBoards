// @flow
import type {Action} from 'types/action';
import cn from 'classnames';
import {connect} from 'react-redux';
import {changeResponsible, changeState} from 'utils/api';
import {functions, props} from './selectors';
import KebabIcon from 'icons/KebabIcon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelPointHeader.less';
import Truncate from 'react-truncate';

export class PanelPointHeader extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			openAction: false
		};
	}

	renderTruncatedText = (text: string, line: number = 3) => {
		const ellipsis = <span>...</span>;

		return (
			<Truncate lines={line} ellipsis={ellipsis}>
				{text}
			</Truncate>
		);
	};

	openActions = () => this.setState({openAction: !this.state.openAction});

	callChangeState = (uuid: string, states: Array<string>) => async() => {
		const {fetchGeolocation} = this.props;
		const response = await changeState(uuid, states);

		if (response) {
			fetchGeolocation();
		}
	};

	callChangeResponsible = (uuid: string) => async() => {
		const {fetchGeolocation} = this.props;
		const response = await changeResponsible(uuid);

		if (response) {
			fetchGeolocation();
		}
	};

	renderAction = (uuid: string, action: Action) => {
		const {name, type} = action;

		switch (type) {
			case 'open_link':
				const {link, inPlace} = action;
				const target = !inPlace ? '_blank' : '';

				return (
					<div className={styles.actionItem}>
						<a href={link} target={target}>
							<div>{this.renderTruncatedText(name, 1)}</div>
						</a>
					</div>
				);
			case 'change_responsible':
				return (
					<div
						className={styles.actionItem}
						onClick={this.callChangeResponsible(uuid)}
					>
						{this.renderTruncatedText(name, 1)}
					</div>
				);
			case 'change_state':
				const {states} = action;

				return (
					<div
						className={styles.actionItem}
						onClick={this.callChangeState(uuid, states)}
					>
						{this.renderTruncatedText(name, 1)}
					</div>
				);
		}
	};

	renderActions = () => {
		const {openAction} = this.state;
		const {actions, uuid} = this.props;

		if(openAction) {
			return (
				<div className={styles.actionsContainer}>
					{actions.map((action, index) =>
						<div key={index} className={styles.actionContainer}>
							{this.renderAction(uuid, action)}
						</div>
					)}
				</div>
			);
		}
	};

	renderHeader = (header: string) => <div className={styles.contentHeader}>{this.renderTruncatedText(header, 2)}</div>

	renderKebab = (header: string) => {
		const {openAction} = this.state;

		const kebabContinerCN = cn({
			[styles.kebabContainer]: true,
			[styles.kebabContainerActive]: openAction
		});

		return (
			<div className={styles.contentHeaderKebab}>
				{this.renderHeader(header)}
				<div className={kebabContinerCN}>
					<div
						className={styles.kebabIcon}
						onClick={this.openActions}
						title="Действия"
					>
						<KebabIcon />
					</div>
				</div>
			</div>
		);
	};

	render () {
		const {showKebab, header, statusColor} = this.props;

		return (
			<div>
				<div className={styles.contentHeaderContainer}>
					<div className={styles.contentStatus}  style={{background: statusColor}}/>
					{showKebab ? this.renderKebab(header) : this.renderHeader(header)}
				</div>
				{this.renderActions()}
			</div>
		);
	}
}
export default connect(props, functions)(PanelPointHeader);
