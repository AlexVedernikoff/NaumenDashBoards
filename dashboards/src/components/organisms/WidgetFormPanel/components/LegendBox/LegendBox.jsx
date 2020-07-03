// @flow
import {CheckIconButtonGroup, DisableableBox, FormField, ToggableFormBox} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import {LEGEND_POSITIONS} from 'utils/chart/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class LegendBox extends PureComponent<Props> {
	renderLegendPositionButtons = () => {
		const {data, handleChange} = this.props;
		const icons = [
			{
				name: ICON_NAMES.POSITION_LEFT,
				title: 'Слева',
				value: LEGEND_POSITIONS.left
			},
			{
				name: ICON_NAMES.POSITION_TOP,
				title: 'Вверху',
				value: LEGEND_POSITIONS.top
			},
			{
				name: ICON_NAMES.POSITION_RIGHT,
				title: 'Справа',
				value: LEGEND_POSITIONS.right
			},
			{
				name: ICON_NAMES.POSITION_BOTTOM,
				title: 'Внизу',
				value: LEGEND_POSITIONS.bottom
			}
		];

		return <CheckIconButtonGroup icons={icons} name={FIELDS.position} onChange={handleChange} value={data.position} />;
	};

	render () {
		const {data, handleBoolChange, renderFontFamilySelect, renderFontSizeSelect, renderTextHandlerButtons} = this.props;

		return (
			<ToggableFormBox title="Легенда">
				<DisableableBox handleChange={handleBoolChange} label="Показывать на диаграмме" name={FIELDS.show} value={data.show}>
					<FormField label="Шрифт" row>
						{renderFontFamilySelect()}
						{renderFontSizeSelect()}
					</FormField>
					<FormField row>
						{this.renderLegendPositionButtons()}
						{renderTextHandlerButtons()}
					</FormField>
				</DisableableBox>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(LegendBox);
