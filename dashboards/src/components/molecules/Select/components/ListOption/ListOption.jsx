// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ListOption extends PureComponent<Props> {
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

	renderLabel = () => (
		<div className={styles.label}>
			{this.getOptionLabel()}
		</div>
	);

	renderSelectedIcon = () => {
		const {selected} = this.props;

		if (selected) {
			return (
				<div className={styles.selectedIconContainer}>
					<Icon name={ICON_NAMES.DONE} />
				</div>
			);
		}
	};

	render () {
		return (
			<div className={this.getClassName()} onClick={this.handleClick}>
				{this.renderLabel()}
				{this.renderSelectedIcon()}
			</div>
		);
	}
}

export default ListOption;
