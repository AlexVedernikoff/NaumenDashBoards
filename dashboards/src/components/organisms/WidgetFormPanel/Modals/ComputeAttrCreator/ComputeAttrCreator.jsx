// @flow
import type {Control, Props, State} from './types';
import {createOrderName} from 'utils/widget';
import {getAggregateOptions, FIELDS, TYPES as ATTR_TYPES} from 'components/organisms/WidgetFormPanel';
import Modal from 'components/molecules/Modal';
import {number} from 'yup';
import {operators, TYPES} from './constants';
import type {OptionType} from 'react-select/src/types';
import React, {Component} from 'react';
import {Select} from 'components/molecules';
import styles from './styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';
import uuid from 'tiny-uuid';

const FIRST_NAME = uuid();
const rule = number().required();

export class ComputeAttrCreator extends Component<Props, State> {
	state = {
		constants: [],
		controls: {
			[FIRST_NAME]: {
				name: FIRST_NAME,
				next: null,
				prev: null,
				type: null,
				value: null
			}
		},
		first: FIRST_NAME,
		focus: true,
		last: FIRST_NAME,
		sources: []
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {values} = props;
		const order = values[FIELDS.order];
		const sources = [];

		if (order) {
			order.forEach(num => {
				const source = values[createOrderName(num)(FIELDS.source)];

				if (source) {
					source.datakey = values[createOrderName(num)(FIELDS.dataKey)];
					sources.push({...source});
				}
			});

			state.sources = sources;

			return state;
		}

		return null;
	}

	createName = () => {
		const {controls} = this.state;
		const name = uuid();

		return controls[name] ? this.createName() : name;
	};

	addControl = async (prevName: string, type: string | null) => {
		const nextName = this.createName();

		this.setState(state => {
			let {controls, last} = state;
			const prevControl = controls[prevName];

			if (last === prevName) {
				last = nextName;
			}

			return {
				controls: {
					...controls,
					[prevName]: {
						...prevControl,
						next: nextName
					},
					[nextName]: {
						name: nextName,
						next: prevControl.next,
						prev: prevName,
						type,
						value: null
					}
				},
				last
			};
		});

		return nextName;
	};

	handleCreateConstant = (name: string, value: string) => {
		const {constants} = this.state;
		const option = {
			label: value,
			value
		};

		this.setState({
			constants: [...constants, option]
		});
		this.handleSelect(name, option);
	};

	isSource = (source: OptionType) => source && this.state.sources.find(s => s.value === source.value);

	deleteSourceRefControls = (name: string) => {
		this.setState(state => {
			let {controls} = state;
			const currentControl = controls[name];

			const refAttrKey = currentControl.next;
			const refAggregationKey = refAttrKey && controls[refAttrKey].next;

			if (refAttrKey && refAggregationKey) {
				const newCurrentNextKey = controls[refAggregationKey].next;
				let newLast = currentControl.name;

				if (newCurrentNextKey) {
					const nextControl = controls[newCurrentNextKey];
					controls[newCurrentNextKey].prev = name;

					if (nextControl && !nextControl.next) {
						newLast = nextControl.name;
					}
				}

				delete controls[refAttrKey];
				delete controls[refAggregationKey];

				return {
					controls: {
						...controls,
						[name]: {...controls[name], next: newCurrentNextKey}
					},
					last: newLast
				};
			}

			return state;
		});
	};

	deleteLastControl = (state: State) => {
		const {controls, first, last} = state;
		const lastControl = controls[last];
		const {AGGREGATION, ATTRIBUTE} = TYPES;
		const {prev, type, value} = lastControl;

		if (type !== AGGREGATION && type !== ATTRIBUTE && !value && prev) {
			const prevControl = controls[prev];

			if (prevControl.name !== first) {
				delete controls[last];

				return {
					controls: {
						...controls,
						[prev]: {...prevControl, next: null}
					},
					last: prev
				};
			}
		}
	};

	changeControl = (name: string, control: Control) => {
		this.setState(({controls}) => ({
			controls: {
				...controls,
				[name]: control
			}
		}));
	};

	handleSelect = async (name: string, value: OptionType) => {
		const {AGGREGATION, ATTRIBUTE, SOURCE} = TYPES;
		const {controls, focus} = this.state;
		const currentControl = controls[name];
		const {type: currentType, value: currentValue} = currentControl;
		const isSourceValue = this.isSource(value);
		const nextControl = currentControl.next && controls[currentControl.next];
		const haveSourceRefType = currentType === AGGREGATION || currentType === ATTRIBUTE;
		let valueMustDeleted = false;

		if (focus) {
			this.setState({focus: undefined});
		}

		if (!isSourceValue && !haveSourceRefType) {
			valueMustDeleted = currentValue && currentValue.value === value.value;
		}

		let type = null;

		if (haveSourceRefType) {
			type = currentType;
		} else if (isSourceValue) {
			type = SOURCE;
		}

		const nextValue = valueMustDeleted ? null : value;
		const newControl = {...currentControl, value: nextValue, type};

		this.changeControl(name, newControl);

		if (valueMustDeleted && nextControl && !nextControl.next && !nextControl.value) {
			this.setState(this.deleteLastControl);
		}

		const typeIsChangedFromSource = !isSourceValue && currentType === TYPES.SOURCE;

		if (typeIsChangedFromSource) {
			this.deleteSourceRefControls(name);
		}

		if (isSourceValue) {
			if (!nextControl || (nextControl && nextControl.type !== ATTRIBUTE)) {
				const attrName = await this.addControl(name, ATTRIBUTE);
				this.addControl(attrName, AGGREGATION);
			}
		} else if ((!nextControl && !valueMustDeleted) || typeIsChangedFromSource) {
			this.addControl(name, null);
		}
	};

	onSubmit = () => {
		const {AGGREGATION, ATTRIBUTE, SOURCE} = TYPES;
		const {controls, first} = this.state;
		const {onSubmit, name} = this.props;
		const computeData = {};
		let title = '';
		let stringForCompute = '';
		let controlName = first;

		while (controlName) {
			const {name, next, type, value} = controls[controlName];
			controlName = next;

			if (value) {
				if (type === AGGREGATION) {
					title = `${title} (${value.label})`;
					continue;
				}

				if (type === ATTRIBUTE) {
					title = `${title} - ${value.title}`;
					continue;
				}

				if (type === SOURCE) {
					const attr = next && controls[next];
					const aggregationControl = attr && attr.next && controls[attr.next];
					const aggregationValue = aggregationControl && aggregationControl.value;

					computeData[name] = {
						aggregation: aggregationValue && aggregationValue.value,
						attr: attr && attr.value,
						dataKey: value.datakey
					};
				}

				stringForCompute = type === SOURCE ? `${stringForCompute}{${name}}` : `${stringForCompute}${value.value}`;
				title = title ? `${title} ${value.label}` : value.label;
			}
		}

		onSubmit(name, {
			code: uuid(),
			computeData,
			stringForCompute,
			title,
			type: ATTR_TYPES.COMPUTED_ATTR
		});
	};

	getAttributes = (source?: string) => {
		const {attributes, fetchAttributes} = this.props;
		let options = [];

		if (source) {
			const currentAttr = attributes[source];

			if (currentAttr) {
				options = currentAttr.data;
			} else {
				fetchAttributes(source);
			}
		}

		return options;
	};

	getOptions = (control: Control) => {
		const {AGGREGATION, ATTRIBUTE} = TYPES;
		const {sources, constants, controls} = this.state;
		const {prev, type} = control;
		const prevValue = prev && controls[prev].value;

		if (type === AGGREGATION && typeof prevValue === 'object') {
			return getAggregateOptions(prevValue);
		}

		if (type === ATTRIBUTE && prevValue && this.isSource(prevValue)) {
			return this.getAttributes(prevValue.value);
		}

		return [...operators, ...constants, ...sources];
	};

	renderControl = (control: Control) => {
		const {focus} = this.state;
		const options = this.getOptions(control);
		const {name, value} = control;
		const isAttr = control.type === TYPES.ATTRIBUTE;
		const isAggregation = control.type === TYPES.AGGREGATION;
		const isSourceRef = isAttr || isAggregation;
		const form = {
			onSubmit: this.handleCreateConstant,
			rule,
			value: 0
		};

		return (
			<div className={styles.controlContainer} key={name}>
				<Select
					attr={isAttr}
					form={form}
					isEditableLabel={false}
					isSearchable={isAttr}
					menuIsOpen={focus}
					name={name}
					onSelect={this.handleSelect}
					options={options}
					placeholder="..."
					value={value}
					withCreate={!isSourceRef}
				/>
			</div>
		);
	};

	renderControls = (): any => {
		const {controls, first} = this.state;
		const items = [];
		let controlName = first;

		while (controlName) {
			const control = controls[controlName];
			controlName = control.next;

			items.push(this.renderControl(control));
		}

		return items;
	};

	render () {
		const {onClose} = this.props;

		return (
			<Modal header="Создать вычислимое поле" onClose={onClose} onSubmit={this.onSubmit} size="large">
				<div className={styles.container}>
					{this.renderControls()}
				</div>
			</Modal>
		);
	}
}

export default withForm(ComputeAttrCreator);
