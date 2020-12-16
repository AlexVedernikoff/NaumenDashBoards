// @flow
import {Checkbox, TextArea} from 'components/atoms';
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormCheckControl, MultiDropDownList, Select, ToggableFormBox} from 'components/molecules';
import {FormField} from 'DiagramWidgetEditForm/components';
import type {MenuProps} from 'components/molecules/Select/types';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

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

	handleToggleShow = (event: OnChangeInputEvent) => {
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
		const {error, items, loading, uploaded} = dashboards;
		const components = {
			Menu: this.renderSelectMenu
		};
		const value = widget || dashboard;

		return (
			<FormField>
				<Select
					async={true}
					components={components}
					error={error}
					fetchOptions={fetchDashboards}
					loading={loading}
					onSelect={this.handleSelect}
					options={items}
					placeholder="Укажите дашборд или виджет"
					uploaded={uploaded}
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