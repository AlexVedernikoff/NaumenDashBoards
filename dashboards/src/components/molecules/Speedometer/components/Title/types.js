// @flow
import type {ComponentProps as TextProps} from 'components/molecules/Speedometer/components/Text/types';
import type {FontStyle} from 'store/widgets/data/types';
import type {WidgetTooltip} from 'store/widgets/data/types.js';

export type Components = {
	Text: React$ComponentType<TextProps>,
};

export type TextStyle = {
	fontColor: string,
	fontFamily: string,
	fontSize: string | number,
	fontStyle: ?FontStyle,
	show: boolean,
};

export type Props = {
	centerX: number,
	components?: Components,
	fontSizeScale: number,
	style: TextStyle,
	title: string,
	tooltip?: WidgetTooltip | null,
	width: number,
	y: number
};
