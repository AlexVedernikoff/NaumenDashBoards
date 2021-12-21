// @flow
import CellSettingsBox from 'TableWidgetForm/components/CellSettingsBox';
import Checkbox from 'components/atoms/Checkbox';
import {EMPTY_DATA_OPTIONS, PAGE_SIZES} from './constants';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {OnChangeEvent, OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import {TABLE_FIELDS} from 'TableWidgetForm/constants';
import TextAlignControl from 'WidgetFormPanel/components/TextAlignControl';
import TextHandlerControl from 'WidgetFormPanel/components/TextHandlerControl';

export class BodySettingsBox extends PureComponent<Props> {
	handleBoolChange = ({name, value}: OnChangeEvent<boolean>) => this.updateSettings(name, !value);

	handleChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, value);

	handleSelect = ({name, value}: OnSelectEvent) => this.updateSettings(name, value);

	updateSettings = (name: string, value: any) => {
		const {onChange, value: settings} = this.props;

		onChange({...settings, [name]: value});
	};

	renderCellSettingsBox = (name: string, label: string) => {
		const {[name]: data} = this.props.value;

		return <CellSettingsBox label={label} name={name} onChange={this.updateSettings} value={data} />;
	};

	render () {
		const {defaultValue, pageSize, showRowNum, textAlign, textHandler} = this.props.value;

		return (
			<div className={styles.container}>
				<Label className={styles.label}><T text="TableWidgetForm::BodySettingsBox::TableBody" /></Label>
				<FormField>
					<FormControl label={t('TableWidgetForm::BodySettingsBox::ShowRowNumber')}>
						<Checkbox
							checked={showRowNum}
							name={TABLE_FIELDS.showRowNum}
							onChange={this.handleBoolChange}
							value={showRowNum}
						/>
					</FormControl>
				</FormField>
				<FormField className={styles.pageSizeField}>
					<Select
						className={styles.pageSizeSelect}
						name={TABLE_FIELDS.pageSize}
						onSelect={this.handleSelect}
						options={PAGE_SIZES}
						value={pageSize}
					/>
					<div className={styles.pageSizeSelectLabel}>
						<T text="TableWidgetForm::BodySettingsBox::RowCountLimit" />
					</div>
				</FormField>
				<FormField label={t('TableWidgetForm::BodySettingsBox::Wrap')}>
					<TextHandlerControl name={TABLE_FIELDS.textHandler} onChange={this.handleChange} value={textHandler} />
				</FormField>
				<FormField label={t('TableWidgetForm::BodySettingsBox::EmptyData')}>
					<Select
						getOptionLabel={({label}) => t(label)}
						name={TABLE_FIELDS.defaultValue}
						onSelect={this.handleSelect}
						options={EMPTY_DATA_OPTIONS}
						value={defaultValue}
					/>
				</FormField>
				<FormField label={t('TableWidgetForm::BodySettingsBox::AligningData')}>
					<TextAlignControl name={TABLE_FIELDS.textAlign} onChange={this.handleChange} value={textAlign} />
				</FormField>
				{this.renderCellSettingsBox(TABLE_FIELDS.parameterSettings, t('TableWidgetForm::BodySettingsBox::ParameterStyle'))}
				{this.renderCellSettingsBox(TABLE_FIELDS.indicatorSettings, t('TableWidgetForm::BodySettingsBox::IndicatorStyle'))}
			</div>
		);
	}
}

export default BodySettingsBox;
