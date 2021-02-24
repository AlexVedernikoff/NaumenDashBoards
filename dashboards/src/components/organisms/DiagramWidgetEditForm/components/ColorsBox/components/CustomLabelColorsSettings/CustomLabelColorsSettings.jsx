// @flow
import type {ChartColorSettings} from 'store/widgets/data/types';
import ColorField from 'DiagramWidgetEditForm/components/ColorsBox/components/ColorField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import type {Props as LabelProps} from 'components/atoms/Label/types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class CustomLabelColorsSettings extends PureComponent<Props, State> {
	static defaultProps = {
		labels: []
	};

	state = {
		options: []
	};

	componentDidMount () {
		this.setOptionsByUsedLabels();
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.value.colors !== this.props.value.colors) {
			this.setOptionsByUsedLabels();
		}
	}

	handleChangeColor = ({name, value: color}: OnChangeEvent<string>) => {
		const {onChange, value} = this.props;
		const index = Number(name);

		onChange({
			...value,
			colors: value.colors.map((colorSettings, i) => i === index ? {...colorSettings, color} : colorSettings)
		});
	};

	handleChangeDefaultColor = ({value: newColor}: OnChangeEvent<string>) => {
		const {onChange, value} = this.props;

		onChange({
			...value,
			defaultColor: newColor
		});
	};

	handleClickAddButton = () => {
		const {onChange, value} = this.props;
		const {options} = this.state;
		const {colors, defaultColor} = value;

		onChange({
			...value,
			colors: [...colors, {
				color: defaultColor,
				text: options[0]
			}]
		});
	};

	handleRemoveColor = (name: string) => {
		const {onChange, value} = this.props;
		const index = Number(name);

		onChange({
			...value,
			colors: value.colors.filter((color, i) => i !== index)
		});
	};

	handleSelectLabel = ({name, value: text}: OnSelectEvent) => {
		const {onChange, value} = this.props;
		const index = Number(name);

		onChange({
			...value,
			colors: value.colors.map((colorSettings, i) => i === index ? {...colorSettings, text} : colorSettings)
		});
	};

	setOptionsByUsedLabels = () => {
		const {labels, value} = this.props;
		const usedIndexes = [];
		const options = labels.filter((label) => {
			const foundIndex = value.colors.findIndex((colorSettings, index) => {
				return colorSettings.text === label && !usedIndexes.includes(index);
			});
			const founded = foundIndex !== -1;

			founded && usedIndexes.push(foundIndex);

			return !founded;
		});

		this.setState({options});
	};

	renderAddButton = () => {
		const {options} = this.state;

		if (options.length > 0) {
			return (
				<button className={styles.addButton} onClick={this.handleClickAddButton}>
					<Icon className={styles.addButtonIcon} name={ICON_NAMES.PLUS} />
					<span className={styles.addButtonLabel}>Добавить</span>
				</button>
			);
		}

		return null;
	};

	renderDefaultColorField = () => {
		const {defaultColor} = this.props.value;
		return <ColorField label="Все параметры" onChange={this.handleChangeDefaultColor} value={defaultColor} />;
	};

	renderField = (colorSettings: ChartColorSettings, index: number) => {
		const {color, text} = colorSettings;
		const key = `${text}-${index}`;
		const components = {
			Label: this.renderLabel
		};

		return (
			<ColorField
				components={components}
				key={key}
				label={text}
				name={index.toString()}
				onChange={this.handleChangeColor}
				onRemove={this.handleRemoveColor}
				removable={true}
				value={color}
			/>
		);
	};

	renderLabel = (props: LabelProps) => {
		const {options} = this.state;
		const {children: value, className, name} = props;

		return (
			<Select
				className={className}
				name={name}
				onSelect={this.handleSelectLabel}
				options={options}
				value={value}
			/>
		);
	};

	renderLabelColors = () => this.props.value.colors.map(this.renderField);

	render () {
		return (
			<Fragment>
				{this.renderDefaultColorField()}
				{this.renderLabelColors()}
				{this.renderAddButton()}
			</Fragment>
		);
	}
}

export default CustomLabelColorsSettings;
