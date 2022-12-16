// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {deepClone} from 'helpers';
import {DEFAULT_TOOLTIP_SETTINGS} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import ExtendButton from 'components/atoms/ExtendButton';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Indicator} from 'store/widgetForms/types';
import {indicatorToKey} from './helpers';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';
import TextArea from 'components/atoms/TextArea';
import Toggle from 'components/atoms/Toggle';

class TableTooltipForm extends PureComponent<Props, State> {
	state = {
		indicatorPositions: [],
		indicatorRefs: [],
		newValue: [],
		showIndicators: false,
		tooltip: DEFAULT_TOOLTIP_SETTINGS,
		unusedIndicators: []
	};

	componentDidMount () {
		const {indicatorRefs} = this.state;
		const indicatorPositions = indicatorRefs
			.filter(indicator => indicator.tooltip?.show)
			.map(indicatorToKey)
			.filter(Boolean);

		this.setState({indicatorPositions});
	}

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

	getChangeIndicatorFontHandler = indicatorRef => ({name, value}) => {
		const {onChange} = this.props;
		const {newValue} = this.state;

		indicatorRef.tooltip = {...indicatorRef.tooltip, [name]: value, show: true};

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	getChangeIndicatorTextHandler = indicatorRef => ({value: title}: OnChangeEvent<string>) => {
		const {onChange} = this.props;
		const {newValue} = this.state;

		indicatorRef.tooltip = {...indicatorRef.tooltip, show: true, title};

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	getClickRemoveButtonHandler = indicatorRef => () => {
		const {onChange} = this.props;
		const {indicatorPositions, newValue} = this.state;
		const removeKey = indicatorToKey(indicatorRef);
		const newIndicatorPositions = indicatorPositions.filter(key => removeKey !== key);

		indicatorRef.tooltip = {show: false, title: ''};

		onChange(DIAGRAM_FIELDS.data, newValue);
		this.setState({indicatorPositions: newIndicatorPositions});
	};

	getSelectIndicatorHandler = (oldSelectRef: Indicator) => ({value: newSelectRef}: OnChangeEvent<Indicator>) => {
		const {onChange} = this.props;
		const {indicatorPositions, newValue} = this.state;
		const removeKey = indicatorToKey(oldSelectRef);
		const addKey = indicatorToKey(newSelectRef);

		if (addKey && removeKey) {
			newSelectRef.tooltip = {show: true, title: oldSelectRef.tooltip?.title ?? ''};
			oldSelectRef.tooltip = {show: false, title: ''};

			const newIndicatorPositions = indicatorPositions.filter(key => removeKey !== key);

			onChange(DIAGRAM_FIELDS.data, newValue);
			newIndicatorPositions.push(addKey);
			this.setState({indicatorPositions: newIndicatorPositions});
		}
	};

	handleChangeIndicatorText = (indicator: Indicator) => ({value: title}: OnChangeEvent<string>) => {
		indicator.tooltip = {...indicator.tooltip ?? DEFAULT_TOOLTIP_SETTINGS, title};
	};

	handleChangeIndicatorsShow = ({value: change}: OnChangeEvent<boolean>) => {
		const {onChange} = this.props;
		const {indicatorRefs, newValue} = this.state;
		let newIndicatorPositions = [];

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

			newIndicatorPositions = indicatorRefs
				.filter(indicator => indicator.tooltip?.show)
				.map(indicatorToKey)
				.filter(Boolean);
		}

		onChange(DIAGRAM_FIELDS.data, newValue);
		this.setState({indicatorPositions: newIndicatorPositions});
	};

	handleChangeTitleFont = ({name, value}) => {
		const {onChange, value: {tooltip}} = this.props;
		return onChange(DIAGRAM_FIELDS.tooltip, {...tooltip, [name]: value});
	};

	handleChangeTooltipShow = ({value: change}: OnChangeEvent<boolean>) => {
		const {onChange, value: {tooltip}} = this.props;
		return onChange(DIAGRAM_FIELDS.tooltip, {...tooltip, show: !change});
	};

	handleChangeTooltipText = ({value: text}: OnChangeEvent<string>) => {
		const {onChange, value: {tooltip}} = this.props;
		return onChange(DIAGRAM_FIELDS.tooltip, {...tooltip, text});
	};

	handleClickIndicatorAdd = () => {
		const {onChange} = this.props;
		const {indicatorPositions, newValue, unusedIndicators} = this.state;

		if (unusedIndicators.length > 0) {
			const firstUnused = unusedIndicators[0];
			const key = indicatorToKey(firstUnused);

			if (key) {
				firstUnused.tooltip = {show: true, title: ''};
				this.setState({indicatorPositions: [...indicatorPositions, key]});
			}
		}

		onChange(DIAGRAM_FIELDS.data, newValue);
	};

	renderIndicator = (showDeleteButton: boolean) => (indicator: Indicator, idx: number) => {
		const {aggregation, attribute} = indicator;

		if (attribute) {
			const {code, sourceCode = ''} = attribute;
			const key = `${sourceCode} ${code} ${aggregation} ${idx}`;
			const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = indicator;

			if (tooltip && tooltip.show) {
				return (
					<Fragment key={key}>
						{this.renderIndicatorSelect(indicator, showDeleteButton)}
						{this.renderIndicatorTextArea(indicator)}
						{this.renderIndicatorFontOptions(indicator)}
					</Fragment>
				);
			}
		}

		return null;
	};

	renderIndicatorAdd = () => {
		const {showIndicators, unusedIndicators} = this.state;

		if (showIndicators && unusedIndicators.length > 0) {
			return (
				<ExtendButton onClick={this.handleClickIndicatorAdd} text={t('TableWidgetForm::TableTooltipForm::AddTooltip')} />
			);
		}

		return null;
	};

	renderIndicatorFontOptions = (indicator: Indicator) => {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = indicator;
		const {fontFamily = DEFAULT_TOOLTIP_SETTINGS.fontFamily, fontSize = DEFAULT_TOOLTIP_SETTINGS.fontSize} = tooltip || DEFAULT_TOOLTIP_SETTINGS;

		return (
			<FormField row>
				<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.getChangeIndicatorFontHandler(indicator)} value={fontFamily} />
				<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.getChangeIndicatorFontHandler(indicator)} value={fontSize} />
			</FormField>
		);
	};

	renderIndicatorList = () => {
		const {indicatorPositions, indicatorRefs, showIndicators} = this.state;

		if (showIndicators) {
			const indicators = indicatorRefs.filter(indicator => indicator.tooltip?.show).sort((a, b) => {
				const aKey = indicatorToKey(a);
				const bKey = indicatorToKey(b);

				if (aKey && bKey) {
					const aPosition = indicatorPositions.indexOf(aKey);
					const bPosition = indicatorPositions.indexOf(bKey);

					return aPosition - bPosition;
				}

				return 0;
			});
			const showDeleteButton = indicators.length > 1;

			return indicators.map(this.renderIndicator(showDeleteButton));
		}

		return null;
	};

	renderIndicatorRemoveButton = (indicator: Indicator) => (
		<IconButton className={styles.removeButton} icon={ICON_NAMES.BASKET} onClick={this.getClickRemoveButtonHandler(indicator)} />
	);

	renderIndicatorSelect = (indicator: Indicator, showDeleteButton: boolean) => {
		const {unusedIndicators} = this.state;
		return (
			<FormField className={styles.tooltipIndicator} label={t('TableWidgetForm::TableTooltipForm::Indicator')}>
				<Select
					getOptionLabel={(option: Indicator) => option.attribute?.title ?? ''}
					getOptionValue={option => option}
					onSelect={this.getSelectIndicatorHandler(indicator)}
					options={unusedIndicators}
					value={indicator}
				/>
				{showDeleteButton && this.renderIndicatorRemoveButton(indicator)}
			</FormField>
		);
	};

	renderIndicatorTextArea = (indicator: Indicator) => {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = indicator;
		const text = tooltip?.text ?? tooltip?.title ?? '';
		const focus = text === '';

		return (
			<FormField label={t('TableWidgetForm::TableTooltipForm::TooltipText')}>
				<TextArea
					focusOnMount={focus}
					maxLength={null}
					name={DIAGRAM_FIELDS.title}
					onChange={this.getChangeIndicatorTextHandler(indicator)}
					value={text}
				/>
			</FormField>
		);
	};

	renderIndicatorToggle = () => {
		const {showIndicators} = this.state;
		return (
			<FormField>
				<FormControl label={t('TableWidgetForm::TableTooltipForm::AtIndicator')} reverse={true}>
					<Toggle checked={showIndicators} onChange={this.handleChangeIndicatorsShow} value={showIndicators} />
				</FormControl>
			</FormField>
		);
	};

	renderIndicators = () => (
		<Fragment>
			{this.renderIndicatorToggle()}
			{this.renderIndicatorList()}
			{this.renderIndicatorAdd()}
		</Fragment>
	);

	renderTitle = () => {
		const {show, text} = this.state.tooltip;

		if (show) {
			return (
				<FormField>
					<TextArea maxLength={null} name={DIAGRAM_FIELDS.text} onChange={this.handleChangeTooltipText} value={text} />
				</FormField>
			);
		}
	};

	renderTitleFont = () => {
		const {
			show,
			fontFamily = DEFAULT_TOOLTIP_SETTINGS.fontFamily,
			fontSize = DEFAULT_TOOLTIP_SETTINGS.fontSize
		} = this.state.tooltip;

		if (show) {
			return (
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleChangeTitleFont} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleChangeTitleFont} value={fontSize} />
				</FormField>
			);
		}

		return null;
	};

	renderTitleToggle = () => {
		const {tooltip = DEFAULT_TOOLTIP_SETTINGS} = this.props.value;
		const {show} = tooltip;
		return (
			<FormField>
				<FormControl label={t('TableWidgetForm::TableTooltipForm::AtTitle')} reverse={true}>
					<Toggle checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleChangeTooltipShow} value={show} />
				</FormControl>
			</FormField>
		);
	};

	renderWidgetTooltip = () => (
		<Fragment>
			{this.renderTitleToggle()}
			{this.renderTitle()}
			{this.renderTitleFont()}
		</Fragment>
	);

	render () {
		return (
			<CollapsableFormBox title={t('TableWidgetForm::TableTooltipForm::Tooltip')} >
				{this.renderWidgetTooltip()}
				{this.renderIndicators()}
			</CollapsableFormBox>
		);
	}
}

export default TableTooltipForm;
