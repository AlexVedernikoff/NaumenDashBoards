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
	componentDidUpdate (prevProps: Props) {
		const prevAttribute = prevProps.values.data[0].parameters?.[0].attribute;
		const attribute = prevProps.values.data[0].parameters?.[0].attribute;

		if (prevAttribute && attribute && prevAttribute.type !== attribute.type) {
			this.changeAdditionalParameterFields();
		}
	}

	/**
	 * Функция изменяет значения параметров и группировок параметров дополнительных источников
	 * относительного главного.
	 */
	changeAdditionalParameterFields = () => {
		const {setFieldValue, values} = this.props;
		const {data} = values;
		const {parameters, source: mainSource} = data[0];
		const mainParameter = parameters?.[0];
		const {attribute: mainAttribute, group: mainGroup} = mainParameter;
		const {value: mainSourceValue} = mainSource;

		const newData = data.map((dataSet, index) => {
			let newDataSet = dataSet;

			if (index > 0) {
				const {source} = newDataSet;
				const {value: sourceValue} = source;
				const parameters = this.getParameters(dataSet);

				const newParameters = parameters.map(parameter => {
					let newParameter = parameter;
					const {attribute} = newParameter;

					if (mainSourceValue && sourceValue) {
						if (mainSource.value === sourceValue.value) {
							newParameter = mainParameter;
						} else if (mainAttribute && attribute && mainAttribute.type !== attribute.type) {
							newParameter = {
								...newParameter,
								attribute: null
							};
						}

						return {
							...newParameter,
							group: mainGroup
						};
					}
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

	filter = (options: Array<Attribute>, index: number): Array<Attribute> => {
		const {values} = this.props;
		const mainSet = values.data[0];
		const currentSet = values.data[index];
		let mainParameter = mainSet.parameters?.[0].attribute;

		if (currentSet !== mainSet && mainParameter) {
			return filterByAttribute(options, mainParameter);
		}

		return options;
	};

	getParameters = ({parameters}: DataSet): Array<Parameter> => parameters || [getDefaultParameter()];

	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;
		const parameters = this.getParameters(values.data[dataSetIndex]);
		const {sorting = DEFAULT_AXIS_SORTING_SETTINGS, type} = values;
		let callback;

		if (dataSetIndex === 0 && parameterIndex === 0) {
			callback = this.changeAdditionalParameterFields;
		}

		if (isAxisChart(type)) {
			const {attribute, group} = newParameter;
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

		const newParameters = parameters.map((parameter, i) => i === parameterIndex ? newParameter : parameter);

		setDataFieldValue(dataSetIndex, FIELDS.parameters, newParameters, callback);
	};

	renderParameterFieldset = (dataSet: DataSet, index: number) => (parameter: Parameter, parameterIndex: number) => {
		const {errors} = this.props;
		const {attribute} = parameter;
		const disabledGroup = index !== 0 && !!attribute && !(attribute.type in ATTRIBUTE_SETS.REFERENCE);
		const errorKey = getDataErrorKey(index, FIELDS.parameters, parameterIndex);

		return (
			<ParameterFieldset
				dataSet={dataSet}
				dataSetIndex={index}
				disabledGroup={disabledGroup}
				error={errors[errorKey]}
				filter={this.filter}
				index={parameterIndex}
				key={errorKey}
				onChange={this.handleChange}
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
