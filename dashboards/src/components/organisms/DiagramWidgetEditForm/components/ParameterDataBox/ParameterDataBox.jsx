// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import type {DataSet, Parameter} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AXIS_SORTING_SETTINGS, SORTING_VALUES} from 'store/widgets/data/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {filterByAttribute, getDataErrorKey, getDefaultParameter} from 'DiagramWidgetEditForm/helpers';
import FormBox from 'components/molecules/FormBox';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {isAxisChart} from 'store/widgets/helpers';
import ParameterFieldset from 'DiagramWidgetEditForm/components/ParameterFieldset';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterDataBox extends PureComponent<Props> {
	mainIndex: number = 0;

	/**
	 * Функция изменяет значения параметров и группировок параметров дополнительных источников
	 * относительного главного.
	 */
	changeAdditionalParameterFields = () => {
		const {setFieldValue, values} = this.props;
		const {data} = values;
		const {parameters, source: mainSource} = data[this.mainIndex];
		const mainParameter = parameters?.[this.mainIndex];
		const {attribute: mainAttribute, group: mainGroup} = mainParameter;

		const newData = data.map((dataSet, index) => {
			let newDataSet = dataSet;

			if (index > this.mainIndex) {
				const {source} = newDataSet;
				const {value: sourceValue} = source;
				const parameters = this.getParameters(dataSet);

				const newParameters = parameters.map(parameter => {
					let newParameter = parameter;
					const {attribute} = newParameter;

					if (mainSource?.value === sourceValue?.value) {
						newParameter = mainParameter;
					} else if (mainAttribute?.type !== attribute?.type) {
						newParameter = {
							...newParameter,
							attribute: null
						};
					}

					return {
						...newParameter,
						group: mainGroup
					};
				});

				newDataSet = {
					...newDataSet,
					parameters: newParameters
				};
			}

			return newDataSet;
		});

		setFieldValue(FIELDS.data, newData);
	};

	filterOptions = (filterByRef: boolean) => (options: Array<Attribute>, index: number): Array<Attribute> => {
		const {values} = this.props;
		const mainSet = values.data[this.mainIndex];
		const currentSet = values.data[index];

		if (currentSet !== mainSet) {
			const mainParameter = mainSet.parameters?.[this.mainIndex].attribute;

			return filterByAttribute(options, mainParameter, filterByRef);
		}

		return options;
	};

	getParameters = ({parameters}: DataSet): Array<Parameter> => parameters || [getDefaultParameter()];

	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;
		const parameters = this.getParameters(values.data[dataSetIndex]);
		const {sorting = DEFAULT_AXIS_SORTING_SETTINGS, type} = values;
		let newParameterByMain = newParameter;
		let callback;

		if (dataSetIndex === this.mainIndex && parameterIndex === this.mainIndex) {
			callback = this.changeAdditionalParameterFields;
		} else {
			newParameterByMain = {
				...newParameterByMain,
				group: this.getParameters(values.data[this.mainIndex])[0].group
			};
		}

		if (isAxisChart(type)) {
			const {attribute, group} = newParameterByMain;
			const {DEFAULT, INDICATOR} = SORTING_VALUES;
			let {value} = sorting;

			if (group.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
				value = DEFAULT;
			} else if (sorting.value === DEFAULT) {
				value = INDICATOR;
			}

			setFieldValue(FIELDS.sorting, {...sorting, value});
			setDataFieldValue(dataSetIndex, FIELDS.xAxisName, getAttributeValue(attribute, 'title'));
		}

		const newParameters = parameters.map((parameter, i) => i === parameterIndex ? newParameterByMain : parameter);

		setDataFieldValue(dataSetIndex, FIELDS.parameters, newParameters, callback);
	};

	renderParameterFieldset = (dataSet: DataSet, index: number) => (parameter: Parameter, parameterIndex: number) => {
		const {errors, values} = this.props;
		const {attribute: mainAttribute, group: mainGroup} = this.getParameters(values.data[this.mainIndex])[this.mainIndex];
		const {attribute} = parameter;
		const isEqualRefAttribute = getAttributeValue(attribute, 'type') in ATTRIBUTE_SETS.REFERENCE
			&& getAttributeValue(attribute, 'property') === getAttributeValue(mainAttribute, 'property')
			&& getAttributeValue(attribute, 'code') === getAttributeValue(mainAttribute, 'code');
		const disabledGroup = index !== this.mainIndex && (mainGroup.way === GROUP_WAYS.SYSTEM || isEqualRefAttribute);
		const errorKey = getDataErrorKey(index, FIELDS.parameters, parameterIndex);
		const {dataKey, source} = dataSet;

		return (
			<ParameterFieldset
				dataKey={dataKey}
				dataSetIndex={index}
				disabledGroup={disabledGroup}
				error={errors[errorKey]}
				filterOptions={this.filterOptions}
				index={parameterIndex}
				key={errorKey}
				onChange={this.handleChange}
				source={source}
				value={parameter}
			/>
		);
	};

	renderParameters = (dataSet: DataSet, index: number): Array<React$Node> => {
		return this.getParameters(dataSet).map(this.renderParameterFieldset(dataSet, index));
	};

	render () {
		const {values} = this.props;

		return (
			<FormBox title="Параметр">
				{values.data.map(this.renderParameters)}
			</FormBox>
		);
	}
}

export default ParameterDataBox;
