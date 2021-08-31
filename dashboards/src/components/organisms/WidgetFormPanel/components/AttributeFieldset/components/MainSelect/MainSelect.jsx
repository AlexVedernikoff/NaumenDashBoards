// @flow
import AttributeSelect from 'WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect';
import cn from 'classnames';
import Label from 'components/atoms/Label';
import List from 'containers/AttributeMainSelectList';
import memoize from 'memoize-one';
import type {Props} from './types';
import type {Props as ValueProps} from 'components/molecules/Select/components/Value/types';
import React, {Component} from 'react';
import styles from './styles.less';
import withParentClassFqn from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withParentClassFqn';

export class MainSelect extends Component<Props> {
	getComponents = memoize(components => {
		const {Field, ...rest} = components;

		return {
			Field: this.renderField,
			List,
			Value: this.renderValue,
			...rest
		};
	});

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
		const {components, getOptions, name, onChangeLabel, onRemove, onSelect, removable, value} = this.props;
		const {loading, options} = this.getOptionsData();

		return (
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
		);
	}
}

export default withParentClassFqn(MainSelect);
