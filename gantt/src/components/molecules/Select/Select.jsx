// @flow
import cn from 'classnames';
import Container from 'components/atoms/Container';
import {debounce, escapeString} from 'helpers';
import {DEFAULT_PROPS} from './constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import List from './components/List';
import Loader from 'components/atoms/Loader';
import type {OnChangeEvent, Ref} from 'components/types';
import type {Option, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {Component, createRef} from 'react';
import SearchInput from 'components/atoms/SearchInput';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import Value from './components/Value';

export class Select extends Component<Props, State> {
	static defaultProps = DEFAULT_PROPS;

	state = {
		foundOptions: [],
		searchValue: '',
		showMenu: false
	};

	components = {
		Caret: IconButton,
		IndicatorsContainer: Container,
		List: List,
		MenuContainer: Container,
		MenuHeader: Container,
		Message: Container,
		SearchInput: SearchInput,
		Value,
		ValueContainer: Container,
		...this.props.components
	};

	searchInputRef: Ref<'input'> = createRef();

	componentDidUpdate (prevProps: Props) {
		const {options: prevOptions} = prevProps;
		const {options} = this.props;
		const {searchValue} = this.state;

		if (prevOptions !== options && searchValue) {
			this.setState({
				foundOptions: this.getFoundOptions(searchValue)
			});
		}
	}

	fetchOptions = () => {
		const {fetchOptions, loading, options} = this.props;

		if (!loading && options.length === 0 && typeof fetchOptions === 'function') {
			fetchOptions();
		}
	};

	getFoundOptions = (searchValue: string): Array<Option> => {
		const {getOptionLabel, options} = this.props;
		let foundOptions = options;

		if (searchValue) {
			const reg = new RegExp(escapeString(searchValue), 'i');

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
		const {Caret, IndicatorsContainer} = this.components;

		return (
			<IndicatorsContainer className={styles.indicatorsContainer}>
				{this.renderLoader()}
				<Caret className={styles.caret} icon={ICON_NAMES.CARET} onClick={this.handleClick} round={true} />
			</IndicatorsContainer>
		);
	};

	renderLabel = (): React$Node => {
		const {editable, forwardedLabelInputRef, getOptionLabel, multiple, placeholder, value, values = []} = this.props;
		const {Value} = this.components;
		let label = placeholder;
		let usePlaceholder = true;

		if (multiple) {
			const text = values && values.map(getOptionLabel).join(', ');

			if (text) {
				label = text;
				usePlaceholder = false;
			}
		} else if (value) {
			label = getOptionLabel(value);
			usePlaceholder = false;
		}

		const valueCN = cn({
			[styles.value]: true,
			[styles.placeholder]: usePlaceholder
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

	renderList = (): React$Node => {
		const {getOptionLabel, getOptionValue, getOptions, loading, multiple, options: allOptions, value, values} = this.props;
		const {foundOptions, searchValue} = this.state;
		const {List} = this.components;
		const options = searchValue ? foundOptions : allOptions;

		if (!loading) {
			return (
				<List
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
					multiple={multiple}
					onSelect={this.handleSelect}
					options={getOptions(options)}
					searchValue={searchValue}
					value={value}
					values={values || []}
				/>
			);
		}

		return null;
	};

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} size={15} /> : null;

	renderLoadingMessage = () => {
		const {Message} = this.components;
		const {loading, loadingMessage} = this.props;

		return loading && <Message className={styles.message}>{loadingMessage}</Message>;
	};

	renderMenu = (): React$Node => {
		const {showMenu} = this.state;
		const {MenuContainer} = this.components;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideMenu}>
					<MenuContainer className={styles.menu}>
						{this.renderMenuHeader()}
						{this.renderSearchInput()}
						{this.renderNoOptionsMessage()}
						{this.renderNotFoundMessage()}
						{this.renderList()}
						{this.renderLoadingMessage()}
					</MenuContainer>
				</OutsideClickDetector>
			);
		}

		return null;
	};

	renderMenuHeader = (): React$Node => {
		const {loading, menuHeaderMessage} = this.props;
		const {MenuHeader} = this.components;

		if (!loading && menuHeaderMessage) {
			return (
				<MenuHeader className={styles.menuHeader}>{menuHeaderMessage}</MenuHeader>
			);
		}

		return null;
	};

	renderNoOptionsMessage = (): React$Node => {
		const {loading, noOptionsMessage, options} = this.props;
		const {Message} = this.components;

		return !loading && options.length === 0 ? <Message className={styles.message}>{noOptionsMessage}</Message> : null;
	};

	renderNotFoundMessage = (): React$Node => {
		const {loading, notFoundMessage} = this.props;
		const {foundOptions, searchValue} = this.state;
		const {Message} = this.components;

		return !loading && searchValue && foundOptions.length === 0
			? <Message className={styles.message}>{notFoundMessage}</Message>
			: null;
	};

	renderSearchInput = (): React$Node => {
		const {isSearching} = this.props;
		const {SearchInput} = this.components;
		const {searchValue} = this.state;

		if (isSearching) {
			return (
				<SearchInput
					className={styles.searchInput}
					focusOnMount={true}
					forwardedRef={this.searchInputRef}
					onChange={debounce(this.handleChangeSearchInput, 500)}
					value={searchValue}
				/>
			);
		}

		return null;
	};

	renderValueContainer = () => {
		const {ValueContainer} = this.components;

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

export default Select;
