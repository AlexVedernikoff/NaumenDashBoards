// @flow
import {Attribute, OuterSelect, Source} from 'components/molecules';
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {CHART_VARIANTS} from 'utils/chart';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {createOrdinalName, createRefName, getNumberFromName, WIDGET_VARIANTS} from 'utils/widget';
import {createRefKey} from 'store/sources/refAttributes/actions';
import {FieldLabel} from 'components/atoms';
import {FIELDS, OPTIONS, SETTINGS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from 'components/organisms/WidgetFormPanel/builders/FormBuilder';
import type {OnSelectCallback as OnSelectSourceCallback, SourceValue} from 'components/molecules/Source/types';
import React, {Fragment} from 'react';
import type {RenderFunction} from './types';
import uuid from 'tiny-uuid';

export class DataFormBuilder extends FormBuilder {
	// Список полей для удаления при смене источника данных
	sourceRefs = [];

	// Порядок полей по умолчанию
	defaultOrder = [SETTINGS.FIRST_KEY];

	componentDidMount () {
		setTimeout(this.init);
	}

	addSet = (count: number) => {
		const {setFieldValue} = this.props;
		let order = this.getOrder();
		let nextNumber = order[order.length - 1] + 1;

		while (count > 0) {
			order = [...order, nextNumber];
			setFieldValue(FIELDS.order, order);
			setFieldValue(createOrdinalName(FIELDS.dataKey, nextNumber), uuid());

			nextNumber++;
			count--;
		}

		return order;
	};

	/**
	 * Функция очищает зависимые от источника поля
	 * @param {string} name - название поля источника
	 */
	clearSourceRefFields = (name: string) => {
		const {setFieldValue} = this.props;
		const number = getNumberFromName(name);

		this.sourceRefs.map(field => createOrdinalName(field, number))
			.forEach(field => setFieldValue(field, null));
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

	getBaseName = (name: string) => name.split('_').shift();

	getBuildSources = (order: Array<number>) => {
		const {values} = this.props;
		const sources = [];

		order.forEach(number => {
			const sourceName = createOrdinalName(FIELDS.source, number);
			const sourceForComputeName = createOrdinalName(FIELDS.sourceForCompute, number);

			if (values[sourceName] && !values[sourceForComputeName]) {
				sources.push(sourceName);
			}
		});

		return sources;
	};

	// $FlowFixMe
	getOrder = () => this.props.values.order || this.defaultOrder;

	/**
	 * Функция возвращает список атрибутов ссылочного атрибута
	 * @param {AttributeType} attribute - ссылочный атрибут
	 * @returns {Array<AttributeType>}
	 */
	getRefAttributeOptions = (attribute: AttributeType) => {
		const {refAttributes, fetchRefAttributes} = this.props;
		const key = createRefKey(attribute);
		let options = [];

		const currentAttributes = refAttributes[key];

		if (!currentAttributes) {
			fetchRefAttributes(attribute);
		} else {
			options = currentAttributes.data;
		}

		return options;
	};

	getAttributeModalOptions = () => {
		const {values} = this.props;
		const options = [];

		this.getOrder().forEach(number => {
			const source = values[createOrdinalName(FIELDS.source, number)];

			if (source) {
				const attributes = this.getAttributeOptions(source.value);
				const dataKey = values[createOrdinalName(FIELDS.dataKey, number)];

				options.push({
					attributes,
					dataKey,
					source
				});
			}
		});

		return options;
	};

	init = () => {
		const {setFieldValue, values} = this.props;
		let order = values[FIELDS.order];

		if (!Array.isArray(order)) {
			order = this.defaultOrder;

			order.forEach(num => {
				setFieldValue(createOrdinalName(FIELDS.dataKey, num), uuid());
			});
			setFieldValue(FIELDS.order, order);
		}

		if (order.length < this.defaultOrder.length) {
			const diff = this.defaultOrder.length - order.length;
			order = this.addSet(diff);
		}

		const buildSources = this.getBuildSources(order);

		if (values[FIELDS.type] !== CHART_VARIANTS.COMBO && buildSources.length > this.defaultOrder.length) {
			this.reduceBuildSources(order);
		}

		if (buildSources.length < this.defaultOrder.length) {
			this.increaseBuildSources(order);
		}
	};

	increaseBuildSources = (order: Array<number>) => {
		const {setFieldValue, values} = this.props;
		let countBuildSources = 0;

		order.every(number => {
			const name = createOrdinalName(FIELDS.sourceForCompute, number);
			const value = values[name];

			if (value) {
				setFieldValue(name, false);
				countBuildSources++;
			}

			return countBuildSources === this.defaultOrder.length;
		});
	};

	isRequiredBreakdown = () => {
		const {type} = this.props.values;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = CHART_VARIANTS;
		const {TABLE} = WIDGET_VARIANTS;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE].includes(type);
	};

	reduceBuildSources = (order: Array<number>) => {
		const {setFieldValue, values} = this.props;
		let countBuildSources = 0;

		order.forEach(number => {
			const name = createOrdinalName(FIELDS.sourceForCompute, number);
			const value = values[name];

			if (!value) {
				if (countBuildSources === this.defaultOrder.length) {
					setFieldValue(name, true);
				} else {
					countBuildSources++;
				}
			}
		});
	};

	handleBlurName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {handleBlur, setFieldValue, values} = this.props;
		const diagramName = values[FIELDS.diagramName];

		if (values[FIELDS.isNew] && !diagramName) {
			setFieldValue(FIELDS.diagramName, e.target.value);
		}

		handleBlur(e);
	};

	handleChangeCompute = (name: string, value: boolean) => {
		const {setFieldValue, values} = this.props;
		const order = this.getOrder();
		const buildSources = this.getBuildSources(order);
		const sourceName = createRefName(name, FIELDS.source);

		if (!value && values[FIELDS.type] !== CHART_VARIANTS.COMBO) {
			order.every(number => {
				const name = createOrdinalName(FIELDS.sourceForCompute, number);

				if (!values[name]) {
					setFieldValue(name, true);
					return false;
				}

				return true;
			});
		}

		if (!value || (value && (buildSources.length > this.defaultOrder.length || !buildSources.includes(sourceName)))) {
			setFieldValue(name, value);
		}
	};

	handleClickAddSource = () => this.addSet(1);

	handleClickExtendBreakdown = (withBreakdownName: string) => () => this.props.setFieldValue(withBreakdownName, true);

	handleRemoveAttribute = (name: string, code: string) => {
		const {setFieldValue, values} = this.props;
		const computedAttrs = values[FIELDS.computedAttrs];

		setFieldValue(FIELDS.computedAttrs, computedAttrs.filter(a => a.code !== code));
		setFieldValue(name, null);
	};

	handleRemoveBreakdown = (breakdownName: string) => {
		const {setFieldValue} = this.props;
		const withBreakdownName = createRefName(breakdownName, FIELDS.withBreakdown);

		setFieldValue(breakdownName, null);
		setFieldValue(withBreakdownName, false);
	};

	handleSaveAttribute = (name: string, newAttr: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
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

		setFieldValue(name, newAttr);
		setFieldValue(FIELDS.computedAttrs, computedAttrs);
	};

	handleSelectSource = async (name: string, nextSource: SourceValue | null) => {
		const {setFieldValue, values} = this.props;
		const prevSource = values[name];

		if (nextSource) {
			await setFieldValue(name, {...nextSource});
			this.getAttributeOptions(nextSource.value);
		} else {
			await setFieldValue(name, null);
		}

		if ((prevSource && !nextSource) || (nextSource && prevSource && prevSource.value !== nextSource.value)) {
			setFieldValue(createRefName(name, FIELDS.descriptor), null);
		}

		this.clearSourceRefFields(name);
	};

	removeSet = (name: string) => {
		const {setFieldValue, values} = this.props;
		const number = getNumberFromName(name);
		const {order} = values;

		if (order.length > this.defaultOrder.length) {
			const newOrder = order.filter(n => n !== number);

			setFieldValue(FIELDS.order, newOrder);
			this.increaseBuildSources(newOrder);
		}
	};

	renderAddSourceInput = () => {
		const props = {
			icon: 'plus',
			name: 'Источник',
			onClick: this.handleClickAddSource
		};

		return this.renderLabelWithIcon(props);
	};

	renderAttribute = (props: Object) => {
		const {setFieldValue, values} = this.props;
		const {name} = props;
		const sourceName = createOrdinalName(FIELDS.source, getNumberFromName(name));
		const {computedAttrs, [sourceName]: source} = values;

		return (
			<div className={styles.field} key={name} ref={this.setInputRef(name)}>
				<Attribute
					computedAttrs={computedAttrs}
					getAttributeOptions={this.getAttributeOptions}
					getRefAttributeOptions={this.getRefAttributeOptions}
					onChangeTitle={setFieldValue}
					onRemoveAttribute={this.handleRemoveAttribute}
					onSaveAttribute={this.handleSaveAttribute}
					onSelect={setFieldValue}
					onSelectRefInput={setFieldValue}
					source={source}
					sources={this.getAttributeModalOptions()}
					{...props}
				/>
				{this.renderError(name)}
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

	renderBreakdown = (name: string) => {
		const {values} = this.props;
		const withBreakdownName = createRefName(name, FIELDS.withBreakdown);
		const showBreakdown = values[withBreakdownName] || values[name] || this.isRequiredBreakdown();

		return (
			<Fragment>
				{this.renderBreakdownExtendButton(withBreakdownName)}
				{showBreakdown && this.renderBreakdownInput(name)}
			</Fragment>
		);
	};

	renderBreakdownInput = (name: string) => {
		const {values} = this.props;
		const breakdownGroupName = createRefName(name, FIELDS.breakdownGroup);

		const refInputProps = {
			name: breakdownGroupName,
			type: 'group',
			value: values[breakdownGroupName]
		};

		const props = {
			isRemovable: !this.isRequiredBreakdown(),
			name,
			onRemove: this.handleRemoveBreakdown,
			refInputProps,
			value: values[name],
			withDivider: false
		};

		return this.renderAttribute(props);
	};

	renderBreakdownExtendButton = (withBreakdown: string) => {
		const {values} = this.props;

		const props = {
			onClick: this.handleClickExtendBreakdown(withBreakdown),
			text: 'Разбивка',
			active: values[withBreakdown]
		};

		return this.renderExtendButton(props);
	};

	renderIndicator = (name: string) => {
		const {values} = this.props;
		const aggregationName = createRefName(name, FIELDS.aggregation);

		const refInputProps = {
			name: aggregationName,
			type: 'aggregation',
			value: values[aggregationName]
		};

		const props = {
			name,
			refInputProps,
			value: values[name],
			withCreate: true
		};

		return this.renderAttribute(props);
	};

	renderByOrder = (renderFunction: RenderFunction, name: string, accordingSource: boolean = true) => {
		const {values} = this.props;

		return this.getOrder().map(number => {
			const sourceForCompute = values[createOrdinalName(FIELDS.sourceForCompute, number)];

			if (!accordingSource || (accordingSource && !sourceForCompute)) {
				return renderFunction(
					createOrdinalName(name, number)
				);
			}
		});
	};

	renderSource = (callback?: OnSelectSourceCallback) => (name: string) => {
		const {errors, setFieldValue, sources, values} = this.props;
		const ordinalNumber = getNumberFromName(name);
		const computeName = createOrdinalName(FIELDS.sourceForCompute, ordinalNumber);
		const descriptorName = createOrdinalName(FIELDS.descriptor, ordinalNumber);
		const isRemovable = this.getOrder().length > this.defaultOrder.length;

		const compute = {
			name: computeName,
			onChange: this.handleChangeCompute,
			value: values[computeName]
		};

		const descriptor = {
			name: descriptorName,
			onChange: setFieldValue,
			value: values[descriptorName]
		};

		return (
			<div className={styles.field} key={name} ref={this.setInputRef(name)}>
				<Source
					error={errors[name]}
					isRemovable={isRemovable}
					name={name}
					compute={compute}
					descriptor={descriptor}
					onChangeLabel={setFieldValue}
					onRemove={this.removeSet}
					onSelect={this.handleSelectSource}
					onSelectCallback={callback}
					sources={sources}
					value={values[name]}
				/>
			</div>
		);
	};

	renderSourceSection = (callback?: OnSelectSourceCallback) => (
		<Fragment>
			{this.renderAddSourceInput()}
			{this.renderByOrder(this.renderSource(callback), FIELDS.source, false)}
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
