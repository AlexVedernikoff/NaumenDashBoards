// @flow
import {CHART_OPTIONS} from './constants';
import {createComboDataSet} from 'store/widgetForms/comboChartForm/helpers';
import type {DataSet} from 'store/widgetForms/comboChartForm/types';
import DataSetSettings from 'WidgetFormPanel/components/ChartDataSetSettings';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import FormBox from 'components/molecules/FormBox';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import Icon from 'components/atoms/Icon';
import memoize from 'memoize-one';
import MiniSelect from 'components/molecules/MiniSelect';
import NavigationBox from 'containers/NavigationBox';
import type {Parameter} from 'store/widgetForms/types';
import ParametersDataBox from 'WidgetFormPanel/components/ParametersDataBox';
import type {Props} from './types';
import React, {createContext, Fragment, PureComponent} from 'react';
import ShowTotalAmountBox from 'WidgetFormPanel/components/ShowTotalAmountBox';
import {SORTING_VALUES, WIDGET_TYPES} from 'store/widgets/data/constants';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import styles from './styles.less';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

const DATA_SET_TYPE_CONTEXT = createContext({
	index: 0,
	type: ''
});

DATA_SET_TYPE_CONTEXT.displayName = 'DATA_SET_TYPE_CONTEXT';

export class ParamsTab extends PureComponent<Props> {
	getDataSetSettingsComponents = memoize(() => ({
		...DataSetSettings.defaultProps.components,
		IndicatorsFormBox: this.renderIndicatorFormBox
	}));

	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createComboDataSet(uuid())]);
	};

	handleChangeData = (data: Array<DataSet>) => this.props.onChange(DIAGRAM_FIELDS.data, data);

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		if (values.data[index].indicators[0].attribute !== newDataSet.indicators[0].attribute) {
			newData[index] = {
				...newData[index],
				yAxisName: getAttributeValue(newDataSet.indicators[0].attribute, 'title')
			};
		}

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>) => {
		const {onChange, values} = this.props;
		const {DEFAULT, INDICATOR} = SORTING_VALUES;
		const {sorting} = values;
		const dataSet = values.data[index];
		const {attribute, group} = parameters[0];

		if (group.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
			onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: DEFAULT});
		} else if (sorting.value === DEFAULT) {
			onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: INDICATOR});
		}

		this.handleChangeDataSet(index, {
			...dataSet,
			parameters,
			xAxisName: getAttributeValue(attribute, 'title')
		});
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	handleSelectChartType = (index: number) => (name: string, value: string) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, [name]: value} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	isAllowedComboDiagram = () => {
		const {data} = this.props.values;
		const {COLUMN, COLUMN_STACKED} = WIDGET_TYPES;

		return data.filter(({sourceForCompute, type}) =>
			!sourceForCompute && [COLUMN, COLUMN_STACKED].includes(type)
		).length > 1;
	};

	renderChartFieldLabel = (icon: any) => <Icon height={24} name={icon} viewBox="0 0 24 24" width={24} />;

	renderChartInput = () => (
		<DATA_SET_TYPE_CONTEXT.Consumer>
			{({index, type}) => (
				<div className={styles.chartInput}>
					<MiniSelect
						name={DIAGRAM_FIELDS.type}
						onSelect={this.handleSelectChartType(index)}
						options={CHART_OPTIONS}
						renderLabel={this.renderChartFieldLabel}
						showCaret={false}
						tip="Тип графика"
						value={type}
					/>
				</div>
			)}
		</DATA_SET_TYPE_CONTEXT.Consumer>
	);

	renderDataSetSettings = (dataSet: DataSet, index: number) => {
		const {hasCustomGroup} = this.props;

		if (!dataSet.sourceForCompute) {
			const {type} = dataSet;
			const requiredBreakdown = type === WIDGET_TYPES.COLUMN_STACKED;
			const isAllowed = this.isAllowedComboDiagram();
			const usesBlankData = isAllowed || !hasCustomGroup;
			const usesEmptyData = isAllowed || hasCustomGroup;
			const context = {
				index,
				type
			};

			return (
				<DATA_SET_TYPE_CONTEXT.Provider key={`DataSetSettings_${dataSet.dataKey}`} value={context}>
					<DataSetSettings
						components={this.getDataSetSettingsComponents()}
						index={index}
						onChange={this.handleChangeDataSet}
						requiredBreakdown={requiredBreakdown}
						usesBlankData={usesBlankData}
						usesEmptyData={usesEmptyData}
						usesTotalAmount={true}
						value={dataSet}
					/>
				</DATA_SET_TYPE_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderIndicatorFormBox = ({children, ...props}: Object) => (
		<FormBox {...props} leftControl={this.renderChartInput()}>
			{children}
		</FormBox>
	);

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			index={index}
			key={`SourceFieldset_${dataSet.dataKey}`}
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation, showTotalAmount} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				<ParametersDataBox onChange={this.handleChangeData} onChangeParameters={this.handleChangeParameters} value={data} />
				{data.map(this.renderDataSetSettings)}
				<ShowTotalAmountBox onChange={onChange} showTotalAmount={showTotalAmount} />
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
