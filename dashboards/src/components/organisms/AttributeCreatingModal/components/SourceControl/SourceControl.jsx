// @flow
import type {Attribute} from 'store/sources/attributes/types';
import AttributeAggregationField from 'WidgetFormPanel/components/AttributeAggregationField';
import cn from 'classnames';
import CreationPanel from 'components/atoms/CreationPanel';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Node} from 'react';
import type {Option, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import SearchInput from 'components/atoms/SearchInput';
import styles from './styles.less';
import withValues from 'components/organisms/WidgetForm/HOCs/withValues';

export class SourceControl extends PureComponent<Props, State> {
	state = {
		expanded: [],
		foundOptions: [],
		options: this.getOptions(this.props),
		searchValue: '',
		showList: false
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			this.setState({expanded: [value.dataKey]});
		}
	}

	getOptions (props: Props) {
		const {attributes: map, fetchAttributes, values} = props;
		const options = [];

		values.data.forEach(dataSet => {
			const {value: source} = dataSet.source;

			if (source) {
				const dataKey = dataSet.dataKey;
				const classFqn = source.value;
				let {[classFqn]: sourceData = {
					error: false,
					loading: false,
					options: [],
					uploaded: false
				}} = map;
				const {error, loading, options: attributes, uploaded} = sourceData;

				if ((error || loading || uploaded) === false) {
					fetchAttributes(classFqn);
				}

				options.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return options;
	}

	countAllAttributes = (options: Array<Option>) => {
		return options.length > 0 ? options.map(this.countOptionAttributes).reduce(this.reducer) : 0;
	};

	countOptionAttributes = (option: Option) => option.attributes.length;

	filterEmptySources = (option: Option) => option.attributes.length > 0;

	filterNoMatchingAttributes = (searchValue: string) => (option: Option) => {
		let {attributes} = option;

		attributes = attributes.filter(a => a.title.toLowerCase().includes(searchValue.toLowerCase()));

		return {...option, attributes};
	};

	handleChangeSearchInput = (searchValue: string) => {
		const {options} = this.state;
		const foundOptions = options.map(this.filterNoMatchingAttributes(searchValue)).filter(this.filterEmptySources);

		this.setState({foundOptions, searchValue});
	};

	handleClickAttribute = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {index, name, onSelect, type} = this.props;
		const {options} = this.state;
		const {code, key: dataKey} = e.currentTarget.dataset;
		const option = options.find(o => o.dataKey === dataKey);

		if (option) {
			const {attributes, source} = option;
			const attribute = attributes.find(a => a.code === code);

			if (attribute) {
				const aggregation = getDefaultAggregation(attribute);

				const value = {
					aggregation,
					attribute,
					dataKey,
					source
				};

				onSelect(index, name, value, type);
			}
		}

		this.setState({showList: false});
	};

	handleClickButton = () => {
		const {index, name, onClickButton} = this.props;

		onClickButton(index, name);
	};

	handleClickSource = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		let {expanded} = this.state;
		const {key} = e.currentTarget.dataset;

		expanded = expanded.includes(key) ? expanded.filter(k => k !== key) : [...expanded, key];

		this.setState({expanded});
	};

	handleSelectAggregation = (name: string, aggregation: string) => {
		const {index, onSelect, type, value} = this.props;

		value && onSelect(index, name, {...value, aggregation}, type);
	};

	handleShowList = () => this.setState(state => ({showList: !state.showList}));

	hideList = () => this.setState({showList: false});

	isExpanded = (dataKey: string) => {
		const {expanded, searchValue} = this.state;

		return searchValue || expanded.includes(dataKey);
	};

	reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;

	renderAggregationValue = (valueProps: RenderValueProps) => {
		const {active, children, className, onClick} = valueProps;
		const CN = active ? cn(className, styles.activeLeftInput) : cn(className, styles.leftInput);

		return (
			<div className={CN} onClick={onClick}>
				{children}
			</div>
		);
	};

	renderAttribute = (dataKey: string) => (attribute: Attribute) => {
		const {value} = this.props;
		const className = [styles.attribute];
		const {code, title} = attribute;

		if (value && value.dataKey === dataKey && value.attribute.code === code) {
			className.push(styles.selectedAttribute);
		}

		return (
			<div className={cn(className)} data-code={code} data-key={dataKey} key={code} onClick={this.handleClickAttribute}>
				{title}
			</div>
		);
	};

	renderAttributes = (option: Option): Array<Node> | null => {
		const {attributes, dataKey} = option;
		const isExpanded = this.isExpanded(dataKey);

		if (isExpanded) {
			return attributes.map(this.renderAttribute(dataKey));
		}

		return null;
	};

	renderConstantCreationButton = () => {
		const {searchValue} = this.state;

		if (!searchValue) {
			return (
				<CreationPanel onClick={this.handleClickButton} text="Добавить константу" />
			);
		}
	};

	renderList = () => {
		const {showList} = this.state;

		if (showList) {
			return (
				<div className={styles.list}>
					{this.renderSearch()}
					{this.renderSearchValue()}
					{this.renderOptions()}
					{this.renderSearchInfo()}
					{this.renderConstantCreationButton()}
				</div>
			);
		}
	};

	renderOption = (option: Option) => (
		<div className={styles.option} key={option.dataKey}>
			{this.renderSource(option)}
			{this.renderAttributes(option)}
		</div>
	);

	renderOptions = () => {
		const {foundOptions, options, searchValue} = this.state;

		return (
			<div className={styles.options}>
				{searchValue ? foundOptions.map(this.renderOption) : options.map(this.renderOption)}
			</div>
		);
	};

	renderSearch = () => <SearchInput onChange={this.handleChangeSearchInput} value={this.state.searchValue} />;

	renderSearchInfo = () => {
		const {foundOptions, options, searchValue} = this.state;

		if (searchValue) {
			const countAttributes = this.countAllAttributes(options);
			const countFoundAttributes = this.countAllAttributes(foundOptions);
			const info = `Найдено ${countFoundAttributes} из ${countAttributes}`;

			return (
				<div className={styles.searchInfo}>
					{info}
				</div>
			);
		}
	};

	renderSearchValue = () => {
		const {searchValue} = this.state;

		if (searchValue) {
			return (
				<div className={styles.searchValue}>
					<span>Содержащее: </span>
					{searchValue}
				</div>
			);
		}
	};

	renderSource = (option: Option) => {
		const {dataKey, source} = option;
		const {TOGGLE_COLLAPSED, TOGGLE_EXPANDED} = ICON_NAMES;
		const {label, value} = source;
		const isExpanded = this.isExpanded(dataKey);
		const name = isExpanded ? TOGGLE_EXPANDED : TOGGLE_COLLAPSED;

		return (
			<div className={styles.listSource} data-key={dataKey} key={value} onClick={this.handleClickSource}>
				<div className={styles.sourceToggleIcon}>
					<Icon name={name} />
				</div>
				<div className={styles.listSourceLabel}>{label}</div>
			</div>
		);
	};

	renderValue = () => {
		const {name, value} = this.props;

		if (value) {
			const {aggregation, attribute, source} = value;

			return (
				<div className={styles.combinedInput}>
					<AttributeAggregationField
						attribute={attribute}
						name={name}
						onSelect={this.handleSelectAggregation}
						renderValue={this.renderAggregationValue}
						tip="Агрегация"
						value={aggregation}
					/>
					<div className={styles.rightInput} onClick={this.handleShowList}>
						<div>
							<div className={styles.inputSourceLabel}>{source.label}</div>
							<div className={styles.inputAttributeLabel}>{attribute.title}</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className={styles.emptyInput} onClick={this.handleShowList}>
				<Icon name={ICON_NAMES.ELLIPSIS} />
			</div>
		);
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideList}>
				<div className={styles.control}>
					{this.renderValue()}
					{this.renderList()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default withValues(DIAGRAM_FIELDS.data)(SourceControl);
