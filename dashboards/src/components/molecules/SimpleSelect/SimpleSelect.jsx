// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Option, Props, State, Value} from './types';
import {OutsideClickDetector} from 'components/atoms';
import React, {PureComponent} from 'react';
import {SimpleSelectList} from 'components/molecules';
import styles from './styles.less';

export class SimpleSelect extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		editable: false,
		name: '',
		value: null
	};

	state = {
		showMenu: false
	};

	getLabel = (value: Value) => this.getValueProperty(value, 'label');

	getValue = (value: Value) => this.getValueProperty(value, 'value');

	getValueProperty = (value: Value, key: string) => {
		if (value && typeof value === 'object') {
			return value[key];
		}

		return value ? value.toString() : '';
	};

	handleChangeLabel = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChangeLabel} = this.props;
		const {value} = e.currentTarget;

		onChangeLabel && onChangeLabel({name, value});
	}

	handleClick = () => this.setState({showMenu: !this.state.showMenu});

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect({name, value});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderCaret = () => <Icon className={styles.caret} name={ICON_NAMES.CARET} />;

	renderLabel = () => {
		const {editable, value} = this.props;
		const label = this.getLabel(value);

		if (editable) {
			return (
				<input className={styles.input} onChange={this.handleChangeLabel} value={label} />
			);
		}

		return label;
	}

	renderMenu = () => {
		const {options, value} = this.props;
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<div className={styles.menu}>
						<SimpleSelectList
							getOptionLabel={this.getLabel}
							getOptionValue={this.getValue}
							onClose={this.hideMenu}
							onSelect={this.handleSelect}
							options={options}
							value={value}
						/>
					</div>
				</OutsideClickDetector>
			);
		}
	};

	renderValueContainer = () => (
		<div className={styles.valueContainer} onClick={this.handleClick} tabIndex={1}>
			{this.renderLabel()}
			{this.renderCaret()}
		</div>
	);

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.container, className)}>
				{this.renderValueContainer()}
				{this.renderMenu()}
			</div>
		);
	}
}

export default SimpleSelect;
