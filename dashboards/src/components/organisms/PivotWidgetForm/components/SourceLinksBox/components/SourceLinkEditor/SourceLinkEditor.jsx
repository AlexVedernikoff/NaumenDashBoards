// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import FormField from 'components/molecules/FormField';
import {getLinkedAttributesKey} from 'store/sources/linkedAttributes/helpers';
import type {MapData as LinkedAttributesMapData} from 'store/sources/linkedAttributes/types';
import type {OnSelectEvent} from 'components/types';
import type {Props} from 'containers/SourceLinkEditor/types';
import React, {Component} from 'react';
import Select from 'components/molecules/Select';
import type {State} from './types';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import {VARIANTS as BUTTON_VARIANTS} from 'src/components/atoms/Button/constants';

export class SourceLinkEditor extends Component<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		value: null
	};

	componentDidMount () {
		this.setState({value: this.props.value});
	}

	componentDidUpdate (prevProps) {
		if (prevProps.value !== this.props.value) {
			this.setState({value: this.props.value});
		}
	}

	fetchLinkedOptions = () => {
		const {data, fetchLinkedAttributes} = this.props;
		const {value} = this.state;

		if (data && value) {
			const {dataKey1, dataKey2} = value;
			const source1 = data.find(({dataKey}) => dataKey === dataKey1);
			const source2 = data.find(({dataKey}) => dataKey === dataKey2);

			if (source1 && source2) {
				const value1 = source1.source?.value?.value;
				const value2 = source2.source?.value?.value;

				if (value1 && value2) {
					fetchLinkedAttributes(value1, value2);
				}
			}
		}
	};

	getDataOptions = () => {
		const {data} = this.props;
		const options = data.map(({dataKey: id, source}) => (
			{classFqn: source.value?.value ?? '', id, name: source.value?.label ?? ''}
		));

		return options;
	};

	getLinkedAttributes = (): $Shape<LinkedAttributesMapData> => {
		let result = {loading: false, options: []};
		const {data, linkedAttributes} = this.props;
		const {value} = this.state;

		if (value && linkedAttributes) {
			const {dataKey1, dataKey2} = value;
			const classFqn1 = data.find(({dataKey}) => dataKey === dataKey1)?.source?.value?.value ?? '';
			const classFqn2 = data.find(({dataKey}) => dataKey === dataKey2)?.source?.value?.value ?? '';
			const key = getLinkedAttributesKey(classFqn1, classFqn2);

			if (linkedAttributes[key]) {
				result = linkedAttributes[key];
			}
		}

		return result;
	};

	handleCancel = () => this.props.onCancel();

	handleSave = () => {
		const {onChange} = this.props;
		const {value} = this.state;

		if (value) {
			onChange(value);
		}
	};

	handleSelectAttribute = ({value: attribute}: OnSelectEvent) => {
		const {value} = this.state;

		if (value) {
			this.setState({value: {...value, attribute}});
		}
	};

	handleSelectData1 = ({value: {id}}) => {
		const {value} = this.state;

		if (value) {
			this.setState({value: {...value, attribute: null, dataKey1: id}});
		}
	};

	handleSelectData2 = ({value: {id}}) => {
		const {value} = this.state;

		if (value) {
			this.setState({value: {...value, attribute: null, dataKey2: id}});
		}
	};

	renderEditPlace = () => {
		const dataOptions = this.getDataOptions();

		return (
			<div className={styles.editPlace}>
				{this.renderSourcePrimary(dataOptions)}
				{this.renderSourceSecondary(dataOptions)}
				{this.renderLinkedAttribute(dataOptions)}
			</div>
		);
	};

	renderFooter = () => (
		<div className={styles.footer}>
			<Button onClick={this.handleSave} variant={BUTTON_VARIANTS.INFO}>
				<T text="PivotWidgetForm::SourceLinkEditor::Save" />
			</Button>
			<Button onClick={this.handleCancel} variant={BUTTON_VARIANTS.SIMPLE}>
				<T text="PivotWidgetForm::SourceLinkEditor::Cancel" />
			</Button>
		</div>
	);

	renderHeader = () => (
		<div className={styles.header}>
			<T text="PivotWidgetForm::SourceLinkEditor::SelectSources" />
		</div>
	);

	renderLinkedAttribute = dataOptions => {
		const {value} = this.state;

		if (value) {
			const {attribute} = value;
			const {loading = false, options = []} = this.getLinkedAttributes();

			return (
				<FormField label={t('PivotWidgetForm::SourceLinkEditor::LinkAttribute')}>
					<Select
						fetchOptions={this.fetchLinkedOptions}
						getOptionLabel={option => option.title}
						getOptionValue={option => option.code}
						loading={loading}
						onSelect={this.handleSelectAttribute}
						options={options}
						placeholder={t('PivotWidgetForm::SourceLinkAttributeEmpty')}
						value={attribute}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderSourcePrimary = dataOptions => {
		const {value} = this.state;
		const value1 = dataOptions.find(({id}) => id === value?.dataKey1);

		return (
			<FormField label={t('PivotWidgetForm::SourceLinkEditor::Source1')}>
				<Select
					getOptionLabel={({name}) => name}
					getOptionValue={({id}) => id}
					onSelect={this.handleSelectData1}
					options={dataOptions}
					value={value1}
				/>
			</FormField>
		);
	};

	renderSourceSecondary = dataOptions => {
		const {value} = this.state;
		const value2 = dataOptions.find(({id}) => id === value?.dataKey2);

		return (
			<FormField label={t('PivotWidgetForm::SourceLinkEditor::Source2')}>
				<Select
					getOptionLabel={({name}) => name}
					getOptionValue={({id}) => id}
					onSelect={this.handleSelectData2}
					options={dataOptions}
					value={value2}
				/>
			</FormField>
		);
	};

	render () {
		const {className} = this.props;
		const {value} = this.state;
		const containerClassName = cn(className, styles.container);

		if (value) {
			return (
				<div className={containerClassName}>
					{this.renderHeader()}
					{this.renderEditPlace()}
					{this.renderFooter()}
				</div>
			);
		}

		return null;
	}
}

export default SourceLinkEditor;
