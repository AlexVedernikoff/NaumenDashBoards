// @flow
import type {FieldProps} from 'formik';

export type Props = {
    field: FieldProps,
    handleClick: (isNameShown: boolean) => void,
    label: string
};
