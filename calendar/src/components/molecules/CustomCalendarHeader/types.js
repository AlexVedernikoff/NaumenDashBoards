// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	isDisabledButtons: boolean,
	onExportToPDFClick: () => void,
	onRefresh: () => void,
	[key: string]: any
};
