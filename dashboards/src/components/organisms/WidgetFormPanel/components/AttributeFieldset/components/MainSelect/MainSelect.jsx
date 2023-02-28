// @flow
import AttributeSelect from 'WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect';
import cn from 'classnames';
import type {DynamicAttributesMode} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withShowDynamicAttributes/types';
import Label from 'components/atoms/Label';
import MainSelectList from 'containers/AttributeMainSelectList';
import memoize from 'memoize-one';
import type {Props as ValueProps} from 'components/molecules/Select/components/Value/types';
import type {Props, State} from './types';
import React, {Component} from 'react';
import {SHOW_DYNAMIC_ATTRIBUTES_CONTEXT} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withShowDynamicAttributes';
import styles from './styles.less';
import withParentClassFqn from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withParentClassFqn';

export class MainSelect extends Component<Props, State> {
	state = {
		dynamicAttributesMode: 'hide'
	};

	getComponents = memoize(components => {
		const {Field, ...rest} = components;

		return {
			Field: this.renderField,
			List: this.renderList,
			Value: this.renderValue,
			...rest
		};
	});

	componentDidUpdate (prevProps: Props) {
		const {attributes, source} = this.props;

		if (source?.value !== prevProps.source?.value && source?.value && !attributes[source.value]) {
			this.fetchAttributes();
		}
	}

	fetchAttributes = () => {
		const {attrSetConditions, fetchAttributes, parentClassFqn, source} = this.props;
		const classFqn = source?.value;

		classFqn && fetchAttributes(classFqn, parentClassFqn, attrSetConditions);
	};

	getOptionsData = () => {
		const {attributes, source} = this.props;
		let options = [];
		let loading = false;

		if (source) {
			const {[source.value]: data = {}} = attributes;

			({options = [], loading = false} = data);
		}

		return {
			loading,
			options
		};
	};

	handleSetDynamicAttributesMode = (dynamicAttributesMode: DynamicAttributesMode) =>
		this.setState({dynamicAttributesMode});

	renderField = () => {
		const {components, value} = this.props;

		if (!value?.ref) {
			return <components.Field />;
		}

		return null;
	};

	renderList = props => (
		<MainSelectList
			{...props}
			setDynamicAttributesMode={this.handleSetDynamicAttributesMode}
		/>
	);

	renderValue = (props: ValueProps) => {
		const {className, label, onClick} = props;

		return (
			<div className={styles.value} onClick={onClick}>
				{this.renderValueNote()}
				<div className={cn(className, styles.label)}>{label}</div>
			</div>
		);
	};

	renderValueNote = () => {
		const {source, value} = this.props;

		if (source && value) {
			const note = source.label;

			return <Label>{note}</Label>;
		}

		return null;
	};

	render () {
		const {
			components,
			getOptions,
			name,
			onChangeLabel,
			onRemove,
			onSelect,
			removable,
			value
		} = this.props;
		const {dynamicAttributesMode} = this.state;
		const {loading, options} = this.getOptionsData();

		return (
			<SHOW_DYNAMIC_ATTRIBUTES_CONTEXT.Provider value={{dynamicAttributesMode}}>
				<AttributeSelect
					components={this.getComponents(components)}
					fetchOptions={this.fetchAttributes}
					getOptions={getOptions}
					loading={loading}
					name={name}
					onChangeLabel={onChangeLabel}
					onRemove={onRemove}
					onSelect={onSelect}
					options={options}
					removable={removable}
					value={value}
				/>
			</SHOW_DYNAMIC_ATTRIBUTES_CONTEXT.Provider>
		);
	}
}

export default withParentClassFqn(MainSelect);
