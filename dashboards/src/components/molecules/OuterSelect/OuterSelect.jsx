// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Option, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class OuterSelect extends PureComponent<Props> {
	static defaultProps = {
		name: ''
	};

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
						<Icon height={24} name={icon} viewBox="0 0 24 24" width={24} />
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
