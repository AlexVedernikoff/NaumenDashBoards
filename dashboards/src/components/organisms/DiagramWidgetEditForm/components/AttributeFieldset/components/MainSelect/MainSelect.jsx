// @flow
import AttributeSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect';
import cn from 'classnames';
import Label from 'components/atoms/Label';
import List from 'containers/DiagramWidgetEditForm/components/MainSelectList';
import type {Props} from './types';
import type {Props as ValueProps} from 'components/molecules/Select/components/Value/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import withGetComponents from 'components/HOCs/withGetComponents';
import withParentSource from 'DiagramWidgetEditForm/HOCs/withParentSource';

export class MainSelect extends PureComponent<Props> {
	fetchAttributes = () => {
		const {fetchAttributes, parentSource, source} = this.props;
		const classFqn = source?.value;

		classFqn && fetchAttributes(classFqn, parentSource);
	};

	getComponents = () => {
		const {components, getComponents} = this.props;
		const {Field, ...rest} = components;

		return getComponents({
			Field: this.renderField,
			List,
			Value: this.renderValue,
			...rest
		});
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
		const {getOptions, name, onChangeLabel, onRemove, onSelect, removable, value} = this.props;
		const {loading, options} = this.getOptionsData();

		return (
			<AttributeSelect
				components={this.getComponents()}
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

export default withParentSource(withGetComponents(MainSelect));
