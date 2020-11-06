// @flow
import {BreakdownFieldset, ExtendingFieldset} from 'WidgetFormPanel/components';
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {hasDifferentAggregations} from 'WidgetFormPanel/components/TableForm/helpers';
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import {IndicatorsBox, ParametersBox} from './components';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props as IconButtonProps} from 'components/atoms/IconButton/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.column, FIELDS.row];
	mainIndex: number = 0;

	getDataSetSources = (index: number) => {
		let {fetchLinkedDataSources, linkedSources, sources, values} = this.props;

		if (index > 0) {
			const mainSource = values.data[0].source;
			const classFqn = mainSource && mainSource.value;

			if (classFqn) {
				const linkData = linkedSources[classFqn];

				if (linkData) {
					sources = linkData.map;
				} else {
					fetchLinkedDataSources(classFqn);
				}
			} else {
				sources = {};
			}
		}

		return sources;
	};

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {changeAttributeTitle, setDataFieldValue, values} = this.props;
		const {label, name, parent} = event;
		const parameter = values.data[index][name];

		setDataFieldValue(index, name, changeAttributeTitle(parameter, parent, label));
	};

	handleExtendBreakdown = (index: number) => () => {
		const {setDataFieldValue} = this.props;
		setDataFieldValue(index, FIELDS.withBreakdown, true);
	};

	handleRemoveBreakdown = (index: number = this.mainIndex) => {
		const {setDataFieldValue} = this.props;

		setDataFieldValue(index, FIELDS.breakdown, null);
		setDataFieldValue(index, FIELDS.withBreakdown, false);
	};

	handleSelectBreakdown = (event: OnSelectAttributeEvent, index: number) => {
		const {setDataFieldValue, transformAttribute, values} = this.props;
		const {[FIELDS.breakdown]: currentValue} = values.data[index];
		const {name} = event;
		const nextValue = transformAttribute(event, this.handleSelectBreakdown, index);

		if (!currentValue || currentValue.type !== nextValue.type) {
			setDataFieldValue(index, FIELDS.breakdownGroup, getDefaultSystemGroup(nextValue));
		}

		setDataFieldValue(index, name, nextValue);
	};

	renderAddInput = (props: $Shape<IconButtonProps>) => <IconButton {...props} icon={ICON_NAMES.PLUS} round={false} />;

	renderBreakdownFieldSet = () => {
		const {errors, handleChangeGroup, values} = this.props;
		const set = values.data[this.mainIndex];
		const show = set[FIELDS.withBreakdown] || set[FIELDS.breakdown];
		const errorKey = getDataErrorKey(this.mainIndex, FIELDS.breakdown);

		return (
			<ExtendingFieldset
				className={styles.breakdownField}
				disabled={hasDifferentAggregations(values.data)}
				index={this.mainIndex}
				onClick={this.handleExtendBreakdown(this.mainIndex)}
				show={show} text="Разбивка"
			>
				<BreakdownFieldset
					error={errors[errorKey]}
					index={this.mainIndex}
					key={errorKey}
					name={FIELDS.breakdown}
					onChangeGroup={handleChangeGroup}
					onChangeLabel={this.handleChangeAttributeTitle}
					onRemove={this.handleRemoveBreakdown}
					onSelect={this.handleSelectBreakdown}
					removable={true}
					set={set}
				/>
			</ExtendingFieldset>
		);
	};

	renderDataSet = (set: DataSet, index: number) => {
		const {values} = this.props;
		const {calcTotalColumn} = values;

		return (
			<Fragment>
				{this.renderSourceBox(set, index)}
				{this.renderParametersBox(set, index)}
				{this.renderIndicatorsBox(set, index, calcTotalColumn)}
			</Fragment>
		);
	};

	renderIndicatorsBox = (set: DataSet, index: number, calcTotalColumn: boolean) => {
		if (!set.sourceForCompute) {
			return (
				<IndicatorsBox
					calcTotalColumn={calcTotalColumn}
					index={index}
					onRemoveBreakdown={this.handleRemoveBreakdown}
					renderAddInput={this.renderAddInput}
					renderSumInput={this.renderSumInput}
					set={set}
				/>
			);
		}

		return null;
	};

	renderParametersBox = (set: DataSet, index: number) => (
		<ParametersBox index={index} renderAddInput={this.renderAddInput} set={set} />
	);

	renderSourceBox = (set: DataSet, index: number) => {
		const {renderAddSourceInput, renderSourceFieldset} = this.props;
		const sourceRefFields = {
			breakdown: FIELDS.breakdown,
			indicator: FIELDS.indicators,
			parameter: FIELDS.parameters
		};
		const isMainSource = index === 0;
		const props = {
			sourceRefFields,
			sources: this.getDataSetSources(index),
			usesFilter: isMainSource
		};

		return (
			<FormBox rightControl={renderAddSourceInput()} title="Источник">
				{renderSourceFieldset(props)(set, index)}
			</FormBox>
		);
	};

	renderSumInput = (props: $Shape<IconButtonProps>) => (
		<IconButton
			className={styles.sumInput}
			icon={ICON_NAMES.SUM}
			round={false}
			tip="Подсчитывать итоги"
			{...props}
		/>
	);

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderShowEmptyDataCheckbox, values} = this.props;
		const {data} = values;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{data.map(this.renderDataSet)}
				{this.renderBreakdownFieldSet()}
				{renderShowEmptyDataCheckbox()}
				{renderDisplayModeSelect()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
