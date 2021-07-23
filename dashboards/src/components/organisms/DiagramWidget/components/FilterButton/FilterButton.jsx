// @flow
import cn from 'classnames';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {getNewDescriptor, hasUsedFilters, isNotEmptyDescriptor} from './helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem} from 'rc-menu';
import type {MenuItemOption, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class FilterButton extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		showOptionsMenu: false,
		usedFilters: hasUsedFilters(this.props.widget)
	};

	componentDidUpdate (prevProps: Props): * {
		const {widget} = this.props;

		if (prevProps.widget.data !== widget.data) {
			this.setState({usedFilters: hasUsedFilters(widget)});
		}
	}

	handleClearFilters = () => {
		const {onClear} = this.props;

		this.handleToggleOptionsMenu();
		onClear();
	};

	handleItemClick = (option: {dataSetIndex: number, filterIndex: number}) => async () => {
		const {onChange, widget} = this.props;
		const {dataSetIndex, filterIndex} = option;
		const {source} = widget.data[dataSetIndex];
		const filter = source.widgetFilterOptions?.[filterIndex];

		if (filter) {
			const newDescriptor = await getNewDescriptor(filter, source.value.value);
			const updateDescriptor = isNotEmptyDescriptor(newDescriptor) ? newDescriptor : '';

			onChange(dataSetIndex, filterIndex, updateDescriptor);
		}

		this.handleToggleOptionsMenu();
	};

	handleToggleOptionsMenu = () => this.setState(state => ({showOptionsMenu: !state.showOptionsMenu}));

	renderButtonOptionsMenu = (): React$Node => {
		const {widget} = this.props;
		const {showOptionsMenu, usedFilters} = this.state;

		if (showOptionsMenu) {
			const items = widget.data.map((dataSet, dataSetIndex) => {
				const {value, widgetFilterOptions} = dataSet.source;

				if (value.label && widgetFilterOptions) {
					return widgetFilterOptions.map(({descriptor, label}, filterIndex) => ({
						dataSetIndex,
						dataSetLabel: value.label,
						filterIndex,
						label,
						used: isNotEmptyDescriptor(descriptor)
					}));
				}

				return [];
			}).flat();
			const isMultipleSource = (new Set(items.map(item => item.dataSetIndex))).size > 1;
			const list = items.map((item) => this.renderButtonOptionsMenuItem({...item, isMultipleSource}));

			return (
				<DropdownMenu onSelect={this.handleToggleOptionsMenu} onToggle={this.handleToggleOptionsMenu}>
					{list}
					{usedFilters && this.renderClearWidgetFilter()}
				</DropdownMenu>
			);
		}

		return null;
	};

	renderButtonOptionsMenuItem = (option: MenuItemOption): React$Node => {
		const {dataSetIndex, dataSetLabel, filterIndex, isMultipleSource, label, used} = option;
		const textLabel = (isMultipleSource) ? `${label} (${dataSetLabel})` : label;
		const itemClassName = cn({
			[styles.menuItemUsed]: used
		});

		return (
			<MenuItem
				className={itemClassName}
				key={`${dataSetIndex}_${filterIndex}`}
				onClick={this.handleItemClick({ dataSetIndex, filterIndex })}
			>
				{textLabel}
			</MenuItem>
		);
	};

	renderClearWidgetFilter = (): React$Node => (
		<MenuItem onClick={this.handleClearFilters}>
			Очистить фильтры
		</MenuItem>
	);

	renderShowButton = (): React$Node => {
		const {className} = this.props;
		const {showOptionsMenu, usedFilters} = this.state;
		const icon = usedFilters ? ICON_NAMES.FILLED_FILTER : ICON_NAMES.FILTER;
		const tip = showOptionsMenu ? null : 'Пользовательские фильтры';

		return (
			<IconButton
				active={showOptionsMenu}
				className={className}
				icon={icon}
				onClick={this.handleToggleOptionsMenu}
				round={false}
				tip={tip}
				variant={ICON_BUTTON_VARIANTS.GRAY}
			/>
		);
	};

	render () {
		return (
			<div className={styles.place}>
				{this.renderShowButton()}
				{this.renderButtonOptionsMenu()}
			</div>
		);
	}
}

export default FilterButton;
