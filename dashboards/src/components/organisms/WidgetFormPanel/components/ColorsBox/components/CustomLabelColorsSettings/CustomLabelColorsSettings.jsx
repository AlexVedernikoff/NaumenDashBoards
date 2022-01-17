// @flow
import type {ChartColorSettings} from 'store/widgets/data/types';
import ColorField from 'WidgetFormPanel/components/ColorsBox/components/ColorField';
import {getSeparatedLabel} from 'store/widgets/buildData/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {LabelProps} from 'WidgetFormPanel/components/ColorsBox/components/ColorField/types';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import {SEPARATOR} from 'store/widgets/buildData/constants';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

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
		const {labels: prevLabels, value: prevValue} = prevProps;
		const {labels, value} = this.props;

		if (prevLabels !== labels || prevValue.colors !== value.colors) {
			this.setOptionsByUsedLabels();
		}
	}

	getOptionLabel = (label: string) => getSeparatedLabel(label);

	getOptionValue = (label: string) => label.split(SEPARATOR)[1] ?? label;

	getSelectValue = (value: any) => {
		const {labels} = this.props;
		let selectValue = typeof value === 'string' ? value : '';

		if (selectValue.includes(SEPARATOR)) {
			selectValue = labels.find(label => this.getOptionValue(label) === this.getOptionValue(selectValue)) ?? selectValue;
		}

		return selectValue;
	};

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
				key: options[0]
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

	handleSelectLabel = ({name, value: key}: OnSelectEvent) => {
		const {onChange, value} = this.props;
		const index = Number(name);

		onChange({
			...value,
			colors: value.colors.map((colorSettings, i) => i === index ? {...colorSettings, key} : colorSettings)
		});
	};

	setOptionsByUsedLabels = () => {
		const {labels, value} = this.props;
		const usedIndexes = [];
		const options = labels.filter(label => {
			const foundIndex = value.colors.findIndex(
				(colorSettings, index) =>
					this.getOptionValue(colorSettings.key) === this.getOptionValue(label)
					&& !usedIndexes.includes(index)
			);
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
					<span className={styles.addButtonLabel}><T text='CustomLabelColorsSettings::Add' /></span>
				</button>
			);
		}

		return null;
	};

	renderDefaultColorField = () => {
		const {defaultColor} = this.props.value;

		return (
			<ColorField
				label={t('CustomLabelColorsSettings::AllParameters')}
				onChange={this.handleChangeDefaultColor}
				value={defaultColor}
			/>
		);
	};

	renderField = (colorSettings: ChartColorSettings, index: number) => {
		const {color, key: colorKey} = colorSettings;
		const key = `${colorKey}-${index}`;
		const components = {
			Label: this.renderLabel
		};

		return (
			<ColorField
				components={components}
				key={key}
				label={colorKey}
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
		const {children, className, name} = props;
		const disabled = options.length === 0;

		return (
			<Select
				className={className}
				disabled={disabled}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				name={name}
				onSelect={this.handleSelectLabel}
				options={options}
				value={this.getSelectValue(children)}
			/>
		);
	};

	renderLabelColors = (): Array<React$Node> => this.props.value.colors.map(this.renderField);

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
