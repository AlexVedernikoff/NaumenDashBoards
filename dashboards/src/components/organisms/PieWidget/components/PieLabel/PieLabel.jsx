// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import type {Props} from './types';
import React, {PureComponent} from 'react';

const RADIAN = Math.PI / 180;

export class PieLabel extends PureComponent<Props> {
	/**
	 * Проверяет, вмещается ли надпись с координатами центра в сектор отображения
	 * Формулы см. в pieLabel.drawio.png
	 * @param {string} text - текст надписи
	 * @param {number} x - точка x центра
	 * @param {number} y - точка у центра
	 * @returns {boolean} - возвращает true если надпись вмещается в сектор, false - если надпись не вмещается в сектор
	 */
	checkRectangleText = (text: string, x: number, y: number) => {
		const {endAngle, startAngle, style} = this.props;
		const {fontFamily, fontSize} = style;
		const [{height, width}] = calculateStringsSize([[text]], fontFamily, fontSize);
		const halfHeight = height / 2;
		const halfWidth = width / 2;
		const corners = [
			[x - halfWidth, y + halfHeight],
			[x - halfWidth, y - halfHeight],
			[x + halfWidth, y + halfHeight],
			[x + halfWidth, y - halfHeight]
		];
		const angles = corners.map(([x, y]) => {
			const rawAngle = -Math.atan2(y, x) / RADIAN;
			return rawAngle < 0 ? rawAngle + 360 : rawAngle;
		});

		return angles.every(angle => angle > startAngle && angle < endAngle);
	};

	render () {
		const {cx, cy, formatter, innerRadius, midAngle, outerRadius, percent, style, value} = this.props;
		const {fontColor, fontFamily, fontSize, show, showShadow} = style;

		if (show) {
			const text = formatter(value, percent * 100);
			const labelRadius = innerRadius === 0
				? outerRadius * 0.7
				: (outerRadius + innerRadius) * 0.5;
			const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
			const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

			if (this.checkRectangleText(text, x - cx, y - cy)) {
				// класс rechart_dataLabels_shadow объявлен глобально в стилях ReChartWidget
				const showClassName = showShadow ? 'rechart_dataLabels_shadow' : '';
				const style = {fontFamily};

				return (
					<text
						className={showClassName}
						dominantBaseline="middle"
						fill={fontColor}
						fontFamily={fontFamily}
						fontSize={fontSize}
						fontWeight="600"
						style={style}
						textAnchor={'middle'}
						x={x}
						y={y}
					>
						{text}
					</text>
				);
			}
		}

		return null;
	}
}

export default PieLabel;
