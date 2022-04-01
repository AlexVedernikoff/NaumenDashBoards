// @flow
import type {Breakdown, Indicator} from 'store/widgetForms/types';
import BreakdownFieldset from 'WidgetFormPanel/components/BreakdownFieldset';
import FormBox from 'components/molecules/FormBox';
import type {FormBoxProps} from 'WidgetFormPanel/components/IndicatorsBox/types';
import FormField from 'WidgetFormPanel/components/FormField';
import IndicatorsBox from 'TableWidgetForm/components/IndicatorsBox';
import memoize from 'memoize-one';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {createContext, Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import t from 'localization';
import TextInput from 'components/atoms/TextInput';

const BREAKDOWN_CONTEXT = createContext(null);

BREAKDOWN_CONTEXT.displayName = 'BREAKDOWN_CONTEXT';

export class SingleRowDataSetSettings extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(() => ({
		FormBox: this.renderIndicatorsFormBox
	}));

	getHandleChangeSourceRowNameValue = (index: number) => ({value: sourceRowName}: OnChangeEvent<string>) => {
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

	renderBreakdownFieldSet = breakdown => {
		const {index, isDifferentAggregations, value} = this.props;
		const {dataKey, indicators} = value;
		const {attribute} = indicators?.[0] ?? {};
		const isMain = index === 0;

		return (
			<BreakdownFieldset
				breakdownIndex={index}
				dataKey={dataKey}
				disabled={isDifferentAggregations}
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
		const {components, index, value} = this.props;

		if (!value.sourceForCompute) {
			const {breakdown, dataKey, indicators, source} = value;

			return (
				<BREAKDOWN_CONTEXT.Provider value={breakdown}>
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

	renderIndicatorsFormBox = ({children, ...props}: FormBoxProps) => (
		<BREAKDOWN_CONTEXT.Consumer>
			{breakdown => (
				<FormBox {...props}>
					{children}
					{this.renderBreakdownFieldSet(breakdown)}
				</FormBox>
			)}
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
						onChange={this.getHandleChangeSourceRowNameValue(index)}
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
