// @flow
import {CrossIcon, EditIcon} from 'icons/form';
import {IconButton, OutsideClickDetector} from 'components/atoms';
import {InputForm as LabelEditingForm} from 'components/molecules';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import type {Source as SourceValue} from 'store/widgets/data/types';
import styles from './styles.less';
import {Tree} from 'components/molecules/MaterialTreeSelect/components';

export class TreeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		placeholder: 'Выберите значение'
	};

	state = {
		showForm: false,
		showList: false
	};

	getOptionLabel = (option: Object) => {
		const {getOptionLabel} = this.props;
		let label = '';

		if (option) {
			label = getOptionLabel ? getOptionLabel(option) : option.label;
		}

		return label;
	};

	getOptionValue = (option: Object) => {
		const {getOptionValue} = this.props;
		let value = '';

		if (option) {
			value = getOptionValue ? getOptionValue(option) : option.value;
		}

		return value;
	};

	handleChangeLabel = (label: string) => {
		const {name, onChangeLabel} = this.props;

		this.hideForm();
		onChangeLabel({name, label});
	};

	handleClick = () => this.setState({showList: true});

	handleClickIndicators = (e: Event) => e.stopPropagation();

	handleClickRemoveButton = () => {
		const {name, onRemove} = this.props;
		onRemove({name});
	};

	handleRemoveValue = () => {
		const {name, onSelect} = this.props;
		onSelect({name, value: null});
	};

	handleSelect = (value: SourceValue) => {
		const {name, onSelect} = this.props;

		this.setState({showList: false});
		onSelect({name, value});
	};

	handleShowList = () => this.setState({showList: !this.state.showList});

	hideForm = () => this.setState({showForm: false});

	hideTree = () => this.setState({showList: false});

	showForm = () => this.setState({showForm: true});

	renderIndicators = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.indicators} onClick={this.handleClickIndicators}>
					<IconButton onClick={this.showForm}>
						<EditIcon />
					</IconButton>
					<IconButton onClick={this.handleRemoveValue}>
						<CrossIcon />
					</IconButton>
				</div>
			);
		}
	};

	renderLabel = () => {
		const label = this.getOptionLabel(this.props.value);
		return <div className={styles.label} title={label}>{label}</div>;
	};

	renderLabelEditingForm = () => {
		const {value} = this.props;
		const {showForm} = this.state;

		if (showForm) {
			const label = this.getOptionLabel(value);

			return (
				<LabelEditingForm
					onClose={this.hideForm}
					onSubmit={this.handleChangeLabel}
					value={label}
				/>
			);
		}
	};

	renderPlaceholder = () => (
		<div className={styles.placeholder}>
			{this.props.placeholder}
		</div>
	);

	renderSelect = () => (
		<OutsideClickDetector onClickOutside={this.hideTree}>
			<div className={styles.select}>
				{this.renderValueContainer()}
				{this.renderTree()}
			</div>
		</OutsideClickDetector>
	);

	renderTree = () => {
		const {options, value} = this.props;
		const {showList} = this.state;

		return (
			<Tree
				className={styles.list}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				onSelect={this.handleSelect}
				options={options}
				show={showList}
				value={value}
			/>
		);
	};

	renderValue = () => (
		<div className={styles.value}>
			{this.renderLabel()}
			{this.renderIndicators()}
		</div>
	);

	renderValueContainer = () => {
		const {value} = this.props;
		const content = value ? this.renderValue() : this.renderPlaceholder();

		return <div className={styles.valueContainer} onClick={this.handleShowList}>{content}</div>;
	};

	render () {
		const content = this.state.showForm ? this.renderLabelEditingForm() : this.renderSelect();

		return (
			<div className={styles.container}>
				{content}
			</div>
		);
	}
}

export default TreeSelect;
