// @flow
import AttributeSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect';
import cn from 'classnames';
import Label from 'components/atoms/Label';
import List from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/components/MainSelectList';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MainSelect extends PureComponent<Props> {
	components = null;

	fetchAttributes = () => {
		const {fetchAttributes, parentSource, source} = this.props;
		const classFqn = source?.value;

		classFqn && fetchAttributes(classFqn, parentSource);
	};

	getComponents = () => {
		const {Field, ...components} = this.props.components;

		if (!this.components) {
			this.components = {
				Field: this.renderField,
				List,
				Value: this.renderValue,
				...components
			};
		}

		return this.components;
	};

	getOptionsData = () => {
		const {attributes, dataSetIndex, getOptions, source} = this.props;
		let options = [];
		let loading = false;

		if (source) {
			const {[source.value]: data = {}} = attributes;

			({options = [], loading = false} = data);

			if (getOptions) {
				options = getOptions(options, dataSetIndex);
			}
		}

		return {
			loading,
			options
		};
	};

	renderField = () => {
		const {components, value} = this.props;

		return !value?.ref ? <components.Field /> : null;
	};

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
		const {name, onSelect, value} = this.props;
		const {loading, options} = this.getOptionsData();
		const components = this.getComponents();

		return (
			<AttributeSelect
				components={components}
				fetchOptions={this.fetchAttributes}
				loading={loading}
				name={name}
				onSelect={onSelect}
				options={options}
				value={value}
			/>
		);
	}
}

export default MainSelect;
