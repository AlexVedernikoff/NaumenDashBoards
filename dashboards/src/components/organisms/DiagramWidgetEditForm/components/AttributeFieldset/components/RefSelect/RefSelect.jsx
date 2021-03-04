// @flow
import AttributeSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect';
import {createRefKey} from 'src/store/sources/refAttributes/actions';
import Icon, {ICON_NAMES} from 'src/components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RefSelect extends PureComponent<Props, State> {
	components = null;

	fetchAttributes = () => {
		const {fetchRefAttributes, parent} = this.props;

		parent && fetchRefAttributes(parent);
	};

	getComponents = () => {
		const {Field, ...components} = this.props.components;

		if (!this.components) {
			this.components = {
				Field: this.renderField,
				Value: this.renderValue,
				...components
			};
		}

		return this.components;
	};

	getOptionsData = () => {
		const {dataSetIndex, getOptions, parent, refAttributes} = this.props;
		const {[createRefKey(parent)]: data = {}} = refAttributes;
		let {
			options = [],
			loading = false
		} = data;

		if (getOptions) {
			options = getOptions(options, dataSetIndex, true);
		}

		return {
			loading,
			options
		};
	};

	renderField = () => {
		const {components, value} = this.props;

		return value ? <components.Field /> : null;
	};

	renderValue = (props: ValueProps) => {
		const {className, label, onClick} = props;

		return (
			<div className={styles.value} onClick={onClick}>
				<Icon className={styles.linkIcon} height={18} name={ICON_NAMES.LINK} viewBox="0 0 12 18" width={12} />
				<div className={className}>{label}</div>
			</div>
		);
	};

	render () {
		const {name, onChangeLabel, onDrop, onRemove, onSelect, value} = this.props;
		const {loading, options} = this.getOptionsData();
		const components = this.getComponents();

		return (
			<AttributeSelect
				components={components}
				droppable={true}
				fetchOptions={this.fetchAttributes}
				loading={loading}
				name={name}
				onChangeLabel={onChangeLabel}
				onDrop={onDrop}
				onRemove={onRemove}
				onSelect={onSelect}
				options={options}
				value={value}
			/>
		);
	}
}

export default RefSelect;
