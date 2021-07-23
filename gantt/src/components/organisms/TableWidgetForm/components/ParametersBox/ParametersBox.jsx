// @flow
import {DEFAULT_PARAMETER} from 'store/widgetForms/constants';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Parameter} from 'store/widgetForms/types';
import ParameterFieldset from 'WidgetFormPanel/components/ParameterFieldset';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import SortableList from 'TableWidgetForm/components/SortableList';

export class ParametersBox extends PureComponent<Props> {
	handleChange = (dataSetIndex: number, parameterIndex: number, newParameter: Parameter) => {
		const {onChange, value} = this.props;
		const newParameters = value.map((parameter, index) => index === parameterIndex ? newParameter : parameter);

		onChange(dataSetIndex, newParameters);
	};

	handleChangeOrder = (parameters: Array<Parameter>) => {
		const {index, onChange} = this.props;

		onChange(index, parameters);
	};

	handleClickAddButton = () => {
		const {index, onChange, value} = this.props;

		onChange(index, [...value, DEFAULT_PARAMETER]);
	};

	handleRemove = (index: number) => {
		const {index: dataSetIndex, onChange, value} = this.props;

		if (value.length > 1) {
			onChange(dataSetIndex, value.filter((p, i) => i !== index));
		}
	};

	renderFieldset = (parameter: Parameter, index: number, parameters: Array<Parameter>) => {
		const {dataKey, index: dataSetIndex, source} = this.props;
		const removable = parameters.length > 1;

		return (
			<ParameterFieldset
				dataKey={dataKey}
				dataSetIndex={dataSetIndex}
				index={index}
				key={index}
				onChange={this.handleChange}
				onRemove={this.handleRemove}
				removable={removable}
				source={source}
				value={parameter}
			/>
		);
	};

	renderRightControl = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleClickAddButton} round={false} />;

	render () {
		const {value} = this.props;

		return (
			<FormBox rightControl={this.renderRightControl()} title="Параметры">
				<SortableList
					list={value}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</FormBox>
		);
	}
}

export default ParametersBox;
