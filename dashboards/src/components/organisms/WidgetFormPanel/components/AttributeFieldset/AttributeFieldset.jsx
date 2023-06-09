// @flow
import type {Attribute, Props, State} from './types';
import {ATTRIBUTE_FIELDSET_CONTEXT} from './HOCs/withAttributeFieldset/constants';
import {ATTRIBUTE_SETS, DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import deepEqual from 'fast-deep-equal';
import MainSelect from 'containers/AttributeMainSelect';
import type {OnSelectEvent} from 'components/types';
import {parseAttrSetConditions} from 'store/widgetForms/helpers';
import React, {PureComponent} from 'react';
import RefSelect from 'containers/AttributeRefSelect';

export class AttributeFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false,
		index: 0,
		name: '',
		removable: false
	};

	state = {
		attrSetConditions: null
	};

	componentDidMount () {
		this.fetchAttrSetConditions();
	}

	componentDidUpdate (prevProps: Props) {
		if (!deepEqual(this.props.source, prevProps.source)) {
			this.fetchAttrSetConditions();
		}
	}

	fetchAttrSetConditions = async () => {
		const {source} = this.props;

		if (source) {
			const attrSetConditions = await parseAttrSetConditions(source);

			this.setState({attrSetConditions});
		}
	};

	getMainOptions = (options: Array<Attribute>): Array<Attribute> => {
		const {dataSetIndex, getMainOptions} = this.props;

		return getMainOptions ? getMainOptions(options, dataSetIndex) : options;
	};

	getOptionLabel = (attribute: Attribute | null) => attribute ? attribute.title : '';

	getOptionValue = (attribute: Attribute | null) => attribute ? attribute.code : '';

	getRefOptions = (options: Array<Attribute>): Array<Attribute> => {
		const {dataSetIndex, getRefOptions} = this.props;
		return getRefOptions ? getRefOptions(options, dataSetIndex) : options;
	};

	handleChangeLabelMain = (title: string, callback?: Function) => {
		const {index, name, onChangeLabel, value} = this.props;
		const newValue = {...value, title};

		onChangeLabel({name, value: newValue}, index, callback);
	};

	handleChangeLabelRef = (title: string, callback?: Function) => {
		const {index, name, onChangeLabel, value} = this.props;

		if (value?.ref) {
			const newValue = {
				...value,
				ref: {
					...value.ref,
					title
				}
			};

			onChangeLabel({name, value: newValue}, index, callback);
		}
	};

	handleDrop = () => {
		const {index, name, onSelect, value} = this.props;
		const newValue = {
			...value,
			ref: null
		};

		onSelect({name, value: newValue}, index);
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;

		onRemove && onRemove(index);
	};

	handleSelectMain = (event: OnSelectEvent) => {
		const {index, onSelect} = this.props;

		onSelect(event, index);
	};

	handleSelectRef = (event: OnSelectEvent) => {
		const {index, onSelect, value} = this.props;
		const {value: refValue} = event;
		const newValue = {
			...value,
			ref: refValue
		};

		onSelect({...event, value: newValue}, index);
	};

	renderMainSelect = () => {
		const {components, disabled, removable, source, value} = this.props;
		const {attrSetConditions} = this.state;

		return (
			<MainSelect
				attrSetConditions={attrSetConditions}
				components={components}
				disabled={disabled}
				getOptions={this.getMainOptions}
				onChangeLabel={this.handleChangeLabelMain}
				onRemove={this.handleRemove}
				onSelect={this.handleSelectMain}
				removable={removable}
				source={source.value}
				value={value}
			/>
		);
	};

	renderRefSelect = () => {
		const {components, disabled, refComponents, removable, value} = this.props;
		const {attrSetConditions} = this.state;

		if (
			value
			&& (value.type in ATTRIBUTE_SETS.REFERENCE)
			&& (value.property !== DYNAMIC_ATTRIBUTE_PROPERTY)
		) {
			return (
				<RefSelect
					attrSetConditions={attrSetConditions}
					components={refComponents ?? components}
					disabled={disabled}
					droppable={true}
					getOptions={this.getRefOptions}
					onChangeLabel={this.handleChangeLabelRef}
					onDrop={this.handleDrop}
					onRemove={this.handleRemove}
					onSelect={this.handleSelectRef}
					parent={value}
					removable={removable}
					value={value.ref}
				/>
			);
		}

		return null;
	};

	render () {
		const {dataKey, dataSetIndex, source} = this.props;
		const context = {
			dataKey,
			dataSetIndex,
			source
		};

		return (
			<ATTRIBUTE_FIELDSET_CONTEXT.Provider value={context}>
				{this.renderMainSelect()}
				{this.renderRefSelect()}
			</ATTRIBUTE_FIELDSET_CONTEXT.Provider>
		);
	}
}

export default AttributeFieldset;
