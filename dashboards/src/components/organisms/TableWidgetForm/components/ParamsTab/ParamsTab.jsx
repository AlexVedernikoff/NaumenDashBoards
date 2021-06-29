// @flow
import type {Breakdown} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import {countIndicators, hasDifferentAggregations} from 'TableWidgetForm/helpers';
import {createTableDataSet} from 'store/widgetForms/tableForm/helpers';
import type {DataSet} from 'store/widgetForms/tableForm/types';
import DataSetSettings from 'containers/TableDataSetSettings';
import DataTopField from 'WidgetFormPanel/components/DataTopField';
import type {DataTopSettings} from 'store/widgets/data/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import FormBox from 'components/molecules/FormBox';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'WidgetFormPanel/components/FormField';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {IndicatorsFormBoxProps} from 'TableWidgetForm/components/DataSetSettings/types';
import {isAllowedTopAggregation} from 'store/widgets/helpers';
import memoize from 'memoize-one';
import NavigationBox from 'containers/NavigationBox';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {createContext, Fragment, PureComponent} from 'react';
import styles from './styles.less';
import Toggle from 'components/atoms/Toggle';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

const CALC_TOTAL_CONTEXT = createContext(false);

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

	getUsedDataKeys = () => [this.props.values.data[this.mainIndex].dataKey];

	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createTableDataSet(uuid())]);
	};

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		if (hasDifferentAggregations(newData)) {
			this.setBreakdown();
		}

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeTopSettings = (top: DataTopSettings) => {
		const {onChange} = this.props;

		onChange(DIAGRAM_FIELDS.top, top);
	};

	handleClickSumButton = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.calcTotalColumn, !values.calcTotalColumn);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	handleToggleShowEmptyData = (event: OnChangeEvent<boolean>) => {
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

		if (top.show && countIndicators(data) > 1) {
			onChange(DIAGRAM_FIELDS.top, {
				...top,
				show: false
			});
		}
	};

	setBreakdown = (breakdown?: Breakdown) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === this.mainIndex ? {...dataSet, breakdown} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	renderBreakdownFieldSet = () => {
		const {values} = this.props;
		const {breakdown, indicators} = values.data[this.mainIndex];

		return (
			<BreakdownFieldset
				className={styles.breakdownField}
				disabled={hasDifferentAggregations(values.data)}
				getUsedDataKeys={this.getUsedDataKeys}
				index={this.mainIndex}
				indicator={indicators[0]}
				onChange={this.setBreakdown}
				onRemove={this.removeBreakdown}
				removable={true}
				value={breakdown}
			/>
		);
	};

	renderDataSetSettings = (dataSet: DataSet, index: number) => {
		const {calcTotalColumn, data} = this.props.values;
		const isLast = data.length === 1;
		const isMain = index === this.mainIndex;
		const parentClassFqn = !isMain ? data[this.mainIndex].source.value?.value : '';

		return (
			<CALC_TOTAL_CONTEXT.Provider value={calcTotalColumn}>
				<DataSetSettings
					components={this.getDataSetSettingsComponents()}
					index={index}
					isLast={isLast}
					isMain={isMain}
					onAdd={this.handleAddDataSet}
					onChange={this.handleChangeDataSet}
					onRemove={this.handleRemoveDataSet}
					parentClassFqn={parentClassFqn}
					value={dataSet}
				/>
			</CALC_TOTAL_CONTEXT.Provider>
		);
	};

	renderDataTopField = () => {
		const {values} = this.props;
		const {data, top} = values;
		const {indicators} = data[this.mainIndex];
		const disabled = countIndicators(data) > 1 || !isAllowedTopAggregation(indicators[0].aggregation);

		return (
			<FormField name={DIAGRAM_FIELDS.top}>
				<DataTopField disabled={disabled} onChange={this.handleChangeTopSettings} value={top} />
			</FormField>
		);
	};

	renderIndicatorsFormBox = ({children, rightControl, ...props}: IndicatorsFormBoxProps) => (
		<FormBox {...props} rightControl={this.renderSumButton(rightControl)}>
			{children}
		</FormBox>
	);

	renderShowEmptyDataCheckbox = () => {
		const {showEmptyData} = this.props.values;

		return (
			<FormField>
				<FormCheckControl label="Показывать нулевые значения" reverse>
					<Toggle
						checked={showEmptyData}
						name={DIAGRAM_FIELDS.showEmptyData}
						onChange={this.handleToggleShowEmptyData}
						value={showEmptyData}
					/>
				</FormCheckControl>
			</FormField>
		);
	};

	renderSumButton = (rightControl: React$Node) => {
		return (
			<CALC_TOTAL_CONTEXT.Consumer>
				{active => (
					<Fragment>
						<IconButton
							active={active}
							className={styles.sumInput}
							icon={ICON_NAMES.SUM}
							onClick={this.handleClickSumButton}
							round={false}
							tip="Подсчитывать итоги"
						/>
						{rightControl}
					</Fragment>
				)}
			</CALC_TOTAL_CONTEXT.Consumer>
		);
	};

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				{data.map(this.renderDataSetSettings)}
				{this.renderBreakdownFieldSet()}
				{this.renderDataTopField()}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
