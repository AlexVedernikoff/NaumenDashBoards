// @flow
import type {Attribute, Props} from './types';
import {AttributeSelect} from 'WidgetFormPanel/components';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props as SelectProps} from 'WidgetFormPanel/components/AttributeSelect/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class AttributeFieldset extends Component<Props> {
	static defaultProps = {
		disabled: false,
		index: 0,
		removable: false,
		showCreationButton: false
	};

	getOptionLabel = (attribute: Attribute | null) => attribute ? attribute.title : '';

	getOptionValue = (attribute: Attribute | null) => attribute ? attribute.code : '';

	getSourceOptions = () => {
		const {getSourceOptions, index, source} = this.props;
		let options = [];

		if (source) {
			options = getSourceOptions(source.value, index);
		}

		return options;
	};

	handleChangeLabel = (event: OnChangeAttributeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel(event, index);
	};

	handleSelect = (event: OnSelectAttributeEvent) => {
		const {index, onSelect} = this.props;
		onSelect(event, index);
	};

	renderAttributeField = (props: Object) => {
		const {renderRefField} = this.props;
		const {disabled, parent, value} = props;

		if (!parent && value && value.type in ATTRIBUTE_SETS.REF) {
			return (
				<Fragment>
					{this.renderParentAttributeField(props)}
					{this.renderChildAttributeField({...props, parent: value})}
				</Fragment>
			);
		}

		const select = this.renderSelect(props);

		if (renderRefField) {
			const refProps = {
				disabled,
				value,
				parent
			};

			return (
				<div className={styles.combinedContainer}>
					<div className={styles.combinedRef}>
						{renderRefField(refProps)}
					</div>
					<div className={styles.combinedAttribute}>
						{select}
					</div>
				</div>
			);
		}

		return (
			<div className={styles.container}>
				{select}
			</div>
		);
	};

	renderChildAttributeField = (props: SelectProps) => {
		const {getAttributeOptions, index} = this.props;
		const {parent} = props;

		if (parent) {
			return this.renderAttributeField({
				...props,
				options: getAttributeOptions(parent, index),
				parent,
				value: parent.ref
			});
		}

		return null;
	};

	renderParentAttributeField = (props: SelectProps) => (
		<div className={styles.parentInput}>
			{this.renderSelect(props)}
		</div>
	);

	renderSelect = (props: SelectProps) => {
		const {source} = this.props;
		let note;

		if (source) {
			note = source.label;
		}

		return <AttributeSelect note={note} {...props} />;
	};

	render () {
		const {
			disabled,
			name,
			onClickCreationButton,
			onRemove,
			removable,
			showCreationButton,
			value
		} = this.props;

		return this.renderAttributeField({
			disabled,
			getOptionLabel: this.getOptionLabel,
			getOptionValue: this.getOptionValue,
			name,
			onChangeLabel: this.handleChangeLabel,
			onClickCreationButton,
			onRemove,
			onSelect: this.handleSelect,
			options: this.getSourceOptions(),
			removable,
			showCreationButton,
			value
		});
	}
}

export default AttributeFieldset;
