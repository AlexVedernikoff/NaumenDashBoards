// @flow
import {CheckIconButtonGroup, DisableableBox, FormField, ToggableFormBox} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/constants';
import {HEADER_POSITIONS} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class HeaderBox extends PureComponent<Props> {
	renderPositionButtons = () => {
		const {data, handleChange} = this.props;
		const icons = [
			{
				name: ICON_NAMES.POSITION_TOP,
				title: 'Отображать сверху',
				value: HEADER_POSITIONS.TOP
			},
			{
				name: ICON_NAMES.POSITION_BOTTOM,
				title: 'Отображать снизу',
				value: HEADER_POSITIONS.BOTTOM
			}
		];

		return <CheckIconButtonGroup icons={icons} name={FIELDS.position} onChange={handleChange} value={data.position} />;
	};

	render () {
		const {
			data,
			handleBoolChange,
			renderColorInput,
			renderFontFamilySelect,
			renderFontSizeSelect,
			renderFontStyleButtons,
			renderTextAlignButtons,
			renderTextHandlerButtons
		} = this.props;

		return (
			<ToggableFormBox title="Заголовок">
				<DisableableBox handleChange={handleBoolChange} label="Показывать на диаграмме" name={FIELDS.show} value={data.show}>
					<FormField label="Шрифт" row>
						{renderFontFamilySelect()}
						{renderFontSizeSelect()}
					</FormField>
					<FormField row>
						{renderFontStyleButtons()}
						{renderColorInput()}
					</FormField>
					<FormField row>
						{renderTextAlignButtons()}
						{renderTextHandlerButtons()}
						{this.renderPositionButtons()}
					</FormField>
				</DisableableBox>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(HeaderBox);
