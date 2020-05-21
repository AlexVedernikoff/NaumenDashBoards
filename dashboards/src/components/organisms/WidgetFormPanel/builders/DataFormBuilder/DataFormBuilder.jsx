// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {FIELDS, MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import {FormBox, FormControl, OuterSelect} from 'components/molecules';
import {FormField, IndicatorDataBox, ParameterDataBox, SourceDataBox} from 'WidgetFormPanel/components';
import {getMainDataSet} from 'utils/normalizer/widget/helpers';
import type {Group} from 'store/widgets/data/types';
import type {IndicatorBoxProps, ParameterBoxProps, Props, SourceBoxProps, TextAreaProps} from './types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {OnChangeInputEvent} from 'components/types';
import React, {Component, Fragment} from 'react';
import {TextArea} from 'components/atoms';
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

	/*
	 * Функция возвращает список атрибутов ссылочного атрибута
	 * @param {Attribute} Attribute - ссылочный атрибут
	 * @returns {Array<Attribute>}
	 */
	getAttributeOptions = (attribute: Attribute | null) => {
		const {fetchRefAttributes, refAttributes} = this.props;
		let options = [];

		if (attribute && attribute.type in ATTRIBUTE_SETS.REF) {
			const key = createRefKey(attribute);

			if (key in refAttributes) {
				options = refAttributes[key].data;
			} else {
				fetchRefAttributes(attribute);
			}
		}

		return options;
	};

	/**
	 * Функция возвращает список атрибутов источника данных
	 * @param {string} classFqn - classFqn исчтоника данных
	 * @returns {Array<Attribute>}
	 */
	getSourceOptions = (classFqn: string) => {
		const {attributes, fetchAttributes} = this.props;
		let options = [];

		if (classFqn) {
			const currentAttributes = attributes[classFqn];

			if (!currentAttributes) {
				fetchAttributes(classFqn);
			} else {
				options = currentAttributes.data;
			}
		}

		return options;
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
				[FIELDS.name]: e.target.value
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
			[FIELDS.name]: value
		});
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
					ref: this.getTitleAttribute(refAttributes[key].data)
				};
			} else {
				event = {...event, parent, value};
				fetchRefAttributes(value, this.onLoadRefAttributes(event, callback, ...rest));
			}
		}

		return value;
	};

	renderBaseBoxes = () => {
		const {values} = this.props;
		const {header, name} = FIELDS;
		const nameProps = {
			handleBlur: this.handleBlurName,
			handleChange: this.handleChange,
			label: 'Название виджета',
			name,
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values[name]
		};

		const diagramNameProps = {
			errorPath: `${header}.${name}`,
			handleChange: this.handleChangeDiagramName,
			label: 'Название диаграммы',
			maxLength: MAX_TEXT_LENGTH,
			name,
			value: values[header][name]
		};

		return (
			<Fragment>
				<FormBox>
					{this.renderTextArea(nameProps)}
					{this.renderTextArea(diagramNameProps)}
				</FormBox>
				<FormBox>
					{this.renderWidgetSelect()}
				</FormBox>
			</Fragment>
		);
	};

	renderIndicatorBox = (props: IndicatorBoxProps) =>
		(set: DataSet, index: number) => {
		const {errors, setDataFieldValue, setFieldValue, values} = this.props;

		if (!set[FIELDS.sourceForCompute]) {
			return (
				<IndicatorDataBox
					errors={errors}
					getAttributeOptions={this.getAttributeOptions}
					getSourceOptions={this.getSourceOptions}
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
				getAttributeOptions={this.getAttributeOptions}
				getSourceOptions={this.getSourceOptions}
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

	renderSourceBox = (props: SourceBoxProps) => {
		const {errors, setDataFieldValue, setFieldValue, sources, values} = this.props;
		const {data, type} = values;

		return (
			<SourceDataBox
				data={data}
				errors={errors}
				onSelectCallback={this.changeAdditionalParameterFields}
				setDataFieldValue={setDataFieldValue}
				setFieldValue={setFieldValue}
				sources={sources}
				type={type}
				{...props}
			/>
		);
	};

	renderTextArea = (props: TextAreaProps) => {
		const {errors} = this.props;
		const {errorPath, handleBlur, handleChange, label, maxLength, name, placeholder, value} = props;
		const error = errors[errorPath || name];

		return (
			<FormField error={error}>
				<FormControl label={label}>
					<TextArea
						maxLength={maxLength}
						name={name}
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder={placeholder}
						value={value}
					/>
				</FormControl>
			</FormField>
		);
	};

	renderWidgetSelect = () => {
		const {setFieldValue, values} = this.props;

		return (
			<FormField>
				<FormControl label="Тип диаграммы">
					<OuterSelect
						name={FIELDS.type}
						onSelect={setFieldValue}
						options={WIDGET_OPTIONS}
						value={values[FIELDS.type]}
					/>
				</FormControl>
			</FormField>
		);
	};

	render () {
		const {render, setDataFieldValue, setFieldValue, values} = this.props;

		return render({
			renderBaseBoxes: this.renderBaseBoxes,
			renderIndicatorBoxes: this.renderIndicatorBoxes,
			renderParameterBox: this.renderParameterBox,
			renderSourceBox: this.renderSourceBox,
			setDataFieldValue,
			setFieldValue,
			values
		});
	}
}

export default DataFormBuilder;
