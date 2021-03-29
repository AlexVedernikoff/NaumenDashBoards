// @flow
import AttributeSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect';
import cn from 'classnames';
import {createRefKey} from 'store/sources/refAttributes/actions';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import type {Props as ValueProps} from 'components/molecules/Select/components/Value/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class RefSelect extends PureComponent<Props> {
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
		const {parent, refAttributes} = this.props;
		let loading = false;
		let options = [];

		if (parent) {
			const {[createRefKey(parent)]: data = {
				loading,
				options
			}} = refAttributes;

			({loading, options} = data);
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
		const containerCN = cn(className, styles.value);

		return (
			<div className={containerCN} onClick={onClick}>
				<Icon className={styles.linkIcon} height={18} name={ICON_NAMES.LINK} viewBox="0 0 12 18" width={12} />
				<div className={styles.label}>{label}</div>
			</div>
		);
	};

	render () {
		const {getOptions, name, onChangeLabel, onDrop, onRemove, onSelect, value} = this.props;
		const {loading, options} = this.getOptionsData();
		const components = this.getComponents();

		return (
			<AttributeSelect
				components={components}
				droppable={true}
				fetchOptions={this.fetchAttributes}
				getOptions={getOptions}
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
