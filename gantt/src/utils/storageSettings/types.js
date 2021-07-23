// @flow
import {STORAGE_SETTINGS_KEYS} from './constants';

export type StorageSettings = $Shape<{
	focused: boolean,
	targetWidget: string
}>;

export type StorageSettingsKey = $Values<typeof STORAGE_SETTINGS_KEYS>;

export type StorageSettingsValue = $Values<StorageSettings>;
