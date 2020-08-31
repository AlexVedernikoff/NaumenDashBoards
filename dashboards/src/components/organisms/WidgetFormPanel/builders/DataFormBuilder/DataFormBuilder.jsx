// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {Checkbox, TextArea, Toggle} from 'components/atoms';
import type {CheckboxProps, IndicatorBoxProps, ParameterBoxProps, Props, TextAreaProps} from './types';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import {FIELDS, MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import {FormBox, FormCheckControl, OuterSelect, Select} from 'components/molecules';
import {FormField, IndicatorDataBox, ParameterDataBox, SourceDataBox} from 'WidgetFormPanel/components';
import {getMainDataSet} from 'utils/normalizer/widget/helpers';
import type {Group} from 'store/widgets/data/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {OnChangeInputEvent} from 'components/types';
import React, {Component, Fragment} from 'react';
import type {SourceRefFields} from 'WidgetFormPanel/components/SourceDataBox/types';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {WIDGET_OPTIONS} from './constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class DataFormBuilder extends Component<Props> {
	/**
	 * Функция изменяет значения параметров и группировок параметров дополнительных источников
	 * относительного главного.
	 * @param {string} parameterName - наименование поля параметра
	 * @returns {Function}
	 */
	changeAdditionalParameterFields = (parameterName: string) => () => {
		const {setDataFieldValue, values} = this.props;
		const {data, type} = values;
		const mainSet = getMainDataSet(data);

		data.forEach((currentSet, index) => {
			const {group: mainGroup, source: mainSource, [parameterName]: mainParameter} = mainSet;
			const {source: currentSource, [parameterName]: currentParameter} = currentSet;

			if (mainSet !== currentSet && mainSource && currentSource) {
				if (mainSource.value === currentSource.value) {
					setDataFieldValue(index, parameterName, mainParameter);
				} else if (mainParameter && currentParameter && mainParameter.type !== currentParameter.type) {
					setDataFieldValue(index, parameterName, null);
				}

				if (type !== WIDGET_TYPES.TABLE) {
					setDataFieldValue(index, FIELDS.group, mainGroup);
				}
			}
		});
	};

	getTitleAttribute = (attributes: Array<Attribute>) => {
		return attributes.find(attribute => attribute.code === 'title') || null;
	};

	handleBlurName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {setFieldValue, values} = this.props;
		const {[FIELDS.header]: header} = values;

		if (!header[FIELDS.name]) {
			setFieldValue(FIELDS.header, {
				...header,
				[FIELDS.name]: e.target.value.substr(0, MAX_TEXT_LENGTH)
			});
		}
	};

	handleChange = (e: OnChangeInputEvent) => {
		const {setFieldValue} = this.props;
		const {name, value} = e;

		setFieldValue(name, value);
	};

	handleChangeAttributeTitle = (event: OnChangeAttributeLabelEvent, index: number) => {
		const {setDataFieldValue, values} = this.props;
		const {label: title, name, parent} = event;
		let value = values.data[index][name];

		if (value) {
			if (parent) {
				value = {
					...value,
					ref: {
						...value.ref,
						title
					}
				};
			} else {
				value = {
					...value,
					title
				};
			}

			setDataFieldValue(index, name, value);
		}
	};

	handleChangeDiagramName = (e: OnChangeInputEvent) => {
		const {setFieldValue, values} = this.props;
		const {value} = e;

		setFieldValue(FIELDS.header, {
			...values[FIELDS.header],
			[FIELDS.template]: value
		});
	};

	handleChangeDisplayMode = ({value}: Object) => {
		const {setFieldValue} = this.props;
		const {value: modeValue} = value;

		setFieldValue(FIELDS.displayMode, modeValue);
	};

	handleChangeGroup = (index: number, name: string, value: Group, field: Object) => {
		const {setDataFieldValue} = this.props;
		const {name: fieldName, parent, value: attribute} = field;
		const event = {
			label: attribute.title,
			name: fieldName,
			parent
		};

		this.handleChangeAttributeTitle(event, index);
		setDataFieldValue(index, name, value);
	};

	handleChangeUseName = ({name, value}: OnChangeInputEvent) => {
		const {setFieldValue, values} = this.props;

		setFieldValue(FIELDS.header, {
			...values[FIELDS.header],
			[name]: !value
		});
	};

	handleToggleShowEmptyData = (event: OnChangeInputEvent) => {
		const {setFieldValue} = this.props;
		const {name, value} = event;

		setFieldValue(name, !value);
	};

	onLoadRefAttributes = (event: OnSelectAttributeEvent, callback: Function, ...rest: Array<any>) =>
	(refAttributes: Array<Attribute>) => {
		event.value = {...event.value, ref: this.getTitleAttribute(refAttributes)};
		callback(event, ...rest);
	};

	transformAttribute = (event: OnSelectAttributeEvent, callback: Function, ...rest: Array<any>) => {
		const {fetchRefAttributes, refAttributes} = this.props;
		let {parent, value} = event;

		if (parent) {
			value = {
				...parent,
				ref: value
			};

			parent = null;
		}

		if (value && value.type in ATTRIBUTE_SETS.REF && !value.ref) {
			const key = createRefKey(value);

			if (refAttributes[key]) {
				value = {
					...value,
					ref: this.getTitleAttribute(refAttributes[key].options)
				};
			} else {
				const callbackEvent = {...event, parent, value};
				fetchRefAttributes(value, this.onLoadRefAttributes(callbackEvent, callback, ...rest));
			}
		}

		return value;
	};

	renderBaseBoxes = () => {
		const {values} = this.props;
		const {useName} = values.header;
		const nameProps = {
			handleBlur: this.handleBlurName,
			handleChange: this.handleChange,
			label: 'Название виджета',
			name: FIELDS.templateName,
			value: values[FIELDS.templateName]
		};

		const useNameCheckbox = {
			label: 'Использовать для заголовка диаграммы',
			name: FIELDS.useName,
			onChange: this.handleChangeUseName,
			value: useName
		};

		return (
			<Fragment>
				<FormBox>
					{this.renderTextArea(nameProps)}
					{this.renderCheckbox(useNameCheckbox)}
					{this.renderDiagramNameTextArea()}
				</FormBox>
				<FormBox>
					{this.renderWidgetSelect()}
				</FormBox>
			</Fragment>
		);
	};

	renderCheckbox = (props: CheckboxProps) => {
		const {label, name, onChange, value} = props;

		return (
			<FormCheckControl className={styles.checkbox} label={label}>
				<Checkbox checked={value} name={name} onChange={onChange} value={value} />
			</FormCheckControl>
		);
	};

	renderDiagramNameTextArea = () => {
		const {values} = this.props;
		const {template: templateName, useName} = values.header;
		const {header, template} = FIELDS;

		if (!useName) {
			const diagramNameProps = {
				errorPath: `${header}.${template}`,
				handleChange: this.handleChangeDiagramName,
				label: 'Заголовок диаграммы',
				maxLength: MAX_TEXT_LENGTH,
				name: template,
				value: templateName
			};

			return this.renderTextArea(diagramNameProps);
		}

		return null;
	};

	renderDisplayModeSelect = () => {
		const {personalDashboard, user} = this.props;
		const {displayMode} = this.props.values;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<FormBox title="Область отображения">
					<FormField>
						<Select
							onSelect={this.handleChangeDisplayMode}
							options={DISPLAY_MODE_OPTIONS}
							placeholder="Отображение виджета в мобильной версии"
							value={value}
						/>
					</FormField>
				</FormBox>
			);
		}

		return null;
	};

	renderIndicatorBox = (props: IndicatorBoxProps) =>
		(set: DataSet, index: number) => {
		const {errors, setDataFieldValue, setFieldValue, values} = this.props;

		if (!set[FIELDS.sourceForCompute]) {
			return (
				<IndicatorDataBox
					errors={errors}
					index={index}
					key={index}
					onChangeGroup={this.handleChangeGroup}
					onChangeLabel={this.handleChangeAttributeTitle}
					set={set}
					setDataFieldValue={setDataFieldValue}
					setFieldValue={setFieldValue}
					transformAttribute={this.transformAttribute}
					values={values}
					{...props}
				/>
			);
		}

		return null;
	};

	renderIndicatorBoxes = (props?: IndicatorBoxProps = {}): Array<React$Node> => {
		const {values} = this.props;
		return values.data.map(this.renderIndicatorBox(props));
	};

	renderParameterBox = (props: ParameterBoxProps) => {
		const {errors, setDataFieldValue, setFieldValue, values} = this.props;

		return (
			<ParameterDataBox
				errors={errors}
				onChangeGroup={this.handleChangeGroup}
				onChangeLabel={this.handleChangeAttributeTitle}
				onSelectCallback={this.changeAdditionalParameterFields}
				setDataFieldValue={setDataFieldValue}
				setFieldValue={setFieldValue}
				transformAttribute={this.transformAttribute}
				values={values}
				{...props}
			/>
		);
	};

	renderShowEmptyDataCheckbox = () => {
		const {showEmptyData} = this.props.values;

		return (
			<FormField>
				<FormCheckControl label="Отображать нулевые значения" reverse>
					<Toggle
						checked={showEmptyData}
						name={FIELDS.showEmptyData}
						onChange={this.handleToggleShowEmptyData}
						value={showEmptyData}
					/>
				</FormCheckControl>
			</FormField>
		);
	};

	renderSourceBox = (sourceRefFields: SourceRefFields, minCountBuildingSources: number = 1) => {
		const {errors, fetchAttributes, setDataFieldValue, setFieldValue, sources, values} = this.props;
		const {data, type} = values;

		return (
			<SourceDataBox
				data={data}
				errors={errors}
				fetchAttributes={fetchAttributes}
				minCountBuildingSources={minCountBuildingSources}
				onSelectCallback={this.changeAdditionalParameterFields}
				setDataFieldValue={setDataFieldValue}
				setFieldValue={setFieldValue}
				sourceRefFields={sourceRefFields}
				sources={sources}
				type={type}
			/>
		);
	};

	renderTextArea = (props: TextAreaProps) => {
		const {errors} = this.props;
		const {className, errorPath, handleBlur, handleChange, label, maxLength, name, placeholder, value} = props;
		const error = errors[errorPath || name];

		return (
			<FormField className={className} error={error}>
				<TextArea
					label={label}
					maxLength={maxLength}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					placeholder={placeholder}
					value={value}
				/>
			</FormField>
		);
	};

	renderWidgetSelect = () => {
		const {setFieldValue, values} = this.props;

		return (
			<FormField label="Тип диаграммы">
				<OuterSelect
					name={FIELDS.type}
					onSelect={setFieldValue}
					options={WIDGET_OPTIONS}
					value={values[FIELDS.type]}
				/>
			</FormField>
		);
	};

	render () {
		const {errors, render, setDataFieldValue, setFieldValue, values} = this.props;

		return render({
			errors,
			renderBaseBoxes: this.renderBaseBoxes,
			renderDisplayModeSelect: this.renderDisplayModeSelect,
			renderIndicatorBoxes: this.renderIndicatorBoxes,
			renderParameterBox: this.renderParameterBox,
			renderShowEmptyDataCheckbox: this.renderShowEmptyDataCheckbox,
			renderSourceBox: this.renderSourceBox,
			setDataFieldValue,
			setFieldValue,
			values
		});
	}
}

export default DataFormBuilder;
