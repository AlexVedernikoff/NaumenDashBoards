// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'components/molecules/FormField';
import {ICON_NAMES} from 'components/atoms/Icon';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/chart/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class LegendBox extends PureComponent<Props> {
	renderLegendDisplayTypeButtons = () => {
		const {data, handleChange} = this.props;
		const {left, right} = LEGEND_POSITIONS;
		const {displayType, position} = data;
		const disabled = position === left || position === right;
		const icons = [
			{
				name: ICON_NAMES.COLUMN,
				title: 'Вывести в столбец',
				value: LEGEND_DISPLAY_TYPES.BLOCK
			},
			{
				name: ICON_NAMES.ROW,
				title: 'Вывести в строку',
				value: LEGEND_DISPLAY_TYPES.INLINE
			}
		];

		return (
			<CheckIconButtonGroup
				disabled={disabled}
				icons={icons}
				name={FIELDS.displayType}
				onChange={handleChange}
				value={displayType}
			/>
		);
	};

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
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={data.show} title="Легенда">
				<FormField row>
					{renderFontFamilySelect()}
					{renderFontSizeSelect()}
				</FormField>
				<FormField>
					{this.renderLegendPositionButtons()}
				</FormField>
				<FormField row>
					{renderTextHandlerButtons()}
					{this.renderLegendDisplayTypeButtons()}
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(LegendBox);
