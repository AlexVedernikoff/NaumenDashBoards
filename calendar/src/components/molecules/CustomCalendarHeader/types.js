// @flow
import type {Node} from 'react';

export type Props = {
	children: Node,
	isDisabledExport: boolean,
	onExportToPDFClick: () => void,
	[key: string]: any
};
