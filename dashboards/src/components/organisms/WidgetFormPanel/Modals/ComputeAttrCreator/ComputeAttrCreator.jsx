// @flow
import {COMPUTED_ATTR, operators, TYPES} from './constants';
import Control from './Control';
import type {Control as ControlType} from './Control/types';
import {createOrderName} from 'utils/widget';
import {getAggregateOptions} from 'utils/aggregate';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import Modal from 'components/molecules/Modal';
import type {OptionType} from 'react-select/src/types';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';
import uuid from 'tiny-uuid';

const FIRST_NAME = uuid();

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
		last: FIRST_NAME,
		sources: []
	};

	componentDidMount () {
		this.setSources();
	}

	setSources = () => {
		const {values} = this.props;
		const order = values[FIELDS.order];
		const sources = [];

		if (order.length) {
			order.forEach(num => {
				let source = values[createOrderName(num)(FIELDS.source)];

				if (source) {
					sources.push({...source});
				}
			});

			this.setState({sources});
		}
	};

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

	handleCreateConstant = (name: string, constant: number) => {
		const {constants} = this.state;
		const option = {
			label: constant,
			value: constant
		};

		this.setState({
			constants: [...constants, option]
		});
		this.handleSelect(name, option);
	};

	isSource = (source: OptionType) => source && this.state.sources.find(s => s.value === source.value);

	deleteSourceRefControls = async (name: string) => {
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

	changeControl = (name: string, control: ControlType) => {
		this.setState(({controls}) => ({
			controls: {
				...controls,
				[name]: control
			}
		}));
	};

	handleSelect = async (name: string, value: OptionType) => {
		const {AGGREGATION, ATTRIBUTE, SOURCE} = TYPES;
		const {controls} = this.state;
		const currentControl = controls[name];
		const {type: currentType, value: currentValue} = currentControl;
		const isSourceValue = this.isSource(value);
		const nextControl = currentControl.next && controls[currentControl.next];
		const haveSourceRefType = currentType === AGGREGATION || currentType === ATTRIBUTE;
		let valueMustDeleted = false;

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
		const {onSubmit} = this.props;
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
					const attr = next ? controls[next] : null;
					const aggregationControl = attr && attr.next ? controls[attr.next] : null;
					const aggregationValue = aggregationControl && aggregationControl.value;

					computeData[name] = {
						aggregation: aggregationValue && aggregationValue.value,
						classFqn: value.value,
						attr: attr && attr.value
					};
				}

				stringForCompute = type === SOURCE ? `${stringForCompute}{${name}}` : `${stringForCompute}${value.value}`;
				title = title ? `${title} ${value.label}` : value.label;
			}
		}

		onSubmit({
			code: uuid(),
			computeData,
			stringForCompute,
			title,
			type: COMPUTED_ATTR
		});
	};

	getOptions = (control: ControlType) => {
		const {AGGREGATION, ATTRIBUTE} = TYPES;
		const {attributes} = this.props;
		const {sources, constants, controls} = this.state;
		const {prev, type} = control;
		const prevValue = prev && controls[prev].value;

		if (type === AGGREGATION) {
			return getAggregateOptions(prevValue);
		}

		if (type === ATTRIBUTE && this.isSource(prevValue)) {
			return prevValue ? attributes[prevValue.value].data : [];
		}

		return [...operators, ...constants, ...sources];
	};

	renderControl = (control: ControlType) => {
		const options = this.getOptions(control);

		return (
			<Control key={control.name} attr={control.type === TYPES.ATTRIBUTE}
				data={control}
				handleSelect={this.handleSelect}
				options={options}
				onCreateConstant={this.handleCreateConstant}
			/>
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
			<Modal header="Создать вычислимое поле" onSubmit={this.onSubmit} onClose={onClose}>
				<div className={styles.container}>
					{this.renderControls()}
				</div>
			</Modal>
		);
	}
}

export default withForm(ComputeAttrCreator);
