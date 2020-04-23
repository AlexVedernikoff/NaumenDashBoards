// @flow
import {Attribute, FormBox, FormControl, FormField, OuterSelect, Source} from 'components/molecules';
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {Checkbox, ExtendButton, FieldError, IconButton, TextArea} from 'components/atoms';
import type {CheckboxProps, RenderFunction, TextAreaProps} from './types';
import type {ComputedAttr, Source as SourceType} from 'store/widgets/data/types';
import {createRefKey} from 'store/sources/refAttributes/actions';
import {FIELDS} from 'WidgetFormPanel/constants';
import {formRef} from 'WidgetFormPanel';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent} from 'components/types';
import type {OnSelectCallback as OnSelectSourceCallback} from 'components/molecules/Source/types';
import type {ParamsTabProps} from 'components/organisms/WidgetFormPanel/types';
import type {Props as ExtendButtonProps} from 'components/atoms/ExtendButton/types';
import React, {Component, Fragment} from 'react';
import uuid from 'tiny-uuid';
import {WIDGET_OPTIONS} from './constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class DataFormBuilder extends Component<ParamsTabProps> {
	// Список полей для удаления при смене источника данных
	sourceRefs: Array<string> = [];

	invalidInputs = {};

	// Минимальное необходимое количество источников для построения
	minCountBuildingSources = 1;

	componentDidMount () {
		setTimeout(this.init);
	}

	componentDidUpdate () {
		const {setFieldValue, values} = this.props;
		const {current: form} = formRef;
		let top = this.getFirstInvalidCoordinate();

		if (form && values.shouldScrollToError && top) {
			top = form.clientHeight / form.scrollHeight * top;

			form.scrollTo({behavior: 'smooth', top});
			setFieldValue('shouldScrollToError', false);

			this.invalidInputs = {};
		}
	}

	addSet = (count: number = 1) => {
		const {setFieldValue, values} = this.props;
		const set = {
			[FIELDS.dataKey]: uuid(),
			[FIELDS.sourceForCompute]: true
		};
		const data = values[FIELDS.data];

		while (count > 0) {
			data.push(set);
			setFieldValue(FIELDS.data, data);
			count--;
		}

		return data;
	};

	/**
	 * Функция очищает зависимые от источника поля
	 * @param {string} index - индекс набора данных источника
	 */
	clearSourceRefFields = (index: number) => {
		const {setDataFieldValue} = this.props;
		this.sourceRefs.forEach(field => setDataFieldValue(index)(field, undefined));
	};

	getAttributeCreatingModalOptions = () => {
		const {values} = this.props;
		const options = [];

		values[FIELDS.data].forEach(set => {
			const source = set[FIELDS.source];

			if (source) {
				const attributes = this.getAttributeOptions(source.value);
				const dataKey = set[FIELDS.dataKey];

				options.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return options;
	};

	/**
	 * Функция возвращает список атрибутов источника данных
	 * @param {string} classFqn - classFqn исчтоника данных\
	 * @returns {Array<AttributeType>}
	 */
	getAttributeOptions = (classFqn: string) => {
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

	getBuildSets = (data: Array<Object>) => {
		const sets = [];

		data.forEach((set, index) => {
			if (!set[FIELDS.sourceForCompute]) {
				sets.push(index);
			}
		});

		return sets;
	};

	getErrorName = (index: number, name: string) => `data[${index}].${name}`;

	getFirstInvalidCoordinate = () => {
		let firstCoordinate = null;

		Object.keys(this.invalidInputs).forEach(key => {
			const input = this.invalidInputs[key];

			if (!firstCoordinate || firstCoordinate > input.offsetTop) {
				firstCoordinate = input.offsetTop;
			}
		});

		return firstCoordinate;
	};

	getMainSet = (): Object => this.props.values.data.find(set => !set[FIELDS.sourceForCompute]);

	getRefAttributes = (attribute: AttributeType) => () => {
		const {fetchRefAttributes, refAttributes} = this.props;
		const key = createRefKey(attribute);

		if (!refAttributes[key]) {
			fetchRefAttributes(attribute);
		}
	};

	getSet = (index: number) => this.props.values[FIELDS.data][index] || {};

	getTitleAttribute = (attributes: Array<AttributeType>) => {
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

	handleChangeCompute = (index: number) => (name: string, value: boolean) => {
		const {setDataFieldValue, values} = this.props;
		const data = values[FIELDS.data];
		const buildSets = this.getBuildSets(data);

		if (!value && values[FIELDS.type] !== WIDGET_TYPES.COMBO) {
			data.every((set, setIndex) => {
				if (!set[FIELDS.sourceForCompute]) {
					setDataFieldValue(setIndex)(name, true);
					return false;
				}

				return true;
			});
		}

		if (!value || buildSets.length > this.minCountBuildingSources) {
			setDataFieldValue(index)(name, value);
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

	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	handleClickAddSource = () => this.addSet(1);

	handleClickBreakdownExtendButton = (index: number) => () => this.props.setDataFieldValue(index)(FIELDS.withBreakdown, true);

	handleRemoveBreakdown = (index: number) => () => {
		const {setDataFieldValues} = this.props;

		setDataFieldValues(index)({
			[FIELDS.breakdown]: null,
			[FIELDS.withBreakdown]: false
		});
	};

	handleRemoveComputedAttribute = (name: string, code: string) => {
		const {setFieldValue, values} = this.props;
		const computedAttrs = values[FIELDS.computedAttrs];

		setFieldValue(FIELDS.computedAttrs, computedAttrs.filter(a => a.code !== code));
		setFieldValue(name, null);
	};

	handleSaveComputedAttribute = (index: number) => (name: string, newAttr: ComputedAttr) => {
		const {setDataFieldValue, setFieldValue, values} = this.props;
		const computedAttrs = values[FIELDS.computedAttrs] || [];
		let exists = false;

		computedAttrs.forEach((attr, index) => {
			if (attr.code === newAttr.code) {
				computedAttrs[index] = newAttr;
				exists = true;
			}
		});

		if (!exists) {
			computedAttrs.push(newAttr);
		}

		setDataFieldValue(index)(name, newAttr);
		setFieldValue(FIELDS.computedAttrs, computedAttrs);
	};

	handleSelect = (name: string, value: any) => this.props.setFieldValue(name, value);

	handleSelectAttribute = (index: number) => (name: string, value: AttributeType) => {
		const {fetchRefAttributes, refAttributes, setDataFieldValue} = this.props;

		if (value && !value.ref && value.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && value.type in ATTRIBUTE_SETS.REF) {
			const key = createRefKey(value);

			if (refAttributes[key]) {
				const ref = this.getTitleAttribute(refAttributes[key].data);
				value = {...value, ref};
			} else {
				fetchRefAttributes(value, this.setAttributeWithRef(index, name, value));
			}
		}

		this.updateStyleName(index, name, value);
		setDataFieldValue(index)(name, value);
	};

	handleSelectSource = (index: number) => (name: string, nextSource: SourceType | null) => {
		const {setDataFieldValue, values} = this.props;
		const prevSource = values[name];

		if (nextSource) {
			setDataFieldValue(index)(name, {...nextSource});
			this.getAttributeOptions(nextSource.value);
		} else {
			setDataFieldValue(index)(name, null);
		}

		if ((prevSource && !nextSource) || (nextSource && prevSource && prevSource.value !== nextSource.value)) {
			setDataFieldValue(index)(FIELDS.descriptor, '');
		}

		this.clearSourceRefFields(index);
	};

	increaseBuildSources = (data: Array<Object>) => {
		const {setDataFieldValue} = this.props;
		let countBuildSets = 0;

		data.every((set, index) => {
			if (set[FIELDS.sourceForCompute]) {
				setDataFieldValue(index)(FIELDS.sourceForCompute, false);
				countBuildSets++;
			}

			return countBuildSets === this.minCountBuildingSources;
		});
	};

	init = () => {
		const {values} = this.props;
		let data = values[FIELDS.data];

		if (data.length < this.minCountBuildingSources) {
			const diff = this.minCountBuildingSources - data.length;
			data = this.addSet(diff);
		}

		const buildSets = this.getBuildSets(data);

		if (values[FIELDS.type] !== WIDGET_TYPES.COMBO && buildSets.length > this.minCountBuildingSources) {
			this.reduceBuildSources(data);
		}

		if (buildSets.length < this.minCountBuildingSources) {
			this.increaseBuildSources(data);
		}
	};

	isRequiredBreakdown = () => {
		const {type} = this.props.values;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE} = WIDGET_TYPES;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE].includes(type);
	};

	reduceBuildSources = (data: Array<Object>) => {
		const {setDataFieldValue} = this.props;
		let countBuildSources = 0;

		data.forEach((set, index) => {
			if (!set[FIELDS.sourceForCompute]) {
				if (countBuildSources === this.minCountBuildingSources) {
					setDataFieldValue(index)(FIELDS.sourceForCompute, true);
				} else {
					countBuildSources++;
				}
			}
		});
	};

	removeSet = (index: number) => () => {
		const {setFieldValue, values} = this.props;
		const data = values[FIELDS.data];

		if (data.length > this.minCountBuildingSources) {
			data.splice(index, 1);

			setFieldValue(FIELDS.data, data);
			this.increaseBuildSources(data);
		}
	};

	setAttributeWithRef = (index: number, name: string, value: AttributeType) => (refAttributes: Array<AttributeType>) => {
		const {setDataFieldValue} = this.props;
		const ref = this.getTitleAttribute(refAttributes);
		value = {...value, ref};

		this.updateStyleName(index, name, value);
		setDataFieldValue(index)(name, value);
	};

	setInputRef = (name: string) => (ref: any) => {
		const {errors, values} = this.props;

		if (errors[name] && values.shouldScrollToError) {
			this.invalidInputs[name] = ref;
		}
	};

	updateStyleName = (index: number, name: string, value: AttributeType) => {
		const {setFieldValue, values} = this.props;
		const mainSet = this.getMainSet();
		const currentSet = this.getSet(index);

		if (mainSet[FIELDS.dataKey] === currentSet[FIELDS.dataKey]) {
			const {indicator, parameter} = values;

			if (name === FIELDS.xAxis || name === FIELDS.row) {
				setFieldValue(FIELDS.parameter, {
					...parameter,
					name: getProcessedValue(value, 'title')
				});
			}

			if (name === FIELDS.yAxis || name === FIELDS.column) {
				setFieldValue(FIELDS.indicator, {
					...indicator,
					name: getProcessedValue(value, 'title')
				});
			}
		}
	}

	renderAddSourceInput = () => (
		<IconButton onClick={this.handleClickAddSource}>
			<Icon name={ICON_NAMES.PLUS} />
		</IconButton>
	);

	renderAttribute = (index: number, props: Object) => {
		const {refAttributes, setDataFieldValue, values} = this.props;
		const {name, value, ...inputProps} = props;
		const {computedAttrs} = values;
		const set = this.getSet(index);
		const source = set[FIELDS.source];
		const key = `${name}.${index}`;
		let onClick;
		let refAttributeData;

		if (value && value.type in ATTRIBUTE_SETS.REF) {
			onClick = this.getRefAttributes(value);
			refAttributeData = refAttributes[createRefKey(value)];
		}

		return (
			<FormField key={key} onClick={onClick} ref={this.setInputRef(name)}>
				<Attribute
					computedAttrs={computedAttrs}
					getAttributeOptions={this.getAttributeOptions}
					name={name}
					onChangeTitle={setDataFieldValue(index)}
					onRemoveComputedAttribute={this.handleRemoveComputedAttribute}
					onSaveComputedAttribute={this.handleSaveComputedAttribute(index)}
					onSelect={this.handleSelectAttribute(index)}
					onSelectRefInput={setDataFieldValue(index)}
					refAttributeData={refAttributeData}
					source={source}
					sources={this.getAttributeCreatingModalOptions()}
					value={value}
					{...inputProps}
				/>
				{this.renderError(this.getErrorName(index, name))}
			</FormField>
		);
	};

	renderBaseInputs = () => {
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

	renderBreakdown = (index: number) => {
		const {values} = this.props;
		const set = values[FIELDS.data][index];
		const showBreakdown = set[FIELDS.withBreakdown] || set[FIELDS.breakdown] || this.isRequiredBreakdown();

		return (
			<Fragment>
				{this.renderBreakdownExtendButton(index)}
				{showBreakdown && this.renderBreakdownInput(index)}
			</Fragment>
		);
	};

	renderBreakdownExtendButton = (index: number) => {
		const set = this.getSet(index);

		const props = {
			active: set[FIELDS.breakdown] || set[FIELDS.withBreakdown] || this.isRequiredBreakdown(),
			name: FIELDS.withBreakdown,
			onClick: this.handleClickBreakdownExtendButton(index),
			text: 'Разбивка'
		};

		return this.renderExtendButton(props);
	};

	renderBreakdownInput = (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.breakdownGroup,
			type: 'group',
			value: set[FIELDS.breakdownGroup]
		};

		const props = {
			name: FIELDS.breakdown,
			onRemove: this.handleRemoveBreakdown(index),
			refInputProps,
			removable: !this.isRequiredBreakdown(),
			value: set[FIELDS.breakdown]
		};

		return this.renderAttribute(index, props);
	};

	renderByOrder = (renderFunction: RenderFunction, accordingSource: boolean = true, ...params: Array<any>) => {
		return this.props.values.data.map((set, index) => {
			if (!(accordingSource && set[FIELDS.sourceForCompute])) {
				return renderFunction(index, ...params);
			}
		});
	};

	renderCheckBox = (props: CheckboxProps) => {
		const {label, name, onClick, value} = props;

		return (
			<FormField>
				<Checkbox
					label={label}
					name={name}
					onClick={onClick || this.handleClick}
					value={value}
				/>
			</FormField>
		);
	};

	renderError = (name: string) => <FieldError text={this.props.errors[name]} />;

	renderExtendButton = (props: ExtendButtonProps) => (
		<FormField>
			<ExtendButton {...props} />
		</FormField>
	);

	renderIndicator = (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.aggregation,
			type: 'aggregation',
			value: set[FIELDS.aggregation]
		};

		const props = {
			name: FIELDS.indicator,
			refInputProps,
			value: set[FIELDS.indicator],
			withCreate: true
		};

		return this.renderAttribute(index, props);
	};

	renderSource = (index: number, callback?: OnSelectSourceCallback) => {
		const {errors, setDataFieldValue, sources, values} = this.props;
		const removable = values[FIELDS.data].length > this.minCountBuildingSources;
		const set = this.getSet(index);
		const errorName = this.getErrorName(index, FIELDS.source);

		if (callback) {
			// $FlowFixMe
			callback = callback(index);
		}

		const compute = {
			name: FIELDS.sourceForCompute,
			onChange: this.handleChangeCompute(index),
			value: set[FIELDS.sourceForCompute]
		};

		const descriptor = {
			name: FIELDS.descriptor,
			onChange: setDataFieldValue(index),
			value: set[FIELDS.descriptor]
		};

		return (
			<FormField key={errorName} ref={this.setInputRef(errorName)}>
				<Source
					compute={compute}
					descriptor={descriptor}
					error={errors[errorName]}
					name={FIELDS.source}
					onChangeLabel={setDataFieldValue(index)}
					onRemove={this.removeSet(index)}
					onSelect={this.handleSelectSource(index)}
					onSelectCallback={callback}
					removable={removable}
					sources={sources}
					value={set[FIELDS.source]}
				/>
			</FormField>
		);
	};

	renderSourceSection = (callback?: OnSelectSourceCallback) => (
		<FormBox rightControl={this.renderAddSourceInput()} title="Источник">
			{this.renderByOrder(this.renderSource, false, callback)}
		</FormBox>
	);

	renderTextArea = (props: TextAreaProps) => {
		const {errorPath, handleBlur, handleChange, label, name, placeholder, value} = props;

		return (
			<FormField ref={this.setInputRef(name)}>
				<FormControl label={label}>
					<TextArea
						name={name}
						onBlur={handleBlur}
						onChange={handleChange}
						placeholder={placeholder}
						value={value}
					/>
					{this.renderError(errorPath || props.name)}
				</FormControl>
			</FormField>
		);
	};

	renderWidgetSelect = () => {
		const {values} = this.props;

		return (
			<FormField>
				<FormControl label="Тип диаграммы">
					<OuterSelect
						name={FIELDS.type}
						onSelect={this.handleSelect}
						options={WIDGET_OPTIONS}
						value={values[FIELDS.type]}
					/>
				</FormControl>
			</FormField>
		);
	};
}

export default DataFormBuilder;
