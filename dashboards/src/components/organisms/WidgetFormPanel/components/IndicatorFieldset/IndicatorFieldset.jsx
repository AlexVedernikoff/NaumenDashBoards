// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {AttributeAggregationField, AttributeFieldset, ComputedAttributeEditor, FormField} from 'WidgetFormPanel/components';
import {AttributeCreatingModal} from 'components/organisms';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr} from 'store/widgets/data/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import withForm from 'WidgetFormPanel/withForm';

export class IndicatorFieldset extends PureComponent<Props, State> {
	state = {
		showCreatingModal: false
	};

	getModalSources = () => {
		const {attributes: map, fetchAttributes, values} = this.props;
		const sources = [];

		values.data.forEach(set => {
			const source = set[FIELDS.source];

			if (source) {
				const dataKey = set[FIELDS.dataKey];
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

				sources.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return sources;
	};

	getSourceOptions = (options: Array<Attribute>) => [...this.props.values.computedAttrs, ...options];

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
		const {name, set} = this.props;
		const attribute: ComputedAttr = set[name];

		return (
			<ComputedAttributeEditor
				onRemove={this.handleRemoveComputedAttribute}
				onSubmit={this.saveComputedAttribute}
				sources={this.getModalSources()}
				value={attribute}
			/>
		);
	};

	renderCreatingModal = () => {
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseCreatingModal}
					onSubmit={this.handleSubmitCreatingModal}
					sources={this.getModalSources()}
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
		const {error, name, set: currentSet} = this.props;
		const currentSource = currentSet[FIELDS.source];
		const value = currentSet[name];

		return (
			<FormField error={error}>
				<AttributeFieldset
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

export default withForm(IndicatorFieldset);
