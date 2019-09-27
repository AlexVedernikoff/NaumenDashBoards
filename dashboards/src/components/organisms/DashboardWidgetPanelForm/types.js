// @flow
import React from 'react';
import {TextProps, TreeData} from 'react-dropdown-tree-select';

export type ButtonsProps = {
    isDisabled?: boolean,
    size?: string,
    theme?: string,
    type: string,
    value: string
};

export type FeaturesProps = {
    value: string
};

export type FormProps = {
    description?: string,
    isNameShown?: boolean,
    name: string
};

export type InputsProps = {
    handleChange: (onChange: Function, key: string, event: React.ChangeEvent<any>) => void,
    label?: string,
    name: string,
    onBlur?: (e: any) => void,
    placeholder?: string,
    validate?: (value: string) => string | undefined,
    value: string
};

export type SettingsProps = {
    label?: string,
    name: string,
    onClick: (name: string, value: boolean) => void,
    value?: Array<{value: string, label: string}>
};

export type TreeSelectProps = {
    data: TreeData,
    texts: TextProps
};
