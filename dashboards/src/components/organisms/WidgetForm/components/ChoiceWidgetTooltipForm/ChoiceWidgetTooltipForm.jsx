// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {CHOOSE_OPTIONS} from './constants';
import type {DataSet} from 'store/widgetForms/axisChartForm/types';
import {deepClone} from 'helpers';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import TextArea from 'components/atoms/TextArea';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import type {Values} from 'components/organisms/AxisChartWidgetForm/types';

class ChoiceWidgetTooltipForm extends PureComponent<Props, State> {
	state = {
		indicator: DEFAULT_TOOLTIP_SETTINGS,
		selected: DIAGRAM_FIELDS.tooltip,
		tooltip: DEFAULT_TOOLTIP_SETTINGS
	};

	static getDerivedStateFromProps (props: Props) {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS, data} = props.value;
		const mainData = data.find(data => !data.sourceForCompute);

		if (mainData) {
			const indicator = mainData.indicators?.[0]?.tooltip ?? DEFAULT_TOOLTIP_SETTINGS;
			const selected = tooltip.show || !indicator.show
				? DIAGRAM_FIELDS.tooltip
				: DIAGRAM_FIELDS.indicator;

			return {
				indicator,
				selected,
				tooltip
			};
		}

		return null;
	}

	changeShow = (showTooltip: boolean, showIndicator: boolean) => {
		const {onChange, value} = this.props;
		const newValue: Values = deepClone(value);
		const indicator = newValue.data.find(data => !data.sourceForCompute)?.indicators?.[0];
		const tooltip = {show: showTooltip, title: newValue.tooltip?.title ?? ''};

		if (indicator) {
			indicator.tooltip = {show: showIndicator, title: indicator.tooltip?.title ?? ''};
		}

		onChange(DIAGRAM_FIELDS.tooltip, tooltip);
		onChange(DIAGRAM_FIELDS.data, newValue.data);
	};

	handleChangeShowType = ({value: field}: OnChangeEvent<string>) => {
		if (field === DIAGRAM_FIELDS.tooltip) {
			this.changeShow(true, false);
		} else {
			this.changeShow(false, true);
		}
	};

	handleChangeText = ({value: title}: OnChangeEvent<string>) => {
		const {onChange, value: {data}} = this.props;
		const {selected} = this.state;
		const isTooltipSelected = selected === DIAGRAM_FIELDS.tooltip;
		const newTitleValue = {show: isTooltipSelected, title};
		const newDataValue: Array<DataSet> = deepClone(data);
		const indicator = newDataValue.find(data => !data.sourceForCompute)?.indicators?.[0];

		if (indicator) {
			indicator.tooltip = {show: !isTooltipSelected, title};
		}

		onChange(DIAGRAM_FIELDS.tooltip, newTitleValue);
		onChange(DIAGRAM_FIELDS.data, newDataValue);
	};

	handleShow = ({value: change}: OnChangeEvent<boolean>) => this.changeShow(!change, false);

	render () {
		const {indicator, selected, tooltip} = this.state;
		const show = indicator.show || tooltip.show;
		const value = selected === DIAGRAM_FIELDS.tooltip ? tooltip.title : indicator.title;

		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleShow} showContent={show} title="Подсказка" >
				<FormField>
					<CheckIconButtonGroup
						onChange={this.handleChangeShowType}
						options={CHOOSE_OPTIONS}
						value={selected}
					/>
				</FormField>
				<FormField>
					<TextArea
						focusOnMount={true}
						name={selected}
						onChange={this.handleChangeText}
						value={value} />
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default ChoiceWidgetTooltipForm;
