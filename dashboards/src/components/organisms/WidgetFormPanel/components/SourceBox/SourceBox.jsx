// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FieldError from 'WidgetFormPanel/components/FieldError';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React from 'react';
import styles from 'WidgetFormPanel/styles.less';
import t from 'localization';

export class SourceBox extends React.Component<Props> {
	renderAddSourceInput = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.props.onAdd} />;

	render () {
		const {children} = this.props;

		return (
			<FormBox rightControl={this.renderAddSourceInput()} title={t('SourceBox::Title')}>
				{children}
				<FieldError className={styles.errorField} path={DIAGRAM_FIELDS.sources} />
			</FormBox>
		);
	}
}

export default SourceBox;
