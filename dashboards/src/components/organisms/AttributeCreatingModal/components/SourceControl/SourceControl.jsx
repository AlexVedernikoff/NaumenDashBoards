// @flow
import type {Attribute} from 'src/store/sources/attributes/types';
import AttributeAggregationField from 'WidgetFormPanel/components/AttributeAggregationField';
import cn from 'classnames';
import Container from 'src/components/atoms/Container';
import type {ContainerProps} from 'src/components/molecules/TreeSelect/types';
import {CONTROL_TYPES} from 'components/organisms/AttributeCreatingModal/constants';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import type {Node} from 'components/molecules/TreeSelect/types';
import type {OnSelectEvent} from 'components/types';
import type {Props, Value} from './types';
import React, {createContext, Fragment, PureComponent} from 'react';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import SourceControlTree from 'components/organisms/AttributeCreatingModal/components/SoucreControlTree';
import styles from './styles.less';
import TreeSelect from 'components/molecules/TreeSelect';

const AGGREGATION_CONTEXT = createContext();

export class SourceControl extends PureComponent<Props> {
	getComponents = memoize(() => ({
		MenuContainer: this.renderMenuContainer,
		Tree: this.renderTree,
		ValueContainer: this.renderValueContainer
	}));

	getNodeLabel = ({parent, value}: Node): string => parent ? this.getOptionLabel(value) : value.label;

	getNodeValue = ({id, parent, value}: Node): string => parent ? this.getOptionValue(value) : id;

	getOptionLabel = (option: Attribute | null): string => option?.title ?? '';

	getOptionValue = (option: Attribute | null): string => option?.code ?? '';

	handleAddConstant = () => {
		const {index, name, onAddConstant} = this.props;

		onAddConstant(index, name);
	};

	handleSelect = ({value: node}: OnSelectEvent) => {
		const {index, name, onSelect, options} = this.props;
		const {parent: dataKey, value: attribute} = node;
		const {value: source} = options[dataKey];

		if (source) {
			const aggregation = getDefaultAggregation(attribute);

			const value = {
				aggregation,
				attribute,
				dataKey,
				source
			};

			onSelect(index, name, value, CONTROL_TYPES.SOURCE);
		}
	};

	handleSelectAggregation = (name: string, aggregation: string) => {
		const {index, onSelect, value} = this.props;

		value && onSelect(index, name, {...value, aggregation}, CONTROL_TYPES.SOURCE);
	};

	isDisabled = (node: Node): boolean => !node.parent;

	isSelected = (node: Node): boolean => {
		const {value} = this.props;
		const {parent, value: nodeValue} = node;

		return value?.dataKey === parent && value?.attribute.code === nodeValue.code;
	};

	renderAggregationField = (attribute: Attribute) => (
		<AGGREGATION_CONTEXT.Consumer>
			{value => (
				<AttributeAggregationField
					attribute={attribute}
					onSelect={this.handleSelectAggregation}
					renderValue={this.renderAggregationValue}
					tip="Агрегация"
					value={value}
				/>
			)}
		</AGGREGATION_CONTEXT.Consumer>
	);

	renderAggregationValue = (valueProps: RenderValueProps) => {
		const {active, children, className, onClick} = valueProps;
		const CN = cn({
			[className]: true,
			[styles.attributeField]: true,
			[styles.activeAttributeField]: active
		});

		return (
			<div className={CN} onClick={onClick}>
				{children}
			</div>
		);
	};

	renderMenuContainer = (props: ContainerProps) => {
		const {children, className} = props;
		const CN = cn(className, styles.menuContainer);

		return <Container {...props} className={CN} >{children}</Container>;
	};

	renderPlaceholder = (props: ContainerProps) => (
		<div className={styles.placeholder} onClick={props.onClick}>
			<Icon name={ICON_NAMES.ELLIPSIS} />
		</div>
	);

	renderTree = (props) => (
		<SourceControlTree{...props} onAddConstant={this.handleAddConstant} originalOptions={this.props.options} />
	);

	renderValue = (props: ContainerProps, value: Value) => {
		const {attribute, source} = value;

		return (
			<Fragment>
				{this.renderAggregationField(attribute)}
				<div className={styles.labelContainer} onClick={props.onClick}>
					<div className={styles.sourceLabel}>{source.label}</div>
					<div className={styles.attributeLabel}>{attribute.title}</div>
				</div>
			</Fragment>
		);
	};

	renderValueContainer = (props: ContainerProps) => {
		const {value} = this.props;

		return (
			<div className={styles.valueContainer}>
				{value ? this.renderValue(props, value) : this.renderPlaceholder(props)}
			</div>
		);
	};

	render () {
		const {onFetch, options, value} = this.props;

		return (
			<AGGREGATION_CONTEXT.Provider value={value?.aggregation}>
				<TreeSelect
					className={styles.control}
					components={this.getComponents()}
					getNodeLabel={this.getNodeLabel}
					getNodeValue={this.getNodeValue}
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					isDisabled={this.isDisabled}
					isSelected={this.isSelected}
					onFetch={onFetch}
					onSelect={this.handleSelect}
					options={options}
					value={value?.attribute}
				/>
			</AGGREGATION_CONTEXT.Provider>
		);
	}
}

export default SourceControl;
