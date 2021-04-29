// @flow
import cn from 'classnames';
import type {Components, ContextProps as Props} from './types';
import Container from 'components/atoms/Container';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import withGetComponents from 'components/HOCs/withGetComponents';

export class ListOption extends PureComponent<Props> {
	static defaultProps = {
		components: {}
	};

	getClassName = () => {
		const {found, selected} = this.props;
		return cn({
			[styles.option]: true,
			[styles.found]: found,
			[styles.selected]: selected
		});
	};

	getComponents = (): Components => this.props.getComponents({
		SelectedIcon: Container,
		Value: Container,
		ValueContainer: Container,
		...this.props.components
	});

	getOptionLabel = () => {
		const {getOptionLabel, option} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	handleClick = () => {
		const {onClick, option} = this.props;
		return onClick(option);
	};

	renderLabel = () => {
		const {Value} = this.getComponents();
		return (
			<Value className={styles.label}>
				{this.getOptionLabel()}
			</Value>
		);
	};

	renderSelectedIcon = () => {
		const {selected} = this.props;
		const {SelectedIcon} = this.getComponents();

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
		const {ValueContainer} = this.getComponents();

		return (
			<ValueContainer className={this.getClassName()} onClick={this.handleClick} option={option} style={style}>
				{this.renderLabel()}
				{this.renderSelectedIcon()}
			</ValueContainer>
		);
	}
}

export default withGetComponents(ListOption);
