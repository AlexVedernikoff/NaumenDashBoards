// @flow
import type {Attribute, Props} from './types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import MainSelect from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/components/MainSelect';
import type {OnSelectEvent} from 'components/types';
import React, {Fragment, PureComponent} from 'react';
import RefSelect from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/components/RefSelect';

export class AttributeFieldset extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		index: 0,
		name: '',
		removable: false
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

	handleChangeLabelMain = (title: string) => {
		const {index, name, onChangeLabel, value} = this.props;
		const newValue = {...value, title};

		onChangeLabel({name, value: newValue}, index);
	};

	handleChangeLabelRef = (title: string) => {
		const {index, name, onChangeLabel, value} = this.props;

		if (value?.ref) {
			const newValue = {
				...value,
				ref: {
					...value.ref,
					title
				}
			};

			onChangeLabel({name, value: newValue}, index);
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

		return (
			<MainSelect
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
		const {components, disabled, removable, value} = this.props;

		if (value && value.type in ATTRIBUTE_SETS.REFERENCE) {
			return (
				<RefSelect
					components={components}
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
		return (
			<Fragment>
				{this.renderMainSelect()}
				{this.renderRefSelect()}
			</Fragment>
		);
	}
}

export default AttributeFieldset;
