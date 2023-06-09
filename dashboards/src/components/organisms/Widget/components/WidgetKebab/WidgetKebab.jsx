// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import Kebab, {KebabDropdownButton, KebabIconButton} from 'components/molecules/Kebab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

export class WidgetKebab extends PureComponent<Props> {
	handleExport = ({value}) => {
		const {onExport, widgetRef} = this.props;
		const {current} = widgetRef;

		if (current) {
			onExport(current, value);
		}
	};

	renderChangeMode = () => {
		const {mode, onChangeMode} = this.props;

		if (mode) {
			const {availableOptions, icon, text, value} = mode;
			return (
				<KebabDropdownButton
					icon={icon}
					onSelect={onChangeMode}
					options={availableOptions}
					text={text}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDataDropDown = () => {
		const {data, onDrillDown} = this.props;

		if (data) {
			const {availableOptions, icon, text, value} = data;
			return (
				<KebabDropdownButton
					icon={icon}
					onSelect={onDrillDown}
					options={availableOptions}
					text={text}
					value={value}
				/>
			);
		}

		return null;
	};

	renderEditButton = () => {
		const {editable, onSelect} = this.props;

		if (editable) {
			return (
				<KebabIconButton
					icon={ICON_NAMES.EDIT}
					onClick={onSelect}
					text={t('WidgetKebab::Edit')}
				/>
			);
		}

		return null;
	};

	renderExportDropDown = () => {
		const {exportParams} = this.props;

		if (exportParams) {
			const {availableOptions, icon, text, value} = exportParams;
			return (
				<KebabDropdownButton
					icon={icon}
					onSelect={this.handleExport}
					options={availableOptions}
					text={text}
					value={value}
				/>
			);
		}

		return null;
	};

	renderFiltersOnWidget = () => {
		const {filtersOnWidget, onChangeFiltersOnWidget} = this.props;

		if (filtersOnWidget) {
			const {availableOptions, icon, text, value} = filtersOnWidget;
			return (
				<KebabDropdownButton
					icon={icon}
					onSelect={onChangeFiltersOnWidget}
					options={availableOptions}
					text={text}
					value={value}
				/>
			);
		}

		return null;
	};

	renderNavigationLink = (): React$Node => {
		const {navigation, onNavigation} = this.props;

		if (navigation) {
			return (
				<KebabIconButton
					icon={ICON_NAMES.EXTERNAL_LINK}
					onClick={onNavigation}
					text={navigation.text}
				/>
			);
		}

		return null;
	};

	renderRemoveMenuItem = () => {
		const {editable, onRemove, widgetRef} = this.props;
		const handleRemove = () => onRemove(widgetRef);

		if (editable) {
			return (
				<KebabIconButton
					icon={ICON_NAMES.BASKET}
					onClick={handleRemove}
					text={t('WidgetKebab::Delete')}
				/>
			);
		}

		return null;
	};

	render () {
		const {className} = this.props;
		return (
			<Kebab className={className}>
				{this.renderNavigationLink()}
				{this.renderChangeMode()}
				{this.renderEditButton()}
				{this.renderFiltersOnWidget()}
				{this.renderDataDropDown()}
				{this.renderExportDropDown()}
				{this.renderRemoveMenuItem()}
			</Kebab>
		);
	}
}

export default WidgetKebab;
