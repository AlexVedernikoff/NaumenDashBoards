// @flow
import cn from 'classnames';
import {debounce} from 'helpers';
import {DEFAULT_COMPONENTS} from './constants';
import {getOptionLabel, getOptionValue} from './helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import type {Node, Props, State, Tree} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TreeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		getOptionLabel,
		getOptionValue,
		isDisabled: () => false,
		loading: false,
		multiple: false,
		name: '',
		placeholder: 'Выберите значение',
		removable: false,
		showMore: false,
		value: null,
		values: []
	};

	state = {
		searchValue: '',
		showMenu: false
	};

	components = {
		...DEFAULT_COMPONENTS,
		...this.props.components
	};

	addFoundNode = (foundTree: Tree, node: Node): Tree => {
		const {options} = this.props;
		const {id, parent} = node;
		let newFoundTree = {
			...foundTree,
			[id]: node
		};

		return parent ? this.addFoundNode(newFoundTree, options[parent]) : newFoundTree;
	};

	getFoundTree = memoize((tree: Tree, searchValue: string): Tree => {
		const reg = new RegExp(searchValue, 'i');
		let foundTree = {};

		Object.keys(tree).forEach(key => {
			const node = tree[key];
			const label = this.getNodeLabel(node);

			foundTree = reg.test(label) ? this.addFoundNode(foundTree, node) : foundTree;
		});

		return foundTree;
	});

	getNodeLabel = (node: Node): string => {
		const {getNodeLabel, getOptionLabel} = this.props;

		return getNodeLabel ? getNodeLabel(node) : getOptionLabel(node.value);
	};

	getNodeValue = (node: Node): ?string => {
		const {getNodeValue, getOptionValue} = this.props;

		return getNodeValue ? getNodeValue(node) : getOptionValue(node.value);
	};

	handleChangeSearchInput = (searchValue: string) => this.setState({searchValue});

	handleClickIndicators = (e: SyntheticMouseEvent<HTMLDivElement>) => e.stopPropagation();

	handleClickRemoveButton = () => {
		const {name, onRemove} = this.props;

		onRemove && onRemove(name);
	};

	handleSelect = (node: Node) => {
		const {multiple, name, onSelect} = this.props;

		!multiple && this.setState({showMenu: false});
		onSelect({name, value: node});
	};

	handleToggleList = () => this.setState({showMenu: !this.state.showMenu});

	hideTree = () => this.setState({showMenu: false});

	renderIndicators = () => {
		const {removable, value} = this.props;
		const {IndicatorsContainer} = this.components;

		if (value) {
			return (
				<IndicatorsContainer className={styles.indicators} onClick={this.handleClickIndicators}>
					{removable && <IconButton icon={ICON_NAMES.REMOVE} onClick={this.handleClickRemoveButton} />}
				</IndicatorsContainer>
			);
		}
	};

	renderLabel = () => {
		const {getOptionLabel, placeholder, value} = this.props;
		const {LabelContainer} = this.components;
		const valueLabel = getOptionLabel(value);
		const hasValue = !!value;
		const label = hasValue ? valueLabel : placeholder;
		const CN = cn({
			[styles.label]: true,
			[styles.placeholder]: !hasValue
		});

		return (
			<LabelContainer className={CN} title={label}>
				{label}
			</LabelContainer>
		);
	};

	renderMenu = () => {
		const {showMenu} = this.state;
		const {MenuContainer} = this.components;

		if (showMenu) {
			return (
				<OutsideClickDetector onClickOutside={this.hideTree}>
					<MenuContainer className={styles.menu}>
						{this.renderSearchInput()}
						{this.renderTree()}
					</MenuContainer>
				</OutsideClickDetector>
			);
		}
	};

	renderSearchInput = () => {
		const {searchValue} = this.state;
		const {SearchInput} = this.components;

		return (
			<SearchInput
				focusOnMount={true}
				onChange={debounce(this.handleChangeSearchInput, 500)}
				value={searchValue}
			/>
		);
	};

	renderTree = () => {
		const {
			getOptionLabel,
			getOptionValue,
			isDisabled,
			loading,
			multiple,
			onFetch,
			options: allOptions,
			showMore,
			value,
			values
		} = this.props;
		const {searchValue} = this.state;
		const {Tree} = this.components;
		const options = searchValue ? this.getFoundTree(allOptions, searchValue) : allOptions;

		return (
			<Tree
				components={this.components}
				getNodeLabel={this.getNodeLabel}
				getNodeValue={this.getNodeValue}
				getOptionLabel={getOptionLabel}
				getOptionValue={getOptionValue}
				isDisabled={isDisabled}
				loading={loading}
				multiple={multiple}
				onFetch={onFetch}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				showMore={showMore}
				value={value}
				values={values}
			/>
		);
	};

	renderValue = () => (
		<div className={styles.value}>
			{this.renderLabel()}
			{this.renderIndicators()}
		</div>
	);

	renderValueContainer = () => {
		const {ValueContainer} = this.components;

		return (
			<ValueContainer className={styles.valueContainer} onClick={this.handleToggleList}>
				{this.renderValue()}
			</ValueContainer>
		);
	};

	render () {
		const {className} = this.props;
		const CN = cn(styles.select, className);

		return (
			<div className={CN}>
				{this.renderValueContainer()}
				{this.renderMenu()}
			</div>
		);
	}
}

export default TreeSelect;
