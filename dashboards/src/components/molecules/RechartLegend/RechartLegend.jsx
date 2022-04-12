// @flow
import cn from 'classnames';
import {LEGEND_LAYOUT} from 'utils/recharts/constants';
import type {Payload, Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

export class RechartLegend extends PureComponent<Props> {
	static defaultProps = {
		align: 'center',
		chartHeight: 0,
		chartWidth: 0,
		height: 0,
		iconSize: 32,
		inactiveColor: '#ccc',
		layout: 'horizontal',
		margin: {
			bottom: 0,
			left: 0,
			right: 0,
			top: 0
		},
		payload: [],
		verticalAlign: 'middle',
		width: 0,
		wrapperStyle: {}
	};

	getRenderLegendItem = (isHorizontal: boolean, isCrop: boolean) => {
		const {formatter, iconSize} = this.props;
		const itemClass = cn({
			[styles.legendItem]: true,
			[styles.displayInlineHorizontalItem]: isHorizontal,
			[styles.cropLegendItem]: isCrop,
			[styles.wrapLegendItem]: !isCrop
		});
		const viewBox = `0 0 ${iconSize} ${iconSize}`;

		return (item, index) => {
			const {dataKey, value} = item;
			const key = `${dataKey}_${value}`;
			const valueData = formatter ? formatter(value) : value;

			return (
				<div className={itemClass} key={key}>
					<svg className={styles.legendItemBox} height={iconSize} viewBox={viewBox} width={iconSize}>
						{this.renderIcon(item)}
					</svg>
					<span title={valueData}>{valueData}</span>
				</div>
			);
		};
	};

	renderIcon = (item: Payload) => {
		const {iconSize} = this.props;
		const {color, inactive, type} = item;
		const {inactiveColor} = this.props;
		const iconColor = inactive ? inactiveColor : color;

		if (type === 'line') {
			const halfSize = iconSize / 2;
			const sixthSize = iconSize / 6;
			const thirdSize = iconSize / 3;

			return (
				<path
					d={`M0,${halfSize}h${thirdSize}
						A${sixthSize},${sixthSize},0,1,1,${2 * thirdSize},${halfSize}
						H${iconSize}M${2 * thirdSize},${halfSize}
						A${sixthSize},${sixthSize},0,1,1,${thirdSize},${halfSize}`}
					fill="none"
					stroke={iconColor}
					strokeWidth={4}
				/>
			);
		}

		return (
			<path
				d={`M0,${iconSize / 8}h${iconSize}v${(iconSize * 3) / 4}h${-iconSize}z`}
				fill={color}
				stroke="none"
			/>
		);
	};

	render () {
		const {layout, payload, textHandler} = this.props;
		const isHorizontal = layout === LEGEND_LAYOUT.HORIZONTAL;
		const isCrop = textHandler === TEXT_HANDLERS.CROP;
		const renderLegendItem = this.getRenderLegendItem(isHorizontal, isCrop);

		return (
			<div className={styles.legend}>
				{payload.map(renderLegendItem)}
			</div>
		);
	}
}

export default RechartLegend;
