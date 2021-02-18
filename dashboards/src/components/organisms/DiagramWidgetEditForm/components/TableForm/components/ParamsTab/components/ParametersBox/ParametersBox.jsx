// @flow
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormBox} from 'components/molecules';
import {getDataErrorKey, getDefaultParameter} from 'DiagramWidgetEditForm/helpers';
import type {Parameter} from 'containers/DiagramWidgetEditForm/types';
import {ParameterFieldset, SortableList} from 'DiagramWidgetEditForm/components';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import withForm from 'DiagramWidgetEditForm/withForm';

export class ParametersBox extends PureComponent<Props> {
	getParameters = () => {
		const {parameters = [getDefaultParameter()]} = this.props.dataSet;
		return parameters;
	};

	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {setDataFieldValue, values} = this.props;
		const {parameters} = values.data[dataSetIndex];
		const newParameters = parameters.map((parameter, index) => index === parameterIndex ? newParameter : parameter);

		setDataFieldValue(dataSetIndex, FIELDS.parameters, newParameters);
	};

	handleChangeOrder = (parameters: Array<Object>) => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.parameters, parameters);
	};

	handleClickAddInput = () => {
		const {index, setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.parameters, [...this.getParameters(), getDefaultParameter()]);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, setDataFieldValue} = this.props;
		const parameters = this.getParameters();

		if (parameters.length > 1) {
			parameters.splice(index, 1);
			setDataFieldValue(dataSetIndex, FIELDS.parameters, parameters);
		}
	};

	renderFieldset = (parameter: Parameter, index: number, parameters: Array<Parameter>) => {
		const {dataSet, errors, index: dataSetIndex} = this.props;
		const removable = parameters.length > 1;
		const errorKey = getDataErrorKey(dataSetIndex, FIELDS.parameters, index);

		return (
			<ParameterFieldset
				dataSet={dataSet}
				dataSetIndex={dataSetIndex}
				error={errors[errorKey]}
				index={index}
				key={index}
				onChange={this.handleChange}
				onRemove={this.handleRemove}
				removable={removable}
				value={parameter}
			/>
		);
	};

	renderRightControl = () => {
		const {renderAddInput} = this.props;
		const addInputProps = {
			onClick: this.handleClickAddInput
		};

		return (
			<Fragment>
				{renderAddInput(addInputProps)}
			</Fragment>
		);
	};

	render () {
		return (
			<FormBox rightControl={this.renderRightControl()} title="Параметры">
				<SortableList
					list={this.getParameters()}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</FormBox>
		);
	}
}

export default withForm(ParametersBox);
