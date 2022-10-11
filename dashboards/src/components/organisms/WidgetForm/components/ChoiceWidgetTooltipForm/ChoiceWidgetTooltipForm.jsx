// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {CHOOSE_OPTIONS} from './constants';
import type {DataSet as SummaryDataSet, Values as SummaryValues} from 'store/widgetForms/summaryForm/types';
import type {DataSet as SpeedometerDataSet, Values as SpeedometerValues} from 'store/widgetForms/speedometerForm/types';
import {deepClone} from 'helpers';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import t, {translateObjectsArray} from 'localization';
import TextArea from 'components/atoms/TextArea';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import type {WidgetTooltip} from 'store/widgets/data/types';

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
		const newValue: SummaryValues | SpeedometerValues = deepClone(value);
		const indicator = this.getIndicator(newValue.data);
		const tooltip = {...value.tooltip, show: showTooltip, title: newValue.tooltip?.title ?? ''};

		if (indicator) {
			indicator.tooltip = {...indicator.tooltip, show: showIndicator, title: indicator.tooltip?.title ?? ''};
		}

		onChange(DIAGRAM_FIELDS.tooltip, tooltip);
		onChange(DIAGRAM_FIELDS.data, newValue.data);
	};

	getIndicator = (data: Array<SummaryDataSet> | Array<SpeedometerDataSet> | null) => data?.find(data => !data.sourceForCompute)?.indicators?.[0];

	getSelectedTooltip = () => {
		const {indicator, selected, tooltip} = this.state;
		return selected === DIAGRAM_FIELDS.tooltip ? tooltip : indicator;
	};

	handleChangeFontFamily = ({value: fontFamily}) => {
		const selectedTooltip = this.getSelectedTooltip();
		return this.setSelectedTooltip({...selectedTooltip, fontFamily});
	};

	handleChangeFontSize = ({value: fontSize}) => {
		const selectedTooltip = this.getSelectedTooltip();
		return this.setSelectedTooltip({...selectedTooltip, fontSize});
	};

	handleChangeShowType = ({value: field}: OnChangeEvent<string>) => {
		if (field === DIAGRAM_FIELDS.tooltip) {
			this.changeShow(true, false);
		} else {
			this.changeShow(false, true);
		}
	};

	handleChangeText = ({value: text}: OnChangeEvent<string>) => {
		const selectedTooltip = this.getSelectedTooltip();
		return this.setSelectedTooltip({...selectedTooltip, text});
	};

	handleShow = ({value: change}: OnChangeEvent<boolean>) => this.changeShow(!change, false);

	setSelectedTooltip = (tooltip: WidgetTooltip) => {
		const {onChange, value} = this.props;
		const {selected} = this.state;

		if (selected === DIAGRAM_FIELDS.tooltip) {
			const newTooltip = {...value.tooltip, ...tooltip, show: true};

			onChange(DIAGRAM_FIELDS.tooltip, newTooltip);
		} else {
			const {data} = value;
			const newDataValue: Array<SummaryDataSet> | Array<SpeedometerDataSet> = deepClone(data);
			const indicator = this.getIndicator(newDataValue);

			if (indicator) {
				indicator.tooltip = {...indicator.tooltip, ...tooltip, show: true};
				onChange(DIAGRAM_FIELDS.data, newDataValue);
			}
		}
	};

	renderFontOptions = () => {
		const {
			fontFamily = DEFAULT_TOOLTIP_SETTINGS.fontFamily,
			fontSize = DEFAULT_TOOLTIP_SETTINGS.fontSize
		} = this.getSelectedTooltip();

		return (
			<FormField row>
				<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleChangeFontFamily} value={fontFamily} />
				<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleChangeFontSize} value={fontSize} />
			</FormField>
		);
	};

	renderSelect = () => {
		const {selected} = this.state;
		const options = translateObjectsArray('title', CHOOSE_OPTIONS);

		return (
			<FormField>
				<CheckIconButtonGroup
					onChange={this.handleChangeShowType}
					options={options}
					value={selected}
				/>
			</FormField>
		);
	};

	renderText = () => {
		const {selected} = this.state;
		const {text, title} = this.getSelectedTooltip();

		return (
			<FormField>
				<TextArea
					focusOnMount={true}
					maxLength={1000}
					name={selected}
					onChange={this.handleChangeText}
					value={text ?? title}
				/>
			</FormField>
		);
	};

	render () {
		const {indicator, tooltip} = this.state;
		const show = indicator.show || tooltip.show;

		return (
			<ToggableFormBox
				name={DIAGRAM_FIELDS.show}
				onToggle={this.handleShow}
				showContent={show}
				title={t('WidgetForm::ChoiceWidgetTooltipForm::Tooltip')}
			>
				{this.renderSelect()}
				{this.renderText()}
				{this.renderFontOptions()}
			</ToggableFormBox>
		);
	}
}

export default ChoiceWidgetTooltipForm;
