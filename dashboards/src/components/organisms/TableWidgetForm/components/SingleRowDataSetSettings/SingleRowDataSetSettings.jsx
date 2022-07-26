// @flow
import type {Breakdown, Indicator} from 'store/widgetForms/types';
import type {BreakdownContext, Props} from './types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import {CALC_TOTAL_CONTEXT} from 'TableWidgetForm/components/ParamsTab/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'WidgetFormPanel/components/FormField';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorsBox from 'TableWidgetForm/components/IndicatorsBox';
import type {IndicatorsFormBoxProps} from 'TableWidgetForm/components/DataSetSettings/types';
import memoize from 'memoize-one';
import type {OnChangeEvent} from 'components/types';
import React, {createContext, Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import t from 'localization';
import TextInput from 'components/atoms/TextInput';

const BREAKDOWN_CONTEXT = createContext<?BreakdownContext>(null);

BREAKDOWN_CONTEXT.displayName = 'BREAKDOWN_CONTEXT';

export class SingleRowDataSetSettings extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(() => ({
		FormBox: this.renderIndicatorsFormBoxWithContext,
		FormBoxControls: this.renderIndicatorsControl
	}));

	getChangeSourceRowNameValueHandler = (index: number) => ({value: sourceRowName}: OnChangeEvent<string>) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, sourceRowName});
	};

	handleChangeBreakdown = (breakdown: Breakdown, callback?: Function) => {
		const {index, onChange, value} = this.props;
		return onChange(index, {...value, breakdown}, callback);
	};

	handleChangeIndicators = (index: number, indicators: Array<Indicator>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, indicators}, callback);
	};

	handleClearBreakdown = () => {
		const {index, onChange, value} = this.props;
		return onChange(index, {...value, breakdown: undefined});
	};

	handleClickSumButton = () => this.props.onChangeCalcTotalColumn();

	renderBreakdownFieldSet = breakdown => {
		const {disableBreakdown, index, value} = this.props;
		const {dataKey, indicators} = value;
		const {attribute} = indicators?.[0] ?? {};
		const isMain = index === 0;

		return (
			<BreakdownFieldset
				breakdownIndex={index}
				dataKey={dataKey}
				disabled={disableBreakdown}
				filterAttributesByMain={true}
				index={index}
				indicator={attribute}
				isMain={isMain}
				onChange={this.handleChangeBreakdown}
				onRemove={this.handleClearBreakdown}
				onlyCommonAttributes={true}
				removable={true}
				value={breakdown}
			/>
		);
	};

	renderIndicatorsBox = () => {
		const {components, disableBreakdown, index, value} = this.props;

		if (!value.sourceForCompute) {
			const {breakdown, dataKey, indicators, source} = value;
			const contextValue = {breakdown, disableBreakdown};

			return (
				<BREAKDOWN_CONTEXT.Provider value={contextValue}>
					<IndicatorsBox
						canAddIndicators={false}
						canCreateInterestRelative={true}
						components={this.getIndicatorsBoxComponents(components)}
						dataKey={dataKey}
						index={index}
						onChange={this.handleChangeIndicators}
						source={source}
						value={indicators}
					/>
				</BREAKDOWN_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderIndicatorsControl = () => {
		const {index} = this.props;

		if (index === 0) {
			return (
				<CALC_TOTAL_CONTEXT.Consumer>
					{active => (
						<Fragment>
							<IconButton
								active={active}
								icon={ICON_NAMES.SUM}
								onClick={this.handleClickSumButton}
								round={false}
								tip={t('TableWidgetForm::ParamsTab::CalculateTotal')}
							/>
						</Fragment>
					)}
				</CALC_TOTAL_CONTEXT.Consumer>
			);
		}

		return null;
	};

	renderIndicatorsFormBox = ({children, ...props}: IndicatorsFormBoxProps) => (context: ?BreakdownContext) => {
		const breakdown = context?.breakdown;
		return (
			<FormBox {...props}>
				{children}
				{this.renderBreakdownFieldSet(breakdown)}
			</FormBox>
		);
	};

	renderIndicatorsFormBoxWithContext = (props: IndicatorsFormBoxProps) => (
		<BREAKDOWN_CONTEXT.Consumer>
			{this.renderIndicatorsFormBox(props)}
		</BREAKDOWN_CONTEXT.Consumer>
	);

	renderSourceBox = () => {
		const {index, isLast, onAdd, onChange, onRemove, sources, value} = this.props;

		return (
			<SourceBox onAdd={onAdd}>
				<SourceFieldset
					index={index}
					onChange={onChange}
					onRemove={onRemove}
					removable={!isLast}
					showSourceRowName={true}
					sources={sources}
					usesFilter={true}
					value={value}
				/>
			</SourceBox>
		);
	};

	renderSourceRowNameEditor = () => {
		const {index, value: {sourceRowName}} = this.props;

		return (
			<FormBox title={t('TableWidgetForm::SingleRowDataSetSettings::SourceRowName')}>
				<FormField>
					<TextInput
						onChange={this.getChangeSourceRowNameValueHandler(index)}
						placeholder={t('TableWidgetForm::SingleRowDataSetSettings::SourceRowNamePlaceholder')}
						value={sourceRowName}
					/>
				</FormField>
			</FormBox>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderSourceBox()}
				{this.renderSourceRowNameEditor()}
				{this.renderIndicatorsBox()}
			</Fragment>
		);
	}
}

export default SingleRowDataSetSettings;
