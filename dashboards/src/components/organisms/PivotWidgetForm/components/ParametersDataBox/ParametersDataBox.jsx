// @flow
import {DEFAULT_PARAMETER} from 'store/widgetForms/constants';
import FormBox from 'components/molecules/FormBox';
import {hasDisableTotal} from './helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Parameter, ParameterOrder} from 'store/widgetForms/types';
import ParameterFieldset from 'WidgetFormPanel/components/ParameterFieldset';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import SortableList from 'TableWidgetForm/components/SortableList';
import t from 'localization';

export class ParametersDataBox extends PureComponent<Props, State> {
	constructor (props) {
		super(props);
		this.state = {
			disableTotalSum: hasDisableTotal(props.data ?? [])
		};
	}

	componentDidUpdate (prevProps: Props) {
		const {data} = this.props;

		if (prevProps.data === data) {
			this.checkDisableTotalSum();
		} else {
			const disableTotalSum = hasDisableTotal(data);

			this.setState({disableTotalSum}, this.checkDisableTotalSum);
		}
	}

	checkDisableTotalSum = () => {
		const {onChangeShowTotal, showTotal} = this.props;
		const {disableTotalSum} = this.state;

		if (showTotal && disableTotalSum) {
			onChangeShowTotal(false);
		}
	};

	handleChange = (dataSetIndex: number, index: number, parameter: Parameter) => {
		const {data, onChange, value} = this.props;
		const newValue = [...value];

		newValue[index] = {
			dataKey: data[dataSetIndex].dataKey,
			parameter
		};

		onChange(newValue);
	};

	handleChangeDataSet = (index: number, dataSetIndex: number) => {
		const {data, onChange, value} = this.props;
		const newValue = [...value];
		const oldParams = newValue[index].parameter;

		newValue[index] = {
			dataKey: data[dataSetIndex].dataKey,
			parameter: {
				...DEFAULT_PARAMETER,
				group: oldParams.group
			}
		};

		onChange(newValue);
	};

	handleChangeOrder = (parameters: Array<ParameterOrder>) => {
		this.props.onChange(parameters);
	};

	handleClickAddButton = () => {
		const {data, onChange, value} = this.props;
		const newValue = [...value, {
			dataKey: data[0].dataKey,
			parameter: DEFAULT_PARAMETER
		}];

		onChange(newValue);
	};

	handleClickShowTotal = () => {
		const {onChangeShowTotal, showTotal} = this.props;
		return onChangeShowTotal(!showTotal);
	};

	handleRemove = (index: number) => {
		const {onChange, value} = this.props;
		const newValue = value.filter((_, idx) => idx !== index);

		onChange(newValue);
	};

	renderFieldset = (parameter: ParameterOrder, index: number, parameters: Array<ParameterOrder>) => {
		const {data} = this.props;
		const {dataKey, parameter: value} = parameter;
		const dataSetIndex = data.findIndex(item => item.dataKey === dataKey);

		if (dataSetIndex !== -1) {
			return (
				<ParameterFieldset
					dataKey={dataKey}
					dataSetIndex={dataSetIndex}
					dataSets={data}
					index={index}
					key={index}
					onChange={this.handleChange}
					onChangeDataSet={this.handleChangeDataSet}
					onRemove={this.handleRemove}
					removable={true}
					source={data[dataSetIndex].source}
					value={value}
				/>
			);
		}

		return null;
	};

	renderRightControl = () => {
		const {showTotal} = this.props;
		const {disableTotalSum} = this.state;
		return (
			<Fragment>
				<IconButton
					active={showTotal}
					disable={disableTotalSum}
					icon={ICON_NAMES.SUM}
					onClick={this.handleClickShowTotal}
					round={false}
				/>
				<IconButton icon={ICON_NAMES.PLUS} onClick={this.handleClickAddButton} round={false} />
			</Fragment>
		);
	};

	render () {
		const {value} = this.props;

		return (
			<FormBox rightControl={this.renderRightControl()} title={t('ParametersDataBox::Parameter')}>
				<SortableList
					list={value}
					onChangeOrder={this.handleChangeOrder}
					renderItem={this.renderFieldset}
				/>
			</FormBox>
		);
	}
}

export default ParametersDataBox;
