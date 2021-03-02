// @flow
import Checkbox from 'components/atoms/Checkbox';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'DiagramWidgetEditForm/components/FormField';
import type {MenuProps} from 'components/molecules/Select/types';
import MultiDropDownList from 'components/molecules/MultiDropDownList';
import type {OnChangeEvent, OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import TextArea from 'components/atoms/TextArea';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class NavigationBox extends PureComponent<Props> {
	handleChangeTip = (event: OnChangeInputEvent) => {
		const {onChange, settings} = this.props;
		const {name, value} = event;

		onChange(FIELDS.navigation, {
			...settings,
			[name]: value
		});
	};

	handleSelect = ({value: selectValue}: OnSelectEvent) => {
		const {onChange, settings} = this.props;
		const {parent, ...value} = selectValue;
		let dashboard = value;
		let widget = null;

		if (parent) {
			dashboard = parent;
			widget = value;
		}

		onChange(FIELDS.navigation, {
			...settings,
			dashboard,
			widget
		});
	};

	handleToggleShow = (event: OnChangeEvent<boolean>) => {
		const {onChange, settings} = this.props;
		const {name, value} = event;

		onChange(FIELDS.navigation, {
			...settings,
			[name]: !value
		});
	};

	renderSelect = () => {
		const {dashboards, fetchDashboards, settings} = this.props;
		const {dashboard, widget} = settings;
		const {items, loading} = dashboards;
		const components = {
			Menu: this.renderSelectMenu
		};
		const value = widget || dashboard;

		return (
			<FormField>
				<Select
					components={components}
					fetchOptions={fetchDashboards}
					loading={loading}
					onSelect={this.handleSelect}
					options={items}
					placeholder="Укажите дашборд или виджет"
					value={value}
				/>
			</FormField>
		);
	};

	renderSelectMenu = (props: MenuProps) => {
		const {className, loading, onSelect, options} = props;

		return (
			<MultiDropDownList
				className={className}
				isSelectedHeader={true}
				items={options}
				loading={loading}
				onSelect={onSelect}
			/>
		);
	};

	renderShowTipCheckbox = () => {
		const {showTip} = this.props.settings;

		return (
			<FormCheckControl className={styles.checkbox} label="Отображать всплывающую подсказку">
				<Checkbox checked={showTip} name="showTip" onChange={this.handleToggleShow} value={showTip} />
			</FormCheckControl>
		);
	};

	renderTipTextArea = () => {
		const {showTip, tip} = this.props.settings;

		if (showTip) {
			return (
				<FormField>
					<TextArea
						name={FIELDS.tip}
						onChange={this.handleChangeTip}
						value={tip}
					/>
				</FormField>
			);
		}
	};

	render () {
		const {settings} = this.props;
		const {show} = settings;

		return (
			<ToggableFormBox name={FIELDS.show} onToggle={this.handleToggleShow} showContent={show} title="Навигация с виджета">
				{this.renderSelect()}
				{this.renderShowTipCheckbox()}
				{this.renderTipTextArea()}
			</ToggableFormBox>
		);
	}
}

export default NavigationBox;
