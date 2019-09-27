// @flow
import type {FieldProps} from 'formik';

export type Props = {
    field: FieldProps,
    handleClick: (name: string, value: boolean) => void,
    label: string
};
