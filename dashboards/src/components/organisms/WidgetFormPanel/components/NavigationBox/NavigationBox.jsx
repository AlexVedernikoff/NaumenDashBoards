// @flow
import Checkbox from 'components/atoms/Checkbox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import MultiDropDownList from 'components/molecules/MultiDropDownList';
import type {OnChangeEvent, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import TextArea from 'components/atoms/TextArea';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import {USER_ROLES} from 'store/context/constants';
import type {Value} from 'components/molecules/MultiDropDownList/types';

export class NavigationBox extends PureComponent<Props> {
	handleChangeTip = (event: OnChangeInputEvent) => {
		const {name, onChange, value} = this.props;
		const {name: tipName, value: tip} = event;

		onChange(name, {
			...value,
			[tipName]: tip
		});
	};

	handleSelect = (selectValue: Value) => {
		const {name, onChange, value: settings} = this.props;
		const {parent, ...value} = selectValue;

		onChange(name, {
			...settings,
			dashboard: parent || value,
			widget: parent ? value : null
		});
	};

	handleToggleShow = (event: OnChangeEvent<boolean>) => {
		const {name, onChange, value} = this.props;
		const {name: key, value: show} = event;

		onChange(name, {
			...value,
			[key]: !show
		});
	};

	renderMenuContainer = (props: ContainerProps) => {
		const {className} = props;
		const {dashboards} = this.props;
		const {items, loading} = dashboards;

		return (
			<MultiDropDownList
				className={className}
				isSelectedHeader={true}
				items={items}
				loading={loading}
				onSelect={this.handleSelect}
			/>
		);
	};

	renderSelect = () => {
		const {dashboards, fetchDashboards, value} = this.props;
		const {dashboard, widget} = value;
		const {items, loading} = dashboards;
		const components = {
			MenuContainer: this.renderMenuContainer
		};
		const selectValue = widget || dashboard;

		return (
			<FormField>
				<Select
					components={components}
					fetchOptions={fetchDashboards}
					loading={loading}
					onSelect={this.handleSelect}
					options={items}
					placeholder="Укажите дашборд или виджет"
					value={selectValue}
				/>
			</FormField>
		);
	};

	renderShowTipCheckbox = () => {
		const {showTip} = this.props.value;

		return (
			<FormCheckControl className={styles.checkbox} label="Отображать всплывающую подсказку">
				<Checkbox checked={showTip} name="showTip" onChange={this.handleToggleShow} value={showTip} />
			</FormCheckControl>
		);
	};

	renderTipTextArea = () => {
		const {showTip, tip} = this.props.value;

		if (showTip) {
			return (
				<FormField>
					<TextArea
						name={DIAGRAM_FIELDS.tip}
						onChange={this.handleChangeTip}
						value={tip}
					/>
				</FormField>
			);
		}
	};

	render () {
		const {personalDashboard, user, value} = this.props;
		const {show} = value;

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<ToggableFormBox
					name={DIAGRAM_FIELDS.show}
					onToggle={this.handleToggleShow}
					showContent={show}
					title="Навигация с виджета"
				>
					{this.renderSelect()}
					{this.renderShowTipCheckbox()}
					{this.renderTipTextArea()}
				</ToggableFormBox>
			);
		}

		return null;
	}
}

export default NavigationBox;
