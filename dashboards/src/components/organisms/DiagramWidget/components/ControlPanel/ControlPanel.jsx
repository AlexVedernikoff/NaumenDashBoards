// @flow
import Container from 'components/atoms/Container';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import DropdownMenu from 'components/atoms/DropdownMenu';
import FilterButton from 'components/organisms/DiagramWidget/components/FilterButton';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import {Item as MenuItem, SubMenu} from 'rc-menu';
import type {OnClickMenuItemEvent, Props} from './types';
import React, {PureComponent} from 'react';
import WidgetControlPanel from 'containers/WidgetControlPanel';

export class ControlPanel extends PureComponent<Props> {
	handleClickDrillDownButton = (e: OnClickMenuItemEvent) => {
		const {onDrillDown, widget} = this.props;

		onDrillDown(widget, e.item.props.keyEvent);
	};

	handleClickExportItem = (e: OnClickMenuItemEvent) => this.props.onExport(e.key);

	handleClickNavigationButton = () => {
		const {onNavigation, widget} = this.props;
		const {dashboard, widget: navigationWidget} = widget.navigation;

		if (dashboard) {
			const widgetId = navigationWidget ? navigationWidget.value : '';

			onNavigation(dashboard.value, widgetId);
		}
	};

	hasCustomFilters = (): boolean => {
		const {widget} = this.props;
		return widget.data.some(item => item.source.widgetFilterOptions && item.source.widgetFilterOptions.length > 0);
	};

	renderContainer = ({children, ...props}) => (
		<Container {...props}>
			{this.renderNavigationButton()}
			{children}
		</Container>
	);

	renderDrillDownItems = (): Array<React$Node> | null => {
		const {widget} = this.props;

		// $FlowFixMe[incompatible-type]
		// $FlowFixMe[prop-missing]
		return widget.data.filter(dataSet => !dataSet.sourceForCompute).map((dataSet, index) => {
			const {dataKey, source} = dataSet;

			return (
				<MenuItem key={dataKey} keyEvent={index} onClick={this.handleClickDrillDownButton}>
					{source.value.label}
				</MenuItem>
			);
		});
	};

	renderDropdownMenu = (props: Object) => {
		const {exportOptions} = this.props;
		const {children, onToggle} = props;

		return (
			<DropdownMenu onSelect={onToggle} onToggle={onToggle}>
				{this.renderSubmenu(<span>Источники</span>, this.renderDrillDownItems())}
				{this.renderSubmenu(<span>Экспорт</span>, exportOptions.map(this.renderExportItem))}
				{children}
			</DropdownMenu>
		);
	};

	renderExportItem = (item: string) => (
		<MenuItem eventKey={item} key={item} onClick={this.handleClickExportItem}>
			{item.toUpperCase()}
		</MenuItem>
	);

	renderFilterOnWidget = () => {
		const {onChangeFilter, onClearFilters, widget} = this.props;

		if (this.hasCustomFilters()) {
			return <FilterButton onChange={onChangeFilter} onClear={onClearFilters} widget={widget} />;
		}

		return null;
	};

	renderNavigationButton = () => {
		const {navigation, type} = this.props.widget;

		if (navigation.show && type in DIAGRAM_WIDGET_TYPES) {
			let {showTip, tip} = navigation;

			if (!showTip) {
				tip = '';
			}

			return (
				<IconButton
					icon={ICON_NAMES.EXTERNAL_LINK}
					onClick={this.handleClickNavigationButton}
					round={false}
					tip={tip}
				/>
			);
		}

		return null;
	};

	renderSubmenu = (title: React$Node, content: React$Node) => (
		<SubMenu popupClassName="popupSubmenu" title={title}>
			{content}
		</SubMenu >
	);

	render () {
		const {className, widget} = this.props;
		const components = {
			Container: this.renderContainer,
			DropdownMenu: this.renderDropdownMenu,
			FilterOnWidget: this.renderFilterOnWidget
		};

		return <WidgetControlPanel className={className} components={components} widget={widget} />;
	}
}

export default ControlPanel;
