// @flow
import cn from 'classnames';
import Container from 'components/Container';
import Icon, {ICON_NAMES} from 'components/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ListOption extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		components: {}
	};

	components = {
		SelectedIcon: Container,
		Value: Container,
		ValueContainer: Container,
		...this.props.components
	};

	getClassName = () => {
		const {className, found, selected} = this.props;
		return cn({
			[className]: true,
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
		return onClick(option);
	};

	renderLabel = () => {
		const {Value} = this.components;
		return (
			<Value className={styles.label}>
				{this.getOptionLabel()}
			</Value>
		);
	};

	renderSelectedIcon = () => {
		const {selected} = this.props;
		const {SelectedIcon} = this.components;

		if (selected) {
			return (
				<SelectedIcon className={styles.selectedIconContainer}>
					<Icon name={ICON_NAMES.DONE} />
				</SelectedIcon>
			);
		}
	};

	render () {
		const {option, style} = this.props;
		const {ValueContainer} = this.components;

		return (
			<ValueContainer className={this.getClassName()} onClick={this.handleClick} option={option} style={style}>
				{this.renderLabel()}
				{this.renderSelectedIcon()}
			</ValueContainer>
		);
	}
}

export default ListOption;
