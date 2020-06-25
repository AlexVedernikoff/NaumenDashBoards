// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

class LegacyCheckbox extends Component<Props> {
	handleClick = () => {
		const {name, onClick, value} = this.props;
		onClick(name, !value);
	};

	renderCheckbox = () => {
		const {value} = this.props;

		return (
			<div className={styles.icon}>
				{value && <Icon name={ICON_NAMES.ACCEPT} />}
			</div>
		);
	};

	renderLabel = () => {
		const {label, renderLabel} = this.props;
		return renderLabel ? renderLabel(label) : <div>{label}</div>;
	};

	render () {
		return (
			<label className={styles.container} onClick={this.handleClick}>
				{this.renderCheckbox()}
				{this.renderLabel()}
			</label>
		);
	}
}

export default LegacyCheckbox;
