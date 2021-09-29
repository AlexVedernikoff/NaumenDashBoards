// @flow
import Localization from './localization';
import type {LocalizationParams} from './types';

export const localization = new Localization();

const translate = (key: string, params?: LocalizationParams) => localization.translate(key, params);

export default translate;
