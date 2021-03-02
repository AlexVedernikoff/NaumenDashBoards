// @flow
import Container from 'src/components/atoms/Container';
import {debounce} from 'src/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import LabelEditingForm from 'components/molecules/InputForm';
import type {Node} from 'components/molecules/MaterialTreeSelect/components/Tree/types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import SearchInput from 'src/components/atoms/SearchInput';
import styles from './styles.less';
import Tree from 'components/molecules/MaterialTreeSelect/components/Tree';

export class TreeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		initialSelected: [],
		name: '',
		placeholder: 'Выберите значение'
	};

	state = {
		searchValue: '',
		showForm: false,
		showMenu: false
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
		onChangeLabel({label, name});
	};

	handleChangeSearchInput = (searchValue: string) => this.setState({searchValue});

	handleClick = () => this.setState({showMenu: true});

	handleClickIndicators = (e: Event) => e.stopPropagation();

	handleRemoveValue = () => {
		const {name, onSelect} = this.props;

		onSelect({name, value: null});
	};

	handleSelect = (node: Node) => {
		const {name, onSelect} = this.props;

		this.setState({showMenu: false});
		onSelect({name, value: node.value});
	};

	handleToggleList = () => this.setState({showMenu: !this.state.showMenu});

	hideForm = () => this.setState({showForm: false});

	hideTree = () => this.setState({showMenu: false});

	showForm = () => this.setState({showForm: true});

	renderIndicators = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.indicators} onClick={this.handleClickIndicators}>
					<IconButton icon={ICON_NAMES.EDIT} onClick={this.showForm} />
					<IconButton icon={ICON_NAMES.REMOVE} onClick={this.handleRemoveValue} />
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

	renderList = () => {
		const {initialSelected, options, value} = this.props;
		const {searchValue} = this.state;

		return (
			<Tree
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				initialSelected={initialSelected}
				onSelect={this.handleSelect}
				options={options}
				searchValue={searchValue}
				value={value}
			/>
		);
	};

	renderMenu = () => {
		const {showMenu} = this.state;

		if (showMenu) {
			return (
				<Container className={styles.menu}>
					{this.renderSearchInput()}
					{this.renderList()}
				</Container>
			);
		}
	};

	renderPlaceholder = () => (
		<div className={styles.placeholder}>
			{this.props.placeholder}
		</div>
	);

	renderSearchInput = () => {
		const {searchValue} = this.state;

		return <SearchInput onChange={debounce(this.handleChangeSearchInput, 500)} value={searchValue} />;
	};

	renderSelect = () => (
		<OutsideClickDetector onClickOutside={this.hideTree}>
			<div className={styles.select}>
				{this.renderValueContainer()}
				{this.renderMenu()}
			</div>
		</OutsideClickDetector>
	);

	renderValue = () => (
		<div className={styles.value}>
			{this.renderLabel()}
			{this.renderIndicators()}
		</div>
	);

	renderValueContainer = () => {
		const {value} = this.props;
		const content = value ? this.renderValue() : this.renderPlaceholder();

		return <div className={styles.valueContainer} onClick={this.handleToggleList}>{content}</div>;
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
