// @flow
import Icon, {ICON_NAMES, ICON_SIZES} from 'components/atoms/Icon';
import type {Option, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class OuterSelect extends PureComponent<Props> {
	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {name, onSelect} = this.props;

		onSelect(name, e.currentTarget.dataset.value);
	};

	renderCheckedIcon = (value: string) => {
		const {value: selectedValue} = this.props;

		if (value === selectedValue) {
			return (
				<div className={styles.checkedIcon}>
					<Icon name={ICON_NAMES.ACCEPT} />
				</div>
			);
		}
	};

	renderOption = (option: Option) => {
		let {icon, tip, value} = option;

		return (
			<div className={styles.optionContainer} key={value} title={tip}>
					<div className={styles.option} data-value={value} onClick={this.handleClick}>
						<Icon name={icon} size={ICON_SIZES.LARGE} />
						{this.renderCheckedIcon(value)}
					</div>
			</div>
		);
	};

	render () {
		const {options} = this.props;

		return (
			<div className={styles.select}>
				{options.map(this.renderOption)}
			</div>
		);
	}
}

export default OuterSelect;
