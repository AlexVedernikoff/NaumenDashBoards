// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeAggregationField} from 'WidgetFormPanel/components';
import cn from 'classnames';
import {CreationPanel, SearchSelectInput} from 'components/atoms';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {MeetBallIcon} from 'icons/controls';
import type {Node} from 'react';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import type {SourceOption} from 'components/organisms/AttributeCreatingModal/types';
import styles from './styles.less';
import {ToggleCollapsedIcon, ToggleExpandedIcon} from 'icons/form';

export class SourceControl extends PureComponent<Props, State> {
	state = {
		active: false,
		expanded: [],
		foundOptions: [],
		searchValue: ''
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			this.setState({expanded: [value.dataKey]});
		}
	}

	countAllAttributes = (options: Array<SourceOption>) => {
		return options.length > 0 ? options.map(this.countOptionAttributes).reduce(this.reducer) : 0;
	};

	countOptionAttributes = (option: SourceOption) => option.attributes.length;

	filterEmptySources = (option: SourceOption) => option.attributes.length > 0;

	filterNoMatchingAttributes = (searchValue: string) => (option: SourceOption) => {
		let {attributes} = option;
		attributes = attributes.filter(a => a.title.toLowerCase().includes(searchValue.toLowerCase()));

		return {...option, attributes};
	};

	handleBlurControl = (e: SyntheticFocusEvent<HTMLDivElement>) => {
		if (e.relatedTarget === null) {
			this.setState({active: false});
		}
	};

	handleChangeSearchInput = (searchValue: string) => {
		const {options} = this.props;
		const foundOptions = options.map(this.filterNoMatchingAttributes(searchValue)).filter(this.filterEmptySources);

		this.setState({foundOptions, searchValue});
	};

	handleClickAttribute = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {index, name, onSelect, options, type} = this.props;
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

		this.setState({active: false});
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
		onSelect(index, name, {...value, aggregation}, type);
	};

	handleShowList = () => this.setState(state => ({active: !state.active}));

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

	renderAttributes = (option: SourceOption): Array<Node> | null => {
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
		const {active} = this.state;

		if (active) {
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

	renderOption = (option: SourceOption) => (
		<div className={styles.option} key={option.dataKey}>
			{this.renderSource(option)}
			{this.renderAttributes(option)}
		</div>
	);

	renderOptions = () => {
		const {options} = this.props;
		const {foundOptions, searchValue} = this.state;

		return (
			<div className={styles.options}>
				{searchValue ? foundOptions.map(this.renderOption) : options.map(this.renderOption)}
			</div>
		);
	};

	renderSearch = () => <SearchSelectInput onChange={this.handleChangeSearchInput} value={this.state.searchValue} />;

	renderSearchInfo = () => {
		const {options} = this.props;
		const {foundOptions, searchValue} = this.state;

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

	renderSource = (option: SourceOption) => {
		const {dataKey, source} = option;
		const {label, value} = source;
		const isExpanded = this.isExpanded(dataKey);

		return (
			<div className={styles.listSource} data-key={dataKey} key={value} onClick={this.handleClickSource}>
				<div className={styles.sourceToggleIcon}>
					{isExpanded ? <ToggleExpandedIcon /> : <ToggleCollapsedIcon />}
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
				<MeetBallIcon className={styles.icon} />
			</div>
		);
	};

	render () {
		return (
			<div className={styles.control} onBlur={this.handleBlurControl} tabIndex={0}>
				{this.renderValue()}
				{this.renderList()}
			</div>
		);
	}
}

export default SourceControl;