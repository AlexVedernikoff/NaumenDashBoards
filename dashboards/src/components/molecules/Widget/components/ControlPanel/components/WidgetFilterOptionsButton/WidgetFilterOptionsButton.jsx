// @flow
import DropdownMenu from 'components/atoms/DropdownMenu';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem} from 'rc-menu';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class WidgetFilterOptionsButton extends PureComponent<Props, State> {
	state = {
		showOptionsMenu: false
	};

	static defaultProps = {
		className: ''
	};

	handleClearWidgetFilterOptions = () => {
		const {onClearWidgetFilters} = this.props;

		onClearWidgetFilters();
	};

	handleItemClick = (option: {dataSetIndex: number, filterIndex: number}) => () => {
		const {dataSetIndex, filterIndex} = option;
		const {onCallWidgetFilters} = this.props;

		onCallWidgetFilters(dataSetIndex, filterIndex);
		this.handleToggleOptionsMenu();
	};

	handleToggleOptionsMenu = () => this.setState((state) => ({showOptionsMenu: !state.showOptionsMenu}));

	hasFilters = (): boolean => {
		const {widget} = this.props;
		return widget.data?.some(item => (item.source.widgetFilterOptions && item.source.widgetFilterOptions.length > 0));
	};

	hasUsedFilters = (): boolean => {
		const {widget} = this.props;
		return widget.data?.some(item => (
			item.source.widgetFilterOptions
			&& item.source.widgetFilterOptions.some(filter => !!filter.descriptor)
		));
	};

	renderButtonOptionsMenu = (usedFilters: boolean): React$Node => {
		const {widget} = this.props;
		const {showOptionsMenu} = this.state;

		if (showOptionsMenu) {
			const {data} = widget;
			const items = data.map((dataSet, dataSetIndex) => {
				const {source} = dataSet;
				const {value, widgetFilterOptions} = source;

				if (value.label && widgetFilterOptions) {
					return widgetFilterOptions.map(({label}, filterIndex) => [dataSetIndex, value.label, label, filterIndex]);
				}

				return [];
			}).flat();
			const isMultipleSource = (new Set(items.map(item => item[0]))).size > 1;
			const list = items.map((item) => this.renderButtonOptionsMenuItem(...item, isMultipleSource));

			return (
				<DropdownMenu onSelect={this.handleToggleOptionsMenu} onToggle={this.handleToggleOptionsMenu}>
					{list}
					{usedFilters && this.renderClearWidgetFilter()}
				</DropdownMenu>
			);
		}

		return null;
	};

	renderButtonOptionsMenuItem = (dataSetIndex: number, dataSetLabel: string, label: string, filterIndex: number, isMultipleSource: boolean): React$Node => {
		const textLabel = (isMultipleSource) ? `${label} (${dataSetLabel})` : label;

		return (
			<MenuItem
				key={`${dataSetIndex}_${label}`}
				onClick={this.handleItemClick({ dataSetIndex, filterIndex })}
			>
				{textLabel}
			</MenuItem>
		);
	};

	renderClearWidgetFilter = (): React$Node => {
		return (
			<MenuItem onClick={this.handleClearWidgetFilterOptions}>
				Очистить фильтры
			</MenuItem>
		);
	};

	renderShowButton = (usedFilters: boolean): React$Node => {
		const {className} = this.props;
		const {showOptionsMenu} = this.state;
		const icon = usedFilters ? ICON_NAMES.FILLED_FILTER : ICON_NAMES.FILTER;
		return (
			<IconButton
				active={showOptionsMenu}
				className={className}
				icon={icon}
				onClick={this.handleToggleOptionsMenu}
				round={false}
				tip="Пользовательские фильтры"
				variant={ICON_BUTTON_VARIANTS.GRAY}
			/>
		);
	};

	render () {
		const hasFilters = this.hasFilters();
		const usedFilters = this.hasUsedFilters();

		if (hasFilters) {
			return (
				<div className="header-submenu">
					{this.renderShowButton(usedFilters)}
					{this.renderButtonOptionsMenu(usedFilters)}
				</div>
			);
		}

		return null;
	}
}

export default WidgetFilterOptionsButton;
