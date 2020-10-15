// @flow
import type {DivRef} from 'components/types';
import type {LayoutSize, Props as FormProps, RenderFormProps} from 'WidgetFormPanel/types';
import {TABS} from './constants';

export type Props = {|
	forwardedRef: DivRef,
	layoutSize: LayoutSize,
	...FormProps,
	...RenderFormProps
|};

export type State = {
	tab: string
};

export type Tab = $Keys<typeof TABS>;
