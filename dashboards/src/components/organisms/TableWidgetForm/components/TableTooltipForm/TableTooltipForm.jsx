// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {deepClone} from 'helpers';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import ExtendButton from 'components/atoms/ExtendButton';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {Indicator} from 'store/widgetForms/types';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import TextArea from 'components/atoms/TextArea';
import Toggle from 'components/atoms/Toggle';

class TableTooltipForm extends PureComponent<Props, State> {
	static getDerivedStateFromProps (props: Props) {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS, data} = props.value;
		const newValue = deepClone(data);
		const mainData = newValue.filter(data => !data.sourceForCompute);
		const indicatorRefs = mainData.flatMap(ds => ds.indicators).filter(indicator => indicator.attribute);
		const showIndicators = indicatorRefs.some(({tooltip}) => tooltip?.show);
		const unusedIndicators = indicatorRefs.filter(({tooltip}) => !tooltip?.show);

		return {
			indicatorRefs,
			newValue,
			showIndicators,
			tooltip,
			unusedIndicators
		};
	}

	getHandleChangeIndicatorText = indicatorRef => ({value: title}: OnChangeEvent<string>) => {
		const {onChange} = this.props;
		const {newValue} = this.state;

		indicatorRef.tooltip = {show: true, title};

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	getHandleSelectIndicator = (oldSelectRef: Indicator) => ({value: newSelectRef}: OnChangeEvent<Indicator>) => {
		const {onChange} = this.props;
		const {newValue} = this.state;

		newSelectRef.tooltip = {show: true, title: oldSelectRef.tooltip?.title ?? ''};
		oldSelectRef.tooltip = {show: false, title: ''};

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	handleChangeIndicatorText = (indicator: Indicator) => ({value: title}: OnChangeEvent<string>) => {
		indicator.tooltip = {...indicator.tooltip ?? DEFAULT_TOOLTIP_SETTINGS, title};
	};

	handleChangeIndicatorsShow = ({value: change}: OnChangeEvent<boolean>) => {
		const {onChange} = this.props;
		const {indicatorRefs, newValue} = this.state;

		if (change) {
			indicatorRefs.forEach(indicator => {
				if (indicator.tooltip) {
					indicator.tooltip.show = false;
				}
			});
		} else {
			let changed = false;

			indicatorRefs.forEach(indicator => {
				if (indicator.tooltip && indicator.tooltip.title !== '') {
					indicator.tooltip.show = true;
					changed = true;
				}
			});

			if (!changed) {
				const indicator = indicatorRefs[0];

				if (indicator) {
					const title = indicator.tooltip?.title ?? '';

					indicator.tooltip = {show: true, title};
				}
			}
		}

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	handleChangeTooltipShow = ({value: change}: OnChangeEvent<boolean>) => {
		const {onChange, value: {tooltip}} = this.props;
		return onChange(DIAGRAM_FIELDS.tooltip, {...tooltip, show: !change});
	};

	handleChangeTooltipText = ({value: title}: OnChangeEvent<string>) => {
		const {onChange, value: {tooltip}} = this.props;
		return onChange(DIAGRAM_FIELDS.tooltip, {...tooltip, title});
	};

	handleClickIndicatorAdd = () => {
		const {onChange} = this.props;
		const {newValue, unusedIndicators} = this.state;

		if (unusedIndicators.length > 0) {
			unusedIndicators[0].tooltip = {show: true, title: ''};
		}

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	renderIndicator = (indicator: Indicator) => {
		const {unusedIndicators} = this.state;
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = indicator;

		if (tooltip.show) {
			return (
				<Fragment>
					<FormField label="Показатель">
						<Select
							getOptionLabel={(option: Indicator) => option.attribute?.title ?? ''}
							getOptionValue={option => option}
							onSelect={this.getHandleSelectIndicator(indicator)}
							options={unusedIndicators}
							value={indicator}
						/>
					</FormField>
					<FormField label="Текст подсказки">
						<TextArea name={DIAGRAM_FIELDS.title} onChange={this.getHandleChangeIndicatorText(indicator)} value={tooltip.title} />
					</FormField>
				</Fragment>
			);
		}

		return null;
	};

	renderIndicatorAdd = () => {
		const {showIndicators, unusedIndicators} = this.state;

		if (showIndicators && unusedIndicators.length > 0) {
			return (
				<ExtendButton onClick={this.handleClickIndicatorAdd} text="Добавить подсказку" />
			);
		}

		return null;
	};

	renderIndicatorList = () => {
		const {indicatorRefs, showIndicators} = this.state;
		const indicators = indicatorRefs.filter(indicator => indicator.tooltip?.show);

		return showIndicators ? indicators.map(this.renderIndicator) : null;
	};

	renderIndicatorToggle = () => {
		const {showIndicators} = this.state;
		return (
			<FormField>
				<FormControl label="В показателе" reverse={true}>
					<Toggle checked={showIndicators} onChange={this.handleChangeIndicatorsShow} value={showIndicators} />
				</FormControl>
			</FormField>
		);
	};

	renderIndicators = () => (
		<Fragment>
			{this.renderIndicatorToggle()};
			{this.renderIndicatorList()}
			{this.renderIndicatorAdd()}
		</Fragment>
	);

	renderTitle = () => {
		const {show, title} = this.state.tooltip;

		if (show) {
			return (
				<FormField>
					<TextArea name={DIAGRAM_FIELDS.title} onChange={this.handleChangeTooltipText} value={title} />
				</FormField>
			);
		}
	};

	renderTitleToggle = () => {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = this.props.value;
		const {show} = tooltip;
		return (
			<FormField>
				<FormControl label="В заголовке" reverse={true}>
					<Toggle checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleChangeTooltipShow} value={show} />
				</FormControl>
			</FormField>
		);
	};

	renderWidgetTooltip = () => (
		<Fragment>
			{this.renderTitleToggle()}
			{this.renderTitle()}
		</Fragment>
	);

	render () {
		return (
			<CollapsableFormBox title="Подсказка" >
				{this.renderWidgetTooltip()}
				{this.renderIndicators()}
			</CollapsableFormBox>
		);
	}
}

export default TableTooltipForm;
