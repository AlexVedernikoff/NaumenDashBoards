// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import FormField from 'components/molecules/FormField';
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

	getDataOptions = () => {
		const {data} = this.props;
		const options = data.map(({dataKey: id, source}) => (
			{classFqn: source.value?.value ?? '', id, name: source.value?.label ?? ''}
		));

		return options;
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
			this.setState({value: {...value, dataKey1: id}});
		}
	};

	handleSelectData2 = ({value: {id}}) => {
		const {value} = this.state;

		if (value) {
			this.setState({value: {...value, dataKey2: id}});
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
			const {attribute, dataKey1, dataKey2} = value;
			const {attributes, fetchLinkedAttributes} = this.props;
			const {loading = false, options = []} = attributes ?? {};

			const fetchOptions = () => {
				const value1 = dataOptions.find(({id}) => id === dataKey1);
				const value2 = dataOptions.find(({id}) => id === dataKey2);

				if (value1 && value2) {
					fetchLinkedAttributes(value1.classFqn, value2.classFqn);
				}
			};

			return (
				<FormField label={t('PivotWidgetForm::SourceLinkEditor::LinkAttribute')}>
					<Select
						fetchOptions={fetchOptions}
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
