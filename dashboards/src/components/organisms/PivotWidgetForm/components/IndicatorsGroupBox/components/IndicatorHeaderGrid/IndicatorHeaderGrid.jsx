// @flow
import {BLOCK_HEIGHT} from './constants.js';
import {calculateColumnsCount, calculateHeight, changeParentForFlatIndicator, deleteFlatGroup, findTarget, sortingFlatIndicator, updateValueItem} from './helpers';
import Draggable from 'react-draggable';
import type {FlatIndicatorGrouping, FlatIndicatorInfo, Props, State} from './types';
import GroupingBox from 'PivotWidgetForm/components/IndicatorsGroupBox/components/GroupingBox';
import IndicatorBox from 'PivotWidgetForm/components/IndicatorsGroupBox/components/IndicatorBox';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';

export class IndicatorHeaderGrid extends PureComponent<Props, State> {
	state = {
		count: 0,
		height: BLOCK_HEIGHT,
		itemWidth: 300,
		list: [],
		mouseOffset: {x: 0, y: 0}
	};

	componentDidUpdate (prevProps: Props) {
		const {value} = this.props;

		if (prevProps.value !== value) {
			const {count, list} = calculateColumnsCount(value);
			const height = calculateHeight(list);

			this.setState({count, height, list});
		}
	}

	getGroupChangedHasSumHandler = (group: FlatIndicatorGrouping) => hasSum => {
		const {onChange, value} = this.props;
		const {item} = group;
		const newItem = {...item, hasSum};
		const newValue = updateValueItem(value, item, newItem);

		onChange(newValue);
	};

	getGroupChangedNameHandler = (group: FlatIndicatorGrouping) => (label: string) => {
		const {onChange, value} = this.props;
		const {item} = group;
		const newItem = {...item, label};
		const newValue = updateValueItem(value, item, newItem);

		onChange(newValue);
	};

	getGroupCheckedHandler = (group: FlatIndicatorGrouping) => (name, checked) => {
		const {onChange, value} = this.props;
		const {item} = group;
		const newItem = {...item, checked};
		const newValue = updateValueItem(value, item, newItem);

		onChange(newValue);
	};

	getGroupDeleteHandler = (group: FlatIndicatorGrouping) => () => {
		const {onChange, value} = this.props;
		const newValue = deleteFlatGroup(value, group);

		onChange(newValue);
	};

	getIndicatorCheckedHandler = (indicator: FlatIndicatorInfo) => (name, checked) => {
		const {onChange, value} = this.props;
		const {item} = indicator;
		const newItem = {...item, checked};
		const newValue = updateValueItem(value, item, newItem);

		onChange(newValue);
	};

	getItemDragHandler = (item: FlatIndicatorInfo | FlatIndicatorGrouping) => (e, data) => {
		const {onChange, value} = this.props;
		const {itemWidth, list, mouseOffset} = this.state;
		const {level, target} = findTarget(list, itemWidth, data.x + mouseOffset.x, data.y + mouseOffset.y);
		let newValue = [...value];

		if (item.item !== target?.item) {
			if (level === item.level && target?.parent === item.parent) {
				newValue = sortingFlatIndicator(value, item, target);
			} else if (target && target.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
				newValue = changeParentForFlatIndicator(value, item, target);
			}
		}

		onChange(newValue);
	};

	handleResize = (newWidth: number) => {
		// calculate items height
		const {value} = this.props;
		const {count, list} = calculateColumnsCount(value);
		const height = calculateHeight(list);
		let itemWidth = newWidth / count;

		if (itemWidth < 100) { itemWidth = 100; }

		if (itemWidth > 300) { itemWidth = 300; }

		this.setState({count, height, itemWidth, list});
	};

	handleSaveMouseOffset = (e, data) => {
		const {x, y} = e.currentTarget.getBoundingClientRect();
		return this.setState({mouseOffset: {x: e.clientX - x, y: e.clientY - y}});
	};

	renderIndicatorGroup = (group: FlatIndicatorGrouping) => {
		const {itemWidth} = this.state;
		const {height, item, level, offset, width} = group;
		const {checked, hasSum, key, label} = item;
		const position = {x: offset * itemWidth, y: level * BLOCK_HEIGHT};
		return (
			<Draggable
				key={key}
				onStart={this.handleSaveMouseOffset}
				onStop={this.getItemDragHandler(group)}
				position={position}
			>
				<GroupingBox
					checked={checked}
					hasSum={hasSum}
					name={label}
					onChangedHasSum={this.getGroupChangedHasSumHandler(group)}
					onChangedName={this.getGroupChangedNameHandler(group)}
					onChecked={this.getGroupCheckedHandler(group)}
					onDelete={this.getGroupDeleteHandler(group)}
					size={height}
					width={itemWidth * width}
					x={offset}
					y={level}
				/>
			</Draggable>
		);
	};

	renderIndicatorInfo = (indicator: FlatIndicatorInfo) => {
		const {itemWidth} = this.state;
		const {item, level, offset} = indicator;
		const {checked, hasBreakdown, key, label} = item;
		const position = {x: offset * itemWidth, y: level * BLOCK_HEIGHT};

		return (
			<Draggable
				key={key}
				onStart={this.handleSaveMouseOffset}
				onStop={this.getItemDragHandler(indicator)}
				position={position}
			>
				<IndicatorBox
					checked={checked}
					hasBreakdown={hasBreakdown}
					label={label}
					onChecked={this.getIndicatorCheckedHandler(indicator)}
					width={itemWidth}
				/>
			</Draggable>
		);
	};

	renderItem = (item: FlatIndicatorGrouping | FlatIndicatorInfo) => {
		if (item.type === INDICATOR_GROUPING_TYPE.GROUP_INDICATOR_INFO) {
			return this.renderIndicatorGroup(item);
		}

		if (item.type === INDICATOR_GROUPING_TYPE.INDICATOR_INFO) {
			return this.renderIndicatorInfo(item);
		}
	};

	renderItems = () => this.state.list.map(this.renderItem);

	render () {
		const {height} = this.state;
		return (
			<ResizeDetector onResize={this.handleResize} skipOnMount={false}>
				<div className={styles.grid} style={{height}}>
					{this.renderItems()}
				</div>
			</ResizeDetector>
		);
	}
}

export default IndicatorHeaderGrid;
