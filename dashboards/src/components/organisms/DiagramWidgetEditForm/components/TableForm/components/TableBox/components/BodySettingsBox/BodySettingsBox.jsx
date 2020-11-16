// @flow
import {Checkbox, Label} from 'components/atoms';
import {EMPTY_DATA_OPTIONS, PAGE_SIZES} from './constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormCheckControl, FormField, Select} from 'components/molecules';
import type {InputValue, OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
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

	render () {
		const {data, renderTextAlignButtons, renderTextHandlerButtons} = this.props;
		const {defaultValue, pageSize, showRowNum, textAlign, textHandler} = data;

		return (
			<Fragment>
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
			</Fragment>
		);
	}
}

export default withStyleFormBuilder(BodySettingsBox);
