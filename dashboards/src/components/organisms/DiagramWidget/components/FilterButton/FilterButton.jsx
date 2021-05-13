// @flow
import {createFilterContext, getFilterContext} from 'store/helpers';
import type {CustomFilter, Widget} from 'store/widgets/data/types';
import DropdownMenu from 'components/atoms/DropdownMenu';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem} from 'rc-menu';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as ICON_BUTTON_VARIANTS} from 'components/atoms/IconButton/constants';

export class FilterButton extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		showOptionsMenu: false,
		usedFilters: this.hasUsedFilters(this.props.widget)
	};

	componentDidUpdate (prevProps: Props): * {
		const {widget} = this.props;

		if (prevProps.widget.data !== widget.data) {
			this.setState({usedFilters: this.hasUsedFilters(widget)});
		}
	}

	hasUsedFilters (widget: Widget) {
		return widget.data.some(item => item.source.widgetFilterOptions?.some(filter => !!filter.descriptor));
	}

	getNewDescriptor = async (filter: CustomFilter, classFqn: string): Promise<string> => {
		const {descriptor} = filter;
		let newDescriptor = '';

		try {
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

			if (context) {
				context['attrCodes'] = filter.attributes.map(attr => `${attr.metaClassFqn}@${attr.code}`);

				({serializedContext: newDescriptor} = await window.jsApi.commands.filterForm(context, true));
			}
		} catch (ex) {
			console.error('Ошибка формы фильтрации', ex);
		}

		return newDescriptor;
	};

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
			const newDescriptor = await this.getNewDescriptor(filter, source.value.value);

			onChange(dataSetIndex, filterIndex, newDescriptor);
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

	renderClearWidgetFilter = (): React$Node => (
		<MenuItem onClick={this.handleClearFilters}>
			Очистить фильтры
		</MenuItem>
	);

	renderShowButton = (): React$Node => {
		const {className} = this.props;
		const {showOptionsMenu, usedFilters} = this.state;
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
		return (
			<div className={styles.place}>
				{this.renderShowButton()}
				{this.renderButtonOptionsMenu()}
			</div>
		);
	}
}

export default FilterButton;
