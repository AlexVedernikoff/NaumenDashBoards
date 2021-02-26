// @flow
import Caret from './components/Caret';
import cn from 'classnames';
import IndicatorsContainer from './components/IndicatorsContainer';
import List from './components/List';
import Loader from 'components/atoms/Loader';
import Menu from './components/Menu';
import type {
	MenuProps,
	Option,
	Props,
	State
} from './types';
import type {OnChangeInputEvent} from 'components/types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import ValueContainer from './components/ValueContainer';
import ValueLabel from './components/ValueLabel';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		async: false,
		className: '',
		components: {},
		disabled: false,
		editable: false,
		error: false,
		isSearching: false,
		loading: false,
		name: '',
		placeholder: '',
		showCreationButton: false,
		textCreationButton: 'Создать',
		uploaded: false,
		value: null
	};

	state = {
		components: this.getExtendedComponents(this.props),
		showMenu: false
	};

	getExtendedComponents (props: Props) {
		const {components} = props;

		return {
			Caret,
			IndicatorsContainer,
			ValueContainer,
			ValueLabel,
			...components
		};
	}

	fetchOptions = () => {
		const {async, error, fetchOptions, loading, uploaded} = this.props;

		if (async && typeof fetchOptions === 'function' && (error || loading || uploaded) === false) {
			fetchOptions();
		}
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		let label = option;

		if (option && typeof option === 'object') {
			label = getOptionLabel ? getOptionLabel(option) : option.label;
		}

		return label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		let value = option;

		if (option && typeof option === 'object') {
			value = getOptionValue ? getOptionValue(option) : option.value;
		}

		return value;
	};

	handleChangeLabel = ({value}: OnChangeInputEvent) => {
		const {name, onChangeLabel} = this.props;

		onChangeLabel && onChangeLabel({name, value});
	};

	handleClick = () => {
		this.setState({showMenu: !this.state.showMenu});
		this.fetchOptions();
	};

	handleClickClearLabelIcon = () => {
		const {name, onChangeLabel} = this.props;

		onChangeLabel && onChangeLabel({name, value: ''});
	};

	handleClickCreationButton = () => {
		const {onClickCreationButton} = this.props;

		this.setState({showMenu: false});
		onClickCreationButton && onClickCreationButton();
	};

	handleSelect = (value: Option) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect({name, value});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderDefaultMenu = (props: MenuProps) => {
		const {showCreationButton, textCreationButton} = this.props;
		const {showMenu} = this.state;
		let creationButton;

		if (showCreationButton) {
			creationButton = {
				onClick: this.handleClickCreationButton,
				text: textCreationButton
			};
		}

		return showMenu ? <Menu {...props} creationButton={creationButton} renderList={this.renderList} /> : null;
	};

	renderIndicators = () => {
		const {Caret, IndicatorsContainer} = this.state.components;

		return (
			<IndicatorsContainer>
				{this.renderLoader()}
				<Caret onClick={this.handleClick} />
			</IndicatorsContainer>
		);
	};

	renderLabel = () => {
		const {editable, placeholder, value} = this.props;
		const {ValueLabel} = this.state.components;
		const label = this.getOptionLabel(value) || placeholder;

		if (editable) {
			return (
				<TextInput
					className={styles.input}
					onChange={this.handleChangeLabel}
					onFocus={this.hideMenu}
					value={label}
				/>
			);
		}

		return <ValueLabel className={styles.label} label={label} />;
	};

	renderList = (searchValue: string) => {
		const {loading, options, value} = this.props;

		return (
			<List
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				loading={loading}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} size={15} /> : null;

	renderMenu = () => {
		const {components, isSearching, loading, options} = this.props;
		const {showMenu} = this.state;
		const {Menu = this.renderDefaultMenu} = components;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<Menu
						className={styles.menu}
						isSearching={isSearching}
						loading={loading}
						onSelect={this.handleSelect}
						options={options}
					/>
				</OutsideClickDetector>
			);
		}
	};

	renderValueContainer = () => {
		const {editable} = this.props;
		const {ValueContainer} = this.state.components;
		let onClick;

		if (!editable) {
			onClick = this.handleClick;
		}

		return (
			<ValueContainer className={styles.valueContainer} onClick={onClick}>
				{this.renderLabel()}
				{this.renderIndicators()}
			</ValueContainer>
		);
	};

	render () {
		const {className, disabled} = this.props;
		const selectCN = cn({
			[styles.container]: true,
			[styles.disabledContainer]: disabled,
			[className]: true
		});

		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={selectCN}>
					{this.renderValueContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default Select;
