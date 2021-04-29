// @flow
import cn from 'classnames';
import type {Components, Option, Props, State} from './types';
import Container from 'components/atoms/Container';
import {debounce} from 'helpers';
import {getOptionLabel, getOptionValue, getOptions} from './helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import List from './components/List';
import Loader from 'components/atoms/Loader';
import type {OnChangeEvent} from 'components/types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import SearchInput from 'components/atoms/SearchInput';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import Value from './components/Value';
import withGetComponents from 'components/HOCs/withGetComponents';

export class Select extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		disabled: false,
		editable: false,
		getOptionLabel,
		getOptionValue,
		getOptions,
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

	state = {
		foundOptions: [],
		searchValue: '',
		showMenu: false
	};

	fetchOptions = () => {
		const {fetchOptions, options} = this.props;

		if (options.length === 0 && typeof fetchOptions === 'function') {
			fetchOptions();
		}
	};

	getComponents = (): Components => this.props.getComponents({
		Caret: IconButton,
		IndicatorsContainer: Container,
		List: List,
		MenuContainer: Container,
		Message: Container,
		Value,
		ValueContainer: Container,
		...this.props.components
	});

	getFoundOptions = (searchValue: string): Array<Option> => {
		const {getOptionLabel, options} = this.props;
		let foundOptions = options;

		if (searchValue) {
			const reg = new RegExp(searchValue, 'i');

			foundOptions = options.filter(o => reg.test(getOptionLabel(o)));
		}

		return foundOptions;
	};

	handleChangeLabel = ({value}: OnChangeEvent<string>) => {
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
		onSelect && onSelect({name, value});
	};

	hideMenu = () => this.setState({showMenu: false});

	renderIndicators = () => {
		const {Caret, IndicatorsContainer} = this.getComponents();

		return (
			<IndicatorsContainer className={styles.indicatorsContainer}>
				{this.renderLoader()}
				<Caret className={styles.caret} icon={ICON_NAMES.CARET} onClick={this.handleClick} round={true} />
			</IndicatorsContainer>
		);
	};

	renderLabel = () => {
		const {editable, forwardedLabelInputRef, getOptionLabel, placeholder, value} = this.props;
		const {Value} = this.getComponents();
		const label = (value && getOptionLabel(value)) ?? placeholder;

		const valueCN = cn({
			[styles.value]: true,
			[styles.placeholder]: !value
		});

		if (editable) {
			return (
				<TextInput
					className={styles.input}
					forwardedRef={forwardedLabelInputRef}
					onChange={this.handleChangeLabel}
					onFocus={this.hideMenu}
					value={label}
				/>
			);
		}

		return <Value className={valueCN} label={label} onClick={this.handleClick} />;
	};

	renderList = () => {
		const {getOptionLabel, getOptionValue, getOptions, loading, options: allOptions, value} = this.props;
		const {foundOptions, searchValue} = this.state;
		const {List} = this.getComponents();
		const options = searchValue ? foundOptions : allOptions;

		if (!loading) {
			return (
				<List
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					onSelect={this.handleSelect}
					options={getOptions(options)}
					searchValue={searchValue}
					value={value}
				/>
			);
		}

		return null;
	};

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} size={15} /> : null;

	renderLoadingMessage = () => {
		const {Message} = this.getComponents();
		const {loading, loadingMessage} = this.props;

		return loading && <Message className={styles.message}>{loadingMessage}</Message>;
	};

	renderMenu = () => {
		const {showMenu} = this.state;
		const {MenuContainer} = this.getComponents();

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<MenuContainer className={styles.menu}>
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
		const {Message} = this.getComponents();

		return !loading && options.length === 0 ? <Message className={styles.message}>{noOptionsMessage}</Message> : null;
	};

	renderNotFoundMessage = () => {
		const {loading, notFoundMessage} = this.props;
		const {foundOptions, searchValue} = this.state;
		const {Message} = this.getComponents();

		return !loading && searchValue && foundOptions.length === 0
			? <Message className={styles.message}>{notFoundMessage}</Message>
			: null;
	};

	renderSearchInput = () => {
		const {isSearching} = this.props;
		const {searchValue} = this.state;

		if (isSearching) {
			return (
				<SearchInput
					focusOnMount={true}
					onChange={debounce(this.handleChangeSearchInput, 500)}
					value={searchValue}
				/>
			);
		}

		return null;
	};

	renderValueContainer = () => {
		const {ValueContainer} = this.getComponents();

		return (
			<ValueContainer className={styles.valueContainer} onClick={this.handleClick}>
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

export default withGetComponents(Select);
