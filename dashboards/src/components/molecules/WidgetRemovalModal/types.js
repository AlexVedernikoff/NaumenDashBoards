// @flow
import type {Role} from 'store/dashboard/types';

export type Props = {
	onClose: () => void,
	onSubmit: (onlyPersonal: boolean) => void,
	role?: Role
};
