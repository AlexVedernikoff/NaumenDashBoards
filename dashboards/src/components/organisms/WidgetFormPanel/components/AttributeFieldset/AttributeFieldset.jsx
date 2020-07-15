// @flow
import type {Attribute, Props} from './types';
import {AttributeSelect} from 'WidgetFormPanel/components';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props as SelectProps} from 'WidgetFormPanel/components/AttributeSelect/types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import withForm from 'WidgetFormPanel/withForm';

export class AttributeFieldset extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		index: 0,
		removable: false,
		showCreationButton: false
	};

	fetchAttributes = (classFqn: string) => () => this.props.fetchAttributes(classFqn);

	fetchRefAttributes = (parent: Attribute) => () => this.props.fetchRefAttributes(parent);

	getAttributeOptions = (attributes: Array<Attribute>) => {
		const {getAttributeOptions, index} = this.props;
		return getAttributeOptions ? getAttributeOptions(attributes, index) : attributes;
	};

	getAttributeSelectProps = (parent: Attribute): $Shape<SelectProps> => {
		const {refAttributes} = this.props;
		const key = createRefKey(parent);
		const {[key]: data = this.getDefaultMapData()} = refAttributes;

		return {
			...data,
			fetchOptions: this.fetchRefAttributes(parent),
			options: this.getAttributeOptions(data.options)
		};
	};

	getDefaultMapData = () => ({
		error: false,
		loading: false,
		options: [],
		uploaded: false
	});

	getOptionLabel = (attribute: Attribute | null) => attribute ? attribute.title : '';

	getOptionValue = (attribute: Attribute | null) => attribute ? attribute.code : '';

	getSourceOptions = (attributes: Array<Attribute>) => {
		const {getSourceOptions, index} = this.props;
		return getSourceOptions ? getSourceOptions(attributes, index) : attributes;
	};

	getSourceSelectProps = () => {
		const {attributes, source} = this.props;
		let data = {
			fetchOptions: source && this.fetchAttributes(source.value)
		};

		if (source) {
			const {[source.value]: sourceData = this.getDefaultMapData()} = attributes;

			if (sourceData) {
				data = {
					...sourceData,
					...data,
					options: this.getSourceOptions(sourceData.options)
				};
			}
		}

		return data;
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
				parent,
				value
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
		const {parent} = props;

		if (parent) {
			return this.renderAttributeField({
				...props,
				...this.getAttributeSelectProps(parent),
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

		return <AttributeSelect className={styles.select} note={note} {...props} />;
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
			...this.getSourceSelectProps(),
			async: true,
			disabled,
			getOptionLabel: this.getOptionLabel,
			getOptionValue: this.getOptionValue,
			name,
			onChangeLabel: this.handleChangeLabel,
			onClickCreationButton,
			onRemove,
			onSelect: this.handleSelect,
			removable,
			showCreationButton,
			value
		});
	}
}

export default withForm(AttributeFieldset);
