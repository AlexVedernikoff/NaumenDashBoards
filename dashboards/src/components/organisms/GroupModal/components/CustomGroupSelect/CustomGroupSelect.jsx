// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import Container from 'components/atoms/Container';
import CreationPanel from 'components/atoms/CreationPanel';
import type {CustomGroup} from 'GroupModal/types';
import FieldError from 'GroupModal/components/FieldError';
import {FIELDS} from 'GroupModal/constants';
import FormField from 'GroupModal/components/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import mainStyles from 'GroupModal/styles.less';
import {MAX_TEXT_LENGTH} from 'components/constants';
import memoize from 'memoize-one';
import type {Props} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class CustomGroupSelect extends PureComponent<Props> {
	getComponents = memoize(() => ({
		MenuContainer: this.renderMenuContainer
	}));

	getGroupLabel = (group: ?CustomGroup): string => group?.name ?? '';

	getGroupValue = (group: ?CustomGroup): ?string => group?.id;

	renderInfoIcon = () => (
		<div title="Название для сохранения группировки">
			<Icon className={mainStyles.infoIcon} name={ICON_NAMES.INFO} />
		</div>
	);

	renderMenuContainer = (props: ContainerProps) => {
		const {onCreate} = this.props;
		const {children, className} = props;

		return (
			<Container className={className}>
				{children}
				<CreationPanel onClick={onCreate} text="Добавить группировку" />
			</Container>
		);
	};

	renderRemovalButton = () => {
		const {onRemove, value} = this.props;

		return value ? <Button onClick={onRemove} variant={BUTTON_VARIANTS.SIMPLE}>Удалить</Button> : null;
	};

	renderSelect = () => {
		const {loading, onChangeName, onFetch, onSelect, options, value} = this.props;
		const editable = !!value;

		return (
			<Select
				className={styles.select}
				components={this.getComponents()}
				editable={editable}
				fetchOptions={onFetch}
				getOptionLabel={this.getGroupLabel}
				getOptionValue={this.getGroupValue}
				loading={loading}
				maxLabelLength={MAX_TEXT_LENGTH}
				onChangeLabel={onChangeName}
				onSelect={onSelect}
				options={options}
				value={value}
			/>
		);
	};

	render () {
		return (
			<FormField className={styles.field} label="Название группировки">
				<div className={styles.container}>
					{this.renderSelect()}
					{this.renderInfoIcon()}
					{this.renderRemovalButton()}
				</div>
				<FieldError path={FIELDS.name} />
			</FormField>
		);
	}
}

export default CustomGroupSelect;
