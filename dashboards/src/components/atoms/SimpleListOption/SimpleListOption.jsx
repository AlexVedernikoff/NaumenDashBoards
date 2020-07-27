// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SimpleListOption extends PureComponent<Props> {
	static defaultProps = {
		showSelectedIcon: false
	};

	getClassName = () => {
		const {found, selected} = this.props;

		return cn({
			[styles.option]: true,
			[styles.found]: found,
			[styles.selected]: selected
		});
	};

	getOptionLabel = () => {
		const {getOptionLabel, option} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	handleClick = () => {
		const {onClick, option} = this.props;
		onClick(option);
	};

	renderSelectedIcon = () => {
		const {selected, showSelectedIcon} = this.props;
		return showSelectedIcon && selected ? <Icon name={ICON_NAMES.DONE} /> : null;
	};

	render () {
		const {style} = this.props;

		return (
			<div className={this.getClassName()} onClick={this.handleClick} style={style}>
				<div className={styles.label}>
					{this.getOptionLabel()}
					{this.renderSelectedIcon()}
				</div>
			</div>
		);
	}
}

export default SimpleListOption;
