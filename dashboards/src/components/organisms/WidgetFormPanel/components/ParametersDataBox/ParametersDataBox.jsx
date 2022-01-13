// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import type {DataSet, Props} from './types';
import {filterByAttribute} from 'WidgetFormPanel/helpers';
import FormBox from 'components/molecules/FormBox';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {Parameter} from 'store/widgetForms/types';
import ParameterFieldset from 'WidgetFormPanel/components/ParameterFieldset';
import React, {PureComponent} from 'react';
import t from 'localization';

export class ParametersDataBox extends PureComponent<Props> {
	mainIndex: number = 0;

	componentDidUpdate (prevProps: Props): * {
		const prevMainParameter = this.getMainParameter(prevProps);
		const mainParameter = this.getMainParameter(this.props);

		if (prevMainParameter !== mainParameter) {
			this.changeAdditionalParameterFields();
		}
	}

	changeAdditionalDataset = (dataSet: DataSet, index: number) => {
		const {source: mainSource} = this.props.value[this.mainIndex];
		let newDataSet = dataSet;

		if (index > this.mainIndex) {
			const {parameters, source} = newDataSet;
			const {value: sourceValue} = source;
			const isEqualSource = mainSource?.value === sourceValue?.value;
			const newParameters = parameters.map(this.changeAdditionalParameters(isEqualSource));

			newDataSet = {
				...newDataSet,
				parameters: newParameters
			};
		}

		return newDataSet;
	};

	/**
	 * Функция изменяет значения атрибутов и группировок параметров дополнительных источников
	 * относительно главного.
	 */
	changeAdditionalParameterFields = () => {
		const {onChange, value} = this.props;

		onChange(value.map(this.changeAdditionalDataset));
	};

	changeAdditionalParameters = (isEqualSource: boolean) => (parameter: Parameter) => {
		const mainParameter = this.props.value[this.mainIndex].parameters?.[this.mainIndex];
		const {attribute: mainAttribute, group: mainGroup} = mainParameter;
		const {attribute} = parameter;
		let newParameter = parameter;

		if (isEqualSource) {
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
	};

	filterOptions = (options: Array<Attribute>, index: number, filterByRef: boolean): Array<Attribute> => {
		const {value} = this.props;
		const mainSet = value[this.mainIndex];
		const currentSet = value[index];

		if (currentSet !== mainSet) {
			const mainParameter = mainSet.parameters?.[this.mainIndex].attribute;

			return filterByAttribute(options, mainParameter, filterByRef);
		}

		return options;
	};

	getMainParameter = (props: Props) => props.value[this.mainIndex].parameters[this.mainIndex];

	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {onChangeParameters, value} = this.props;
		const parameters = value[dataSetIndex].parameters;
		let newParameterByMain = newParameter;

		if (dataSetIndex !== this.mainIndex) {
			const mainParameters = value[this.mainIndex].parameters;

			if (Array.isArray(mainParameters) && mainParameters.length > 0) {
				newParameterByMain = {
					...newParameterByMain,
					group: mainParameters[0].group
				};
			}
		}

		const newParameters = parameters.map((parameter, i) => i === parameterIndex ? newParameterByMain : parameter);

		onChangeParameters(dataSetIndex, newParameters);
	};

	isEqualMainAttribute = (attribute: ?Attribute) => {
		const {value} = this.props;
		const {attribute: mainAttribute} = value[this.mainIndex].parameters[this.mainIndex];

		return getAttributeValue(attribute, 'type') in ATTRIBUTE_SETS.REFERENCE
			&& getAttributeValue(attribute, 'property') === getAttributeValue(mainAttribute, 'property')
			&& getAttributeValue(attribute, 'metaClassFqn') === getAttributeValue(mainAttribute, 'metaClassFqn');
	};

	renderParameterFieldset = (dataSet: DataSet, index: number) => (parameter: Parameter, parameterIndex: number) => {
		const {value} = this.props;
		const {group: mainGroup} = value[this.mainIndex].parameters[this.mainIndex];
		const disabledGroup = index !== this.mainIndex && (mainGroup.way === GROUP_WAYS.SYSTEM
			|| this.isEqualMainAttribute(parameter.attribute));
		const {dataKey, source} = dataSet;
		const key = `${dataKey}-${parameterIndex}`;

		return (
			<ParameterFieldset
				dataKey={dataKey}
				dataSetIndex={index}
				disabledGroup={disabledGroup}
				filterOptions={this.filterOptions}
				index={parameterIndex}
				key={key}
				onChange={this.handleChange}
				source={source}
				value={parameter}
			/>
		);
	};

	renderParameters = (dataSet: DataSet, index: number): Array<React$Node> => dataSet.parameters.map(this.renderParameterFieldset(dataSet, index));

	render () {
		const {value} = this.props;

		return (
			<FormBox title={t('ParametersDataBox::Parameter')}>
				{value.map(this.renderParameters)}
			</FormBox>
		);
	}
}

export default ParametersDataBox;
