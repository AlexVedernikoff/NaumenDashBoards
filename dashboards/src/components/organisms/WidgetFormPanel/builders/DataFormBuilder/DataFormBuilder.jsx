// @flow
import {Attribute, OuterSelect, Source} from 'components/molecules';
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {ComputedAttr, Source as SourceType} from 'store/widgets/data/types';
import {createRefKey} from 'store/sources/refAttributes/actions';
import {FieldLabel} from 'components/atoms';
import {FIELDS, OPTIONS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from 'components/organisms/WidgetFormPanel/builders/FormBuilder';
import type {OnSelectCallback as OnSelectSourceCallback} from 'components/molecules/Source/types';
import React, {Fragment} from 'react';
import type {RenderFunction} from './types';
import uuid from 'tiny-uuid';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class DataFormBuilder extends FormBuilder {
	// Список полей для удаления при смене источника данных
	sourceRefs: Array<string> = [];

	// Минимальное необходимое количество источников для построения
	minCountBuildingSources = 1;

	componentDidMount () {
		setTimeout(this.init);
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

		if (!values[FIELDS.diagramName]) {
			setFieldValue(FIELDS.diagramName, e.target.value);
		}
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

	handleSelectAttribute = (index: number) => (name: string, value: AttributeType | null) => {
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

		setDataFieldValue(index)(name, {...value, ref});
	};

	renderAddSourceInput = () => {
		const props = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.handleClickAddSource
		};

		return this.renderLabelWithIcon(props);
	};

	renderAttribute = (index: number, props: Object) => {
		const {refAttributes, setDataFieldValue, values} = this.props;
		const {name, value, withDivider, ...inputProps} = props;
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
			<div className={styles.field} key={key} onClick={onClick} ref={this.setInputRef(name)}>
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
				{withDivider && this.renderDivider('field')}
				{this.renderError(this.getErrorName(index, name))}
			</div>
		);
	};

	renderBaseInputs = () => {
		const {values} = this.props;
		const {diagramName, name} = FIELDS;

		const nameProps = {
			handleBlur: this.handleBlurName,
			label: 'Название виджета',
			name,
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values[name]
		};

		const diagramNameProps = {
			label: 'Название диаграммы',
			name: diagramName,
			value: values[diagramName]
		};

		return (
			<Fragment>
				{this.renderTextArea(nameProps)}
				{this.renderTextArea(diagramNameProps)}
				{this.renderDivider('section')}
				{this.renderWidgetSelect()}
				{this.renderDivider('section')}
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
			value: set[FIELDS.breakdown],
			withDivider: false
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
			<div className={styles.field} key={errorName} ref={this.setInputRef(errorName)}>
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
			</div>
		);
	};

	renderSourceSection = (callback?: OnSelectSourceCallback) => (
		<Fragment>
			{this.renderAddSourceInput()}
			{this.renderByOrder(this.renderSource, false, callback)}
			{this.renderDivider('section')}
		</Fragment>
	);

	renderWidgetSelect = () => {
		const {values} = this.props;

		return (
			<div className={styles.field}>
				<FieldLabel text="Тип диаграммы" />
				<OuterSelect
					name={FIELDS.type}
					onSelect={this.handleSelect}
					options={OPTIONS.WIDGETS}
					value={values[FIELDS.type]}
				/>
			</div>
		);
	};
}

export default DataFormBuilder;
