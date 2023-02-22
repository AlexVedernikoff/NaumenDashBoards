// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Breakdown} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import {CALC_TOTAL_CONTEXT} from './constants';
import {createTableDataSet, isDontUseParamsForDataSet} from 'store/widgetForms/tableForm/helpers';
import type {DataSet} from 'store/widgetForms/tableForm/types';
import DataSetSettings from 'containers/TableDataSetSettings';
import DataTopField from 'WidgetFormPanel/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import FormBox from 'components/molecules/FormBox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'WidgetFormPanel/components/FormField';
import {hasDifferentAggregations, isDisableDataTopField} from 'TableWidgetForm/helpers';
import type {IndicatorsFormBoxProps} from 'TableWidgetForm/components/DataSetSettings/types';
import memoize from 'memoize-one';
import NavigationBox from 'containers/NavigationBox';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import ShowTotalAmountBox from 'WidgetFormPanel/components/ShowTotalAmountBox';
import SingleRowDataSetSettings from 'containers/TableSingleRowDataSetSettings';
import styles from './styles.less';
import t from 'localization';
import Toggle from 'components/atoms/Toggle';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

export class ParamsTab extends PureComponent<Props> {
	mainIndex: number = 0;

	getDataSetSettingsComponents = memoize(() => ({
		IndicatorsFormBox: this.renderIndicatorsFormBox
	}));

	componentDidMount () {
		this.resetTopByIndicators();
	}

	componentDidUpdate () {
		this.resetTopByIndicators();
	}

	confirmClearSources = async () => {
		const {confirm} = this.props;
		const result = await confirm(
			t('TableWidgetForm::ParamsTab::ConfirmClearSourcesHeader'),
			t('TableWidgetForm::ParamsTab::ConfirmClearSourcesText')
		);

		return result;
	};

	getUsedDataKeys = () => [this.props.values.data[this.mainIndex].dataKey];

	handleAddDataSet = () => {
		const {onChange, values} = this.props;
		const addSourceRowName = isDontUseParamsForDataSet(values.data?.[0]);

		onChange(DIAGRAM_FIELDS.data, [...values.data, createTableDataSet(uuid(), addSourceRowName)]);
	};

	handleChangeCalcTotalColumn = () => {
		const {onChange, values} = this.props;
		return onChange(DIAGRAM_FIELDS.calcTotalColumn, !values.calcTotalColumn);
	};

	handleChangeDataSet = async (index: number, newDataSet: DataSet, callback?: Function) => {
		const {onChange, values} = this.props;
		let newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);
		let needClearingSources = false;

		if (index === 0) {
			const mainDataSet = newData[0];
			const oldMainIsSingleRow = isDontUseParamsForDataSet(values.data[0]);
			const mainIsSingleRow = isDontUseParamsForDataSet(mainDataSet);

			// В случае когда выставляют/сбрасывают признак однострочного источника
			if (oldMainIsSingleRow !== mainIsSingleRow) {
				newData = newData.map(dataSet => {
					let result = dataSet;
					const dataSetIsSingleRow = isDontUseParamsForDataSet(dataSet);

					if (!dataSetIsSingleRow) {
						// Сбрасываем PERCENTAGE_RELATIVE_ATTR для обычных источников
						const indicators = result.indicators;
						const newIndicators = indicators.filter(indicator =>
							indicator.attribute?.type !== ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR
						);

						if (newIndicators.length !== indicators.length) {
							if (newIndicators.length === 0) {
								newIndicators.push(DEFAULT_INDICATOR);
							}

							result = {...result, indicators: newIndicators};
						}
					}

					if (mainIsSingleRow !== dataSetIsSingleRow) {
						result = {...result};

						if (mainIsSingleRow && !dataSetIsSingleRow) {
							// Основный источник - однострочный, выставляем дополнительный в однострочный
							result.sourceRowName = '';
						} else if (!mainIsSingleRow && dataSetIsSingleRow) {
							// Основный источник - не однострочный, сбрасываем признак однострочного источника
							result.sourceRowName = null;

							// При расхождении источника у основного и дополнительного - сбрасываем источник
							if (dataSet?.source?.value?.value !== mainDataSet?.source?.value?.value) {
								result = createTableDataSet(dataSet.dataKey, false);
								needClearingSources = true;
							}

							if (result.indicators.length > 1) {
								result.indicators = result.indicators.slice(0, 1);
							}
						}
					}

					return result;
				});
			}
		}

		if (!needClearingSources || await this.confirmClearSources()) {
			if (hasDifferentAggregations(newData)) {
				this.setBreakdown();
			}

			if ((newData[0].breakdown?.length ?? 0) === 0) {
				newData = newData.map(dataSet => ({...dataSet, breakdown: undefined}));
			}

			onChange(DIAGRAM_FIELDS.data, newData, callback);
		}
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {onChange} = this.props;

		onChange(DIAGRAM_FIELDS.top, top);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	handleToggleChange = (event: OnChangeEvent<boolean>) => {
		const {onChange} = this.props;
		const {name, value} = event;

		onChange(name, !value);
	};

	removeBreakdown = () => {
		this.setBreakdown(undefined);
	};

	resetTopByIndicators = () => {
		const {onChange, values} = this.props;
		const {data, top} = values;

		if (top.show && isDisableDataTopField(data)) {
			onChange(DIAGRAM_FIELDS.top, {
				...top,
				show: false
			});
		}
	};

	setBreakdown = (breakdown?: Breakdown, callback?: Function) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === this.mainIndex ? {...dataSet, breakdown} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	renderBreakdownFieldSet = () => {
		const {values: {data}} = this.props;
		const isSingleRow = isDontUseParamsForDataSet(data[this.mainIndex]);

		if (!isSingleRow) {
			const {breakdown, indicators} = data[this.mainIndex];
			const onlyCommonAttributes = isDontUseParamsForDataSet(data[this.mainIndex]);

			return (
				<BreakdownFieldset
					className={styles.breakdownField}
					disabled={hasDifferentAggregations(data)}
					getUsedDataKeys={this.getUsedDataKeys}
					index={this.mainIndex}
					indicator={indicators?.[0]}
					onChange={this.setBreakdown}
					onRemove={this.removeBreakdown}
					onlyCommonAttributes={onlyCommonAttributes}
					removable={true}
					value={breakdown}
				/>
			);
		}

		return null;
	};

	renderCommonDataSetSettings = (dataSet: DataSet, index: number) => {
		const {calcTotalColumn, data} = this.props.values;
		const isLast = data.length === 1;
		const isMain = index === this.mainIndex;
		const parentClassFqn = isMain ? '' : data[this.mainIndex].source.value?.value;

		return (
			<CALC_TOTAL_CONTEXT.Provider key={`DataSetSettings_${dataSet.dataKey}`} value={calcTotalColumn}>
				<DataSetSettings
					components={this.getDataSetSettingsComponents()}
					index={index}
					isLast={isLast}
					isMain={isMain}
					onAdd={this.handleAddDataSet}
					onChange={this.handleChangeDataSet}
					onChangeCalcTotalColumn={this.handleChangeCalcTotalColumn}
					onRemove={this.handleRemoveDataSet}
					parentClassFqn={parentClassFqn}
					value={dataSet}
				/>
			</CALC_TOTAL_CONTEXT.Provider>
		);
	};

	renderDataSetSettings = (dataSet: DataSet, index: number) => {
		const {data} = this.props.values;
		const isSingleRow = isDontUseParamsForDataSet(data[this.mainIndex]);

		if (isSingleRow) {
			return this.renderSingleRowDataSetSettings(dataSet, index);
		} else {
			return this.renderCommonDataSetSettings(dataSet, index);
		}
	};

	renderDataTopField = () => {
		const {values} = this.props;
		const {data, top} = values;
		const disabled = isDisableDataTopField(data);

		if (!isDontUseParamsForDataSet(data?.[0])) {
			return (
				<FormField name={DIAGRAM_FIELDS.top}>
					<DataTopField
						disabled={disabled}
						hasModeOfTop={false}
						onChange={this.handleChangeTopSettings}
						value={top}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderIndicatorsFormBox = ({children, ...props}: IndicatorsFormBoxProps) => (
		<FormBox {...props}>
			{children}
		</FormBox>
	);

	renderShowEmptyDataCheckbox = () => {
		const {data, showBlankData} = this.props.values;

		if (!isDontUseParamsForDataSet(data?.[0])) {
			return (
				<FormField>
					<FormControl label={t('TableWidgetForm::ParamsTab::ShowBlankValues')} reverse>
						<Toggle
							checked={showBlankData}
							name={DIAGRAM_FIELDS.showBlankData}
							onChange={this.handleToggleChange}
							value={showBlankData}
						/>
					</FormControl>
				</FormField>
			);
		}

		return null;
	};

	renderSingleRowDataSetSettings = (dataSet: DataSet, index: number) => {
		const {calcTotalColumn, data} = this.props.values;
		const isLast = data.length === 1;
		const isMain = index === this.mainIndex;
		const isDifferentAggregations = hasDifferentAggregations(data);
		const hasBreakdownMain = (data[0]?.breakdown?.length ?? 0) > 0;
		const disableBreakdown = isDifferentAggregations || (!isMain && !hasBreakdownMain);

		return (
			<CALC_TOTAL_CONTEXT.Provider key={`DataSetSettings_${dataSet.dataKey}`} value={calcTotalColumn}>
				<SingleRowDataSetSettings
					components={this.getDataSetSettingsComponents()}
					disableBreakdown={disableBreakdown}
					index={index}
					isLast={isLast}
					isMain={isMain}
					onAdd={this.handleAddDataSet}
					onChange={this.handleChangeDataSet}
					onChangeCalcTotalColumn={this.handleChangeCalcTotalColumn}
					onRemove={this.handleRemoveDataSet}
					value={dataSet}
				/>
			</CALC_TOTAL_CONTEXT.Provider>
		);
	};

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation, showTotalAmount} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				{data.map(this.renderDataSetSettings)}
				{this.renderBreakdownFieldSet()}
				{this.renderShowEmptyDataCheckbox()}
				{this.renderDataTopField()}
				<ShowTotalAmountBox onChange={onChange} showTotalAmount={showTotalAmount} />
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default withCommonDialog(ParamsTab);
