// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet, SourceData} from 'containers/DiagramWidgetEditForm/types';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {getDataErrorKey, getDefaultIndicator, getDefaultParameter, getParentClassFqn} from 'DiagramWidgetEditForm/helpers';
import {getDefaultAggregation} from 'DiagramWidgetEditForm/components/AttributeAggregationField/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import React from 'react';
import type {RenderSourceFieldsetProps, SourceInjectedProps} from './types';
import SourceFieldset from 'DiagramWidgetEditForm/components/SourceFieldset';
import uuid from 'tiny-uuid';

export const withSource = (Component: React$ComponentType<SourceInjectedProps>) => {
	return class WrappedComponent extends React.Component<ContextProps> {
		handleAddSource = () => {
			const {setFieldValue, values} = this.props;
			const data = [...values.data, {
				dataKey: uuid(),
				indicators: [getDefaultIndicator()],
				parameters: [getDefaultParameter()],
				source: {
					descriptor: '',
					value: null
				},
				sourceForCompute: true
			}];

			setFieldValue(FIELDS.data, data);
		};

		handleChange = (dataSetIndex: number, source: SourceData) => {
			const {setDataFieldValue} = this.props;
			setDataFieldValue(dataSetIndex, FIELDS.source, source);
		};

		handleFetchAttributes = (dataSetIndex: number, classFqn: string) => {
			const {fetchAttributes, values} = this.props;
			const parentClassFqn = getParentClassFqn(values, dataSetIndex);

			this.resetAttributes(dataSetIndex);
			fetchAttributes(classFqn, parentClassFqn, this.setDefaultIndicator(dataSetIndex));
		};

		handleFetchDynamicAttributes = (dataSetIndex: number, descriptor: string) => {
			const {fetchDynamicAttributeGroups, values} = this.props;
			const {dataKey} = values.data[dataSetIndex];

			this.resetDynamicAttributes(dataSetIndex);
			fetchDynamicAttributeGroups(dataKey, descriptor);
		};

		handleRemoveSource = (index: number) => {
			const {setFieldValue, values} = this.props;
			const {data} = values;

			if (data.length > 1) {
				data.splice(index, 1);
				setFieldValue(FIELDS.data, data);
			}
		};

		handleSelectSourceCallback = (index: number) => () => {
			const {fetchAttributes, values} = this.props;
			const source = values.data[index][FIELDS.source];

			if (source) {
				const parentClassFqn = getParentClassFqn(values, index);
				fetchAttributes(source.value, parentClassFqn, this.setDefaultIndicator(index));
			}
		};

		isDynamicAttribute = (attribute: ?Attribute) => attribute && attribute.property === DYNAMIC_ATTRIBUTE_PROPERTY;

		resetAttributes = (index: number) => {
			const {setDataFieldValue, values} = this.props;
			const {breakdown} = values.data[index];

			setDataFieldValue(index, FIELDS.parameters, [getDefaultParameter()]);
			setDataFieldValue(index, FIELDS.indicators, [getDefaultIndicator()]);
			breakdown && setDataFieldValue(index, FIELDS.breakdown, getDefaultParameter());
		};

		resetDynamicAttribute = (data: Object) => {
			const {attribute, ...rest} = data;

			return {
				...rest,
				attribute: this.isDynamicAttribute(attribute) ? null : attribute
			};
		};

		resetDynamicAttributes = (index: number) => {
			const {setDataFieldValue, values} = this.props;
			let {breakdown, indicators, parameters} = values.data[index];

			parameters = parameters.map(this.resetDynamicAttribute);

			indicators = indicators.map(this.resetDynamicAttribute);

			if (Array.isArray(breakdown)) {
				breakdown = breakdown.map(({value, ...rest}) => ({
					...rest,
					value: this.isDynamicAttribute(value) ? null : value
				}));
			} else if (breakdown) {
				breakdown = this.resetDynamicAttribute(breakdown);
			}

			setDataFieldValue(index, FIELDS.parameters, parameters);
			setDataFieldValue(index, FIELDS.indicators, indicators);
			setDataFieldValue(index, FIELDS.breakdown, breakdown);
		};

		setDefaultIndicator = (index: number) => (attributes: Array<Attribute>) => {
			const {setDataFieldValue} = this.props;
			const indicator = attributes.find(attribute => attribute.code === 'UUID');

			setDataFieldValue(index, FIELDS.indicators, [{
				aggregation: getDefaultAggregation(indicator),
				attribute: indicator
			}]);
		};

		renderAddSourceInput = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleAddSource} />;

		renderSourceFieldset = (props: RenderSourceFieldsetProps = {}) => (dataSet: DataSet, index: number) => {
			const {errors, sources: baseSources, values} = this.props;
			const {sources = baseSources, usesFilter} = props;
			const {source, sourceForCompute} = dataSet;
			const error = errors[getDataErrorKey(index, FIELDS.source)];
			const computable = values.data.length > 1 || sourceForCompute;
			const removable = values.data.length > 1;

			return (
				<SourceFieldset
					computable={computable}
					dataSet={dataSet}
					dataSetIndex={index}
					error={error}
					key={index}
					onChange={this.handleChange}
					onFetchAttributes={this.handleFetchAttributes}
					onFetchDynamicAttributes={this.handleFetchDynamicAttributes}
					onRemove={this.handleRemoveSource}
					removable={removable}
					sources={sources}
					usesFilter={usesFilter}
					value={source}
				/>
			);
		};

		render () {
			return (
				<Component
					{...this.props}
					renderAddSourceInput={this.renderAddSourceInput}
					renderSourceFieldset={this.renderSourceFieldset}
				/>
			);
		}
	};
};

export default withSource;
