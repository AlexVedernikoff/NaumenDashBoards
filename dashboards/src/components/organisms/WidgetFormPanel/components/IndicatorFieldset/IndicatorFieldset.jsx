// @flow
import {AttributeAggregationField, AttributeFieldset, ComputedAttributeEditor, FormField} from 'WidgetFormPanel/components';
import {AttributeCreatingModal} from 'components/organisms';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class IndicatorFieldset extends Component<Props, State> {
	state = {
		showCreatingModal: false
	};

	getSourceOptions = (classFqn: string) => {
		const {computedAttrs, getSourceOptions} = this.props;
		return [...computedAttrs, ...getSourceOptions(classFqn)];
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel(event, index);
	};

	handleClickCreationButton = () => this.setState({showCreatingModal: true});

	handleCloseCreatingModal = () => this.setState({showCreatingModal: false});

	handleRemoveComputedAttribute = (code: string) => {
		const {index, name, onRemoveComputedAttribute} = this.props;
		onRemoveComputedAttribute(index, name, code);
	};

	handleSelectAggregation = (name: string, value: string) => {
		const {index, onSelectAggregation} = this.props;
		onSelectAggregation(index, name, value);
	};

	handleSelectIndicator = (event: OnSelectAttributeEvent) => {
		const {index, onSelect} = this.props;
		onSelect(event, index);
	};

	handleSubmitCreatingModal = (attribute: ComputedAttr) => {
		this.setState({showCreatingModal: false});
		this.saveComputedAttribute(attribute);
	};

	saveComputedAttribute = (attribute: ComputedAttr) => {
		const {index, name, onSaveComputedAttribute} = this.props;
		onSaveComputedAttribute(index, name, attribute);
	};

	renderAggregation = (props: Object) => {
		const {set} = this.props;
		const {value} = props;

		return (
			<AttributeAggregationField
				attribute={value}
				name={FIELDS.aggregation}
				onSelect={this.handleSelectAggregation}
				tip="Агрегация"
				value={set[FIELDS.aggregation]}
			/>
		);
	};

	renderComputedAttributeEditor = () => {
		const {name, set, sources} = this.props;
		const attribute: ComputedAttr = set[name];

		return (
			<ComputedAttributeEditor
				onRemove={this.handleRemoveComputedAttribute}
				onSubmit={this.saveComputedAttribute}
				sources={sources}
				value={attribute}
			/>
		);
	};

	renderCreatingModal = () => {
		const {sources} = this.props;
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseCreatingModal}
					onSubmit={this.handleSubmitCreatingModal}
					sources={sources}
				/>
			);
		}
	};

	renderRefField = (props: Object) => {
		const {value} = props;

		if (value && value.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			return this.renderComputedAttributeEditor();
		}

		return this.renderAggregation(props);
	};

	render () {
		const {error, getAttributeOptions, name, set: currentSet} = this.props;
		const currentSource = currentSet[FIELDS.source];
		const value = currentSet[name];

		return (
			<FormField error={error}>
				<AttributeFieldset
					getAttributeOptions={getAttributeOptions}
					getSourceOptions={this.getSourceOptions}
					name={name}
					onChangeLabel={this.handleChangeLabel}
					onClickCreationButton={this.handleClickCreationButton}
					onSelect={this.handleSelectIndicator}
					renderRefField={this.renderRefField}
					showCreationButton={true}
					source={currentSource}
					value={value}
				/>
				{this.renderCreatingModal()}
			</FormField>
		);
	}
}

export default IndicatorFieldset;
