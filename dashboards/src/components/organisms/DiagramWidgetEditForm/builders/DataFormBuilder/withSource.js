// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ContextProps} from 'DiagramWidgetEditForm/types';
import type {DataSet, SourceData} from 'containers/DiagramWidgetEditForm/types';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {
	getDataErrorKey,
	getDefaultBreakdown,
	getDefaultIndicator,
	getDefaultParameter,
	getParentClassFqn
} from 'DiagramWidgetEditForm/helpers';
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

		handleChange = (dataSetIndex: number, newSource: SourceData) => {
			const {setDataFieldValue, values} = this.props;
			const {source} = values.data[dataSetIndex];

			if (newSource.descriptor !== source.descriptor) {
				this.resetDynamicAttributes(dataSetIndex);
			}

			if (source.value && source.value.value !== newSource.value?.value) {
				this.resetAttributes(dataSetIndex);
			}

			setDataFieldValue(dataSetIndex, FIELDS.source, newSource);
			newSource.value && this.handleFetchAttributes(dataSetIndex, newSource.value.value);
		};

		handleChangeForCompute = (dataSetIndex: number, value: boolean) => {
			const {setDataFieldValue} = this.props;

			setDataFieldValue(dataSetIndex, FIELDS.sourceForCompute, value);
		};

		handleFetchAttributes = (dataSetIndex: number, classFqn: string = '') => {
			const {fetchAttributes, values} = this.props;

			if (classFqn) {
				const parentClassFqn = getParentClassFqn(values);

				fetchAttributes(classFqn, parentClassFqn, this.setDefaultIndicator(dataSetIndex));
			}
		};

		handleFetchDynamicAttributes = (dataSetIndex: number, descriptor: string) => {
			const {fetchDynamicAttributeGroups, values} = this.props;
			const {dataKey} = values.data[dataSetIndex];

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

		isDynamicAttribute = (attribute: ?Attribute) => attribute && attribute.property === DYNAMIC_ATTRIBUTE_PROPERTY;

		resetAttributes = (index: number) => {
			const {setDataFieldValue, values} = this.props;
			const {breakdown, dataKey} = values.data[index];

			setDataFieldValue(index, FIELDS.parameters, [getDefaultParameter()]);
			setDataFieldValue(index, FIELDS.indicators, [getDefaultIndicator()]);
			breakdown && setDataFieldValue(index, FIELDS.breakdown, [getDefaultBreakdown(dataKey)]);
		};

		resetDynamicAttribute = (data: Object) => {
			const {attribute, ...rest} = data;

			return {
				...rest,
				attribute: this.isDynamicAttribute(attribute) ? null : attribute
			};
		};

		resetDynamicAttributes = (index: number) => {
			const {setFieldValue, values} = this.props;
			const newData = values.data.map((dataSet, dataSetIndex) => {
				let newDataSet = dataSet;

				if (dataSetIndex === index) {
					const {breakdown, indicators, parameters} = newDataSet;

					newDataSet = {
						...newDataSet,
						breakdown: breakdown?.map(this.resetDynamicAttribute),
						indicators: indicators.map(this.resetDynamicAttribute),
						parameters: parameters?.map(this.resetDynamicAttribute)
					};
				}

				return newDataSet;
			});

			setFieldValue(FIELDS.data, newData);
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
					onChangeForCompute={this.handleChangeForCompute}
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
