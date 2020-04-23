// @flow
import type {Props as FormProps, RenderFormProps} from 'WidgetFormPanel/types';
import {TABS} from './constants';

export type Props = {|
	...FormProps,
	...RenderFormProps
|};

export type State = {
	tab: string
};

 export type Tab = $Keys<typeof TABS>;
