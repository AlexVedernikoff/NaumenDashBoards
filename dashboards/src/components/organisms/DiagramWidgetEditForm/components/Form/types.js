// @flow
import type {DivRef} from 'components/types';
import type {LayoutSize, RenderFormProps} from 'DiagramWidgetEditForm/types';
import type {Props as FormProps} from 'containers/DiagramWidgetEditForm/types';
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
