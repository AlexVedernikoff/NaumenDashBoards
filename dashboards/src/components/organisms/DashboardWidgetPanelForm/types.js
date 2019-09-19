// @flow
import React from 'react';

export type ButtonProps = {
    type: string,
    value: string
};

export type FormProps = {
    description?: string,
    isNameShown?: boolean,
    name: string
};

export type InputProps = {
    handleChange: (onChange: Function, key: string, event: React.ChangeEvent<any>) => void,
    label?: string,
    name: string,
    placeholder?: string,
    validate?: (value: string) => string | undefined
};

export type SettingsProps = {
    label?: string,
    name: string,
    onClick: (name: string, value: boolean) => void
};
