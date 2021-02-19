// @flow
import CellSettingsBox from 'DiagramWidgetEditForm/components/TableForm/components/TableBox/components/CellSettingsBox';
import Checkbox from 'components/atoms/Checkbox';
import {EMPTY_DATA_OPTIONS, PAGE_SIZES} from './constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import type {InputValue, OnChangeInputEvent, OnSelectEvent} from 'components/types';
import Label from 'components/atoms/Label';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class BodySettingsBox extends PureComponent<Props> {
	handleBoolChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, !value);

	handleChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, value);

	handleSelect = ({name, value}: OnSelectEvent) => this.updateSettings(name, value);

	updateSettings = (name: string, value: InputValue) => {
		const {data, name: dataName, onChange} = this.props;

		onChange(dataName, {
			...data,
			[name]: value
		});
	};

	renderCellSettingsBox = (name: string, label: string) => {
		const {[name]: data} = this.props.data;

		return (
			<CellSettingsBox
				data={data}
				label={label}
				name={name}
				onChange={this.updateSettings}
			/>
		);
	};

	render () {
		const {data, renderTextAlignButtons, renderTextHandlerButtons} = this.props;
		const {defaultValue, pageSize, showRowNum, textAlign, textHandler} = data;

		return (
			<div className={styles.container}>
				<Label className={styles.label}>Тело таблицы</Label>
				<FormField>
					<FormCheckControl label="Отображать номер строки">
						<Checkbox
							checked={showRowNum}
							name={FIELDS.showRowNum}
							onChange={this.handleBoolChange}
							value={showRowNum}
						/>
					</FormCheckControl>
				</FormField>
				<FormField className={styles.pageSizeField}>
					<Select
						className={styles.pageSizeSelect}
						name={FIELDS.pageSize}
						onSelect={this.handleSelect}
						options={PAGE_SIZES}
						value={pageSize}
					/>
					<div className={styles.pageSizeSelectLabel}>
						Число отображаемых строк на странице
					</div>
				</FormField>
				<FormField label="Перенос слов">
					{renderTextHandlerButtons({
						onChange: this.handleChange,
						value: textHandler
					})}
				</FormField>
				<FormField label="Отсутствуют данные">
					<Select
						name={FIELDS.defaultValue}
						onSelect={this.handleSelect}
						options={EMPTY_DATA_OPTIONS}
						value={defaultValue}
					/>
				</FormField>
				<FormField label="Выравнивание данных в таблице">
					{renderTextAlignButtons({
						onChange: this.handleChange,
						value: textAlign
					})}
				</FormField>
				{this.renderCellSettingsBox(FIELDS.parameterSettings, 'Стили значений параметра')}
				{this.renderCellSettingsBox(FIELDS.indicatorSettings, 'Стили значений показателя')}
			</div>
		);
	}
}

export default withStyleFormBuilder(BodySettingsBox);
