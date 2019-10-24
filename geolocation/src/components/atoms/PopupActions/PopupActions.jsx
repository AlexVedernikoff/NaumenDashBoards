// @flow
import type {Action} from 'types/action';
import React, {Component} from 'react';
import type {Props, State} from './types';
import styles from './PopupActions.less';

export class PopupActions extends Component<Props, State> {
	renderAction = (action: Action, id: number) => {
		const {link, name} = action;
		const key = `action_${id}`;

		return (
			<a href={link} target='_blank' rel="noopener noreferrer" key={key}>{name}</a>
		);
	};

	render () {
		const {actions, classShadow} = this.props;
		const className = classShadow ? styles.popupActionsShadow : styles.popupActions;

		return (
			<div className={className}>
				{actions.map(this.renderAction)}
			</div>
		);
	}
}
export default PopupActions;
