// @flow
import type {Format} from 'components/organisms/ExportByEmailForm/types';
import type {OnSelectEvent} from 'components/types';

export type Props = {
	format: Format,
	formatOptions: Array<Format>,
	onAddUser: () => void,
	onSelectFormat: (event: OnSelectEvent) => void;
};
