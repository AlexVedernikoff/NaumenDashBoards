// @flow
import cn from 'classnames';
import Container from 'components/atoms/Container';
import {debounce, isObject} from 'helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'src/components/atoms/Icon';
import List from './components/List';
import Loader from 'components/atoms/Loader';
import type {OnChangeInputEvent} from 'components/types';
import type {
	Option,
	Props,
	State
} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import SearchInput from 'components/atoms/SearchInput';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import Value from './components/Value';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		disabled: false,
		editable: false,
		getOptionLabel: option => isObject(option) ? option.label : option || '',
		getOptionValue: option => isObject(option) ? option.value : option,
		isSearching: false,
		loading: false,
		loadingMessage: 'Загрузка...',
		multiple: false,
		name: '',
		noOptionsMessage: 'Список пуст',
		notFoundMessage: 'Ничего не найдено',
		options: [],
		placeholder: '',
		value: null
	};
	components = this.getExtendedComponents(this.props);
	state = {
		foundOptions: [],
		searchValue: '',
		showMenu: false
	};

	getExtendedComponents (props: Props) {
		const {components: extendedComponents} = props;
		const components = {
			Caret: IconButton,
			IndicatorsContainer: Container,
			MenuContainer: Container,
			Message: Container,
			Value,
			ValueContainer: Container
		};

		return extendedComponents ? {...components, ...extendedComponents} : components;
	}

	fetchOptions = () => {
		const {fetchOptions, options} = this.props;

		if (options.length === 0 && typeof fetchOptions === 'function') {
			fetchOptions();
		}
	};

	getFoundOptions = (searchValue: string) => {
		const {getOptionLabel, options} = this.props;
		let foundOptions = options;

		if (searchValue) {
			const reg = new RegExp(searchValue, 'i');

			foundOptions = options.filter(o => {
				const label = getOptionLabel ? getOptionLabel(o) : o.label;

				return reg.test(label);
			});
		}

		return foundOptions;
	};

	handleChangeLabel = ({value}: OnChangeInputEvent) => {
		const {name, onChangeLabel} = this.props;

		onChangeLabel && onChangeLabel({name, value});
	};

	handleChangeSearchInput = (searchValue: string) => {
		this.setState({foundOptions: this.getFoundOptions(searchValue), searchValue});
	};

	handleClick = () => {
		!this.state.showMenu && this.fetchOptions();
		this.setState({showMenu: !this.state.showMenu});
	};

	handleSelect = (value: Option) => {
		const {multiple, name, onSelect} = this.props;

		!multiple && this.setState({showMenu: false});
		onSelect({name, value});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderIndicators = () => {
		const {Caret, IndicatorsContainer} = this.components;

		return (
			<IndicatorsContainer className={styles.indicatorsContainer}>
				{this.renderLoader()}
				<Caret className={styles.caret} icon={ICON_NAMES.CARET} onClick={this.handleClick} round={true} />
			</IndicatorsContainer>
		);
	};

	renderLabel = () => {
		const {editable, getOptionLabel, placeholder, value} = this.props;
		const {Value} = this.components;
		const label = getOptionLabel(value) || placeholder;
		const valueCN = cn({
			[styles.value]: true,
			[styles.placeholder]: !value
		});

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

		return <Value className={valueCN} label={label} onClick={this.handleClick} />;
	};

	renderList = () => {
		const {getOptionLabel, getOptionValue, options: allOptions, value} = this.props;
		const {foundOptions, searchValue} = this.state;
		const options = searchValue ? foundOptions : allOptions;

		return (
			<List
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} size={15} /> : null;

	renderLoadingMessage = () => {
		const {Message} = this.components;
		const {loading, loadingMessage} = this.props;

		return loading && <Message className={styles.message}>{loadingMessage}</Message>;
	};

	renderMenu = () => {
		const {showMenu} = this.state;
		const {MenuContainer} = this.components;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<MenuContainer className={styles.menu}
					>
						{this.renderSearchInput()}
						{this.renderNoOptionsMessage()}
						{this.renderNotFoundMessage()}
						{this.renderList()}
						{this.renderLoadingMessage()}
					</MenuContainer>
				</OutsideClickDetector>
			);
		}
	};

	renderNoOptionsMessage = () => {
		const {loading, noOptionsMessage, options} = this.props;
		const {Message} = this.components;

		return !loading && options.length === 0 ? <Message className={styles.message}>{noOptionsMessage}</Message> : null;
	};

	renderNotFoundMessage = () => {
		const {loading, notFoundMessage} = this.props;
		const {foundOptions, searchValue} = this.state;
		const {Message} = this.components;

		console.log(loading, searchValue, foundOptions);
		return !loading && searchValue && foundOptions.length === 0
			? <Message className={styles.message}>{notFoundMessage}</Message>
			: null;
	};

	renderSearchInput = () => {
		const {isSearching} = this.props;
		const {searchValue} = this.state;

		return isSearching && <SearchInput focusOnMount={true} onChange={debounce(this.handleChangeSearchInput, 500)} value={searchValue} />;
	};

	renderValueContainer = () => {
		const {ValueContainer} = this.components;

		return (
			<ValueContainer className={styles.valueContainer}>
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
