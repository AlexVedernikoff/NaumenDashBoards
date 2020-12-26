// @flow
import type {Components, Props, State} from './types';
import {debounce} from 'src/helpers';
import {MultiValueContainer, ValueContainer} from 'components/molecules/MaterialSelect/components';
import type {Node} from './components/Tree/types';
import {OutsideClickDetector, SearchInput} from 'components/atoms';
import React, {Component} from 'react';
import styles from './styles.less';
import {Tree} from './components';

export class MaterialTreeSelect extends Component<Props, State> {
	static defaultProps = {
		async: false,
		multiple: false,
		name: '',
		options: {},
		showMore: false,
		value: null,
		values: []
	};

	state = {
		components: this.getExtendedComponents(this.props),
		optionsLoaded: false,
		searchValue: '',
		showMenu: false
	};

	getExtendedComponents (props: Props): Components {
		const {components: customComponents} = props;
		const components = {
			SearchInput
		};

		return customComponents ? {...components, ...customComponents} : components;
	}

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		let label = '';

		if (option) {
			label = getOptionLabel ? getOptionLabel(option) : option.label;
		}

		return label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		let value = '';

		if (option) {
			value = getOptionValue ? getOptionValue(option) : option.value;
		}

		return value;
	};

	handleChangeSearchInput = (searchValue: string) => this.setState({searchValue});

	handleClickValueContainer = () => {
		const {async, onLoad} = this.props;
		const {optionsLoaded, showMenu} = this.state;

		if (async && !optionsLoaded) {
			this.setState({optionsLoaded: true});
			onLoad(null);
		}

		this.setState({showMenu: !showMenu});
	};

	handleSelect = (node: Node) => {
		const {multiple, name, onSelect} = this.props;

		if (!multiple) {
			this.setState({showMenu: false});
		}

		onSelect(name, node.value);
	};

	hideMenu = () => this.setState({showMenu: false});

	renderList = () => {
		const {isEnabledNode, loading, multiple, onLoad, options, showMore, value, values} = this.props;
		const {searchValue} = this.state;

		return (
			<Tree
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				isEnabledNode={isEnabledNode}
				loading={loading}
				multiple={multiple}
				onLoad={onLoad}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				showMore={showMore}
				value={value}
				values={values}
			/>
		);
	};

	renderMenu = () => {
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<div className={styles.menu}>
					{this.renderSearchInput()}
					{this.renderList()}
				</div>
			);
		}

		return null;
	};

	renderMultiValueContainer = () => {
		const {onClear, onRemove, values} = this.props;

		return (
			<MultiValueContainer
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onClear={onClear}
				onClick={this.handleClickValueContainer}
				onRemove={onRemove}
				values={values}
			/>
		);
	};

	renderSearchInput = () => {
		const {components, searchValue} = this.state;
		const {SearchInput} = components;

		return <SearchInput onChange={debounce(this.handleChangeSearchInput, 1000)} value={searchValue} />;
	};

	renderSimpleValueContainer = () => {
		const {value} = this.props;

		return (
			<ValueContainer
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onClick={this.handleClickValueContainer}
				value={value}
			/>
		);
	};

	renderValueContainer = () => this.props.multiple ? this.renderMultiValueContainer() : this.renderSimpleValueContainer();

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideMenu}>
				<div className={styles.container}>
					{this.renderValueContainer()}
					{this.renderMenu()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default MaterialTreeSelect;
