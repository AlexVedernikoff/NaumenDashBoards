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
import {truncatedText} from 'components/atoms/TruncatedText';

export class PanelPointHeader extends Component<Props, State> {
	constructor (props: Object) {
		super(props);
		this.state = {
			openAction: false
		};
	}

	openActions = (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		this.setState({openAction: !this.state.openAction});
	}

	callChangeState = (states: Array<string>) => async (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		const {fetchGeolocation, uuid} = this.props;
		const response = await changeState(uuid, states);

		if (response) {
			fetchGeolocation();
		}
	};

	callChangeResponsible = async (event: SyntheticEvent<HTMLButtonElement>) => {
		event.stopPropagation();

		const {fetchGeolocation, uuid} = this.props;
		const response = await changeResponsible(uuid);

		if (response) {
			fetchGeolocation();
		}
	};

	renderAction = (action: Action) => {
		const {inPlace, link, name, states, type} = action;
		const target = !inPlace ? '_blank' : '';

		switch (type) {
			case 'open_link':
				return (
					<div className={styles.actionItem}>
						<a href={link} target={target} onClick={event => event.stopPropagation()}>
							<div>{truncatedText(name, 1)}</div>
						</a>
					</div>
				);
			case 'change_responsible':
				return (
					<div
						className={styles.actionItem}
						onClick={this.callChangeResponsible}
					>
						{truncatedText(name, 1)}
					</div>
				);
			case 'change_state':
				return (
					<div
						className={styles.actionItem}
						onClick={this.callChangeState(states)}
					>
						{truncatedText(name, 1)}
					</div>
				);
		}
	};

	renderActions = () => {
		const {openAction} = this.state;
		const {actions} = this.props;

		if (openAction) {
			return (
				<div className={styles.actionsContainer}>
					{actions.map((action, index) =>
						<div key={index} className={styles.actionContainer}>
							{this.renderAction(action)}
						</div>
					)}
				</div>
			);
		}
	};

	renderHeader = (header: string) => <div className={styles.contentHeader}>{truncatedText(header, 2)}</div>

	handleMouseOut = () => this.setState({openAction: false});

	renderKebab = () => {
		const {openAction} = this.state;

		const kebabContinerCN = cn({
			[styles.kebabContainer]: true,
			[styles.kebabContainerActive]: openAction
		});

		return (
			<div className={kebabContinerCN} onClick={this.openActions} onMouseLeave={this.handleMouseOut}>
				<div className={styles.kebabIcon} title="Действия">
					<KebabIcon />
				</div>
				{this.renderActions()}
			</div>
		);
	};

	componentDidUpdate () {
		const {showKebab} = this.props;
		const {openAction} = this.state;

		if (!showKebab && openAction) {
			this.setState({openAction: false});
		}
	}

	render () {
		const {showKebab, header, statusColor} = this.props;

		return (
			<div>
				<div className={styles.contentHeaderContainer}>
					<div className={styles.contentStatus} style={{background: statusColor}}/>
					{this.renderHeader(header)}
					{showKebab && this.renderKebab()}
				</div>
			</div>
		);
	}
}
export default connect(props, functions)(PanelPointHeader);
