// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'components/molecules/FormField';
import {HEADER_POSITIONS} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

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
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={data.show} title="Заголовок">
					<FormField row>
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
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(HeaderBox);
