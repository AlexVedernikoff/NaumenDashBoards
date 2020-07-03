// @flow
import cn from 'classnames';
import {FormCheckControl, FormField} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Toggle} from 'components/atoms';

export class DisableableBox extends PureComponent<Props> {
	renderChildren = () => {
		const {children, value} = this.props;
		const childrenCN = cn({
			[styles.disabled]: !value
		});

		return (
			<div className={childrenCN}>
				{children}
			</div>
		);
	};

	renderToggleForm = () => {
		const {handleChange, label, name, value} = this.props;

		return (
			<FormField>
				<FormCheckControl label={label} reverse>
					<Toggle checked={value} name={name} onChange={handleChange} value={value} />
				</FormCheckControl>
			</FormField>
		);
	};

	render () {
		return (
			<div>
				{this.renderToggleForm()}
				{this.renderChildren()}
			</div>
		);
	}
}

export default DisableableBox;
