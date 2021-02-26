// @flow
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormBox from 'components/molecules/FormBox';
import {getDataErrorKey, getDefaultParameter} from 'DiagramWidgetEditForm/helpers';
import type {Parameter} from 'containers/DiagramWidgetEditForm/types';
import ParameterFieldset from 'DiagramWidgetEditForm/components/ParameterFieldset';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import SortableList from 'DiagramWidgetEditForm/components/SortableList';

export class ParametersBox extends PureComponent<Props> {
	getParameters = () => {
		const {parameters = [getDefaultParameter()]} = this.props.dataSet;

		return parameters;
	};

	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {dataSet, onChange} = this.props;
		const {parameters} = dataSet;
		const newParameters = parameters.map((parameter, index) => index === parameterIndex ? newParameter : parameter);

		onChange(dataSetIndex, newParameters);
	};

	handleChangeOrder = (parameters: Array<Object>) => {
		const {index, onChange} = this.props;

		onChange(index, parameters);
	};

	handleClickAddInput = () => {
		const {index, onChange} = this.props;

		onChange(index, [...this.getParameters(), getDefaultParameter()]);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, onChange} = this.props;
		const parameters = this.getParameters();

		if (parameters.length > 1) {
			parameters.splice(index, 1);
			onChange(dataSetIndex, parameters);
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

export default ParametersBox;
