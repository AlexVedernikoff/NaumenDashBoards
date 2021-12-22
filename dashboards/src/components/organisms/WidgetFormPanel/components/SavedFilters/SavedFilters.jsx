// @flow
import cn from 'classnames';
import type {Components as ListComponents} from 'components/molecules/Select/components/List/types';
import type {Components as ListOptionComponents} from 'components/molecules/Select/components/ListOption/types';
import Container from 'components/atoms/Container';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import List from 'components/molecules/Select/components/List';
import ListOption from 'components/molecules/Select/components/ListOption';
import memoize from 'memoize-one';
import type {OnSelectEvent} from 'components/types';
import type {Props, SourceFiltersItem} from './types';
import React, {Component} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

export class SavedFilters extends Component<Props> {
	static defaultProps = {
		className: '',
		filters: [],
		loading: false
	};

	getComponents = memoize(() => ({
		List: this.renderFilterList,
		Message: this.renderFilterListMessage,
		ValueContainer: this.renderValueContainer
	}));

	getListComponents = (): ListComponents => ({
		ListOption: this.renderListOption
	});

	getListOptionComponents = (): $Shape<ListOptionComponents> => ({
		ValueContainer: this.renderListOptionValueContainer
	});

	handleDeleteFilter = (id: ?string) => (e: SyntheticMouseEvent<HTMLElement>) => {
		const {onDelete} = this.props;

		if (id && onDelete) {
			onDelete(id);
		}

		e.stopPropagation();
	};

	handleLoadFilters = () => { };

	handleSelect = ({value}: OnSelectEvent) => {
		const {onSelect} = this.props;
		return onSelect(value);
	};

	renderDeleteFilterButton = (id: ?string): React$Node => {
		const {isPersonal} = this.props;

		if (!isPersonal) {
			return (
				<button className={styles.actionButtons} onClick={this.handleDeleteFilter(id)}>
					<Icon className={styles.caret} name={ICON_NAMES.BASKET} />
				</button>
			);
		}

		return null;
	};

	renderFilterList = props => (
		<List {...props} components={this.getListComponents()} />
	);

	renderFilterListMessage = props => {
		const {children, className} = props;
		const messageCN = cn([className, styles.filterListMessage]);
		return (
			<Container className={messageCN}>
				{children}
			</Container>
		);
	};

	renderListOption = props => (
		<ListOption {...props} className={styles.filterListOption} components={this.getListOptionComponents()} />
	);

	renderListOptionValueContainer = props => {
		const {children, className, onClick, option, style} = props;
		const {id} = option;

		return (
			<Container className={className} onClick={onClick} style={style}>
				{children}
				{this.renderDeleteFilterButton(id)}
			</Container>
		);
	};

	renderValueContainer = ({className, onClick}) => {
		const selectCN = cn([className, styles.savedFilters]);
		return (
			<Container className={selectCN} onClick={onClick}>
				<T text='SavedFilters::Title' />
			</Container>
		);
	};

	render () {
		const {className, filters, loading} = this.props;
		const selectCN = cn([className, styles.selectTransparent]);

		return (
			<Select
				className={selectCN}
				components={this.getComponents()}
				fetchOptions={this.handleLoadFilters}
				getOptionLabel={(item: SourceFiltersItem) => item.label}
				getOptionValue={(item: SourceFiltersItem) => item.id}
				isSearching={true}
				loading={loading}
				menuHeaderMessage={t('SavedFilters::HeaderMessage')}
				notFoundMessage={t('SavedFilters::NotFoundMessage')}
				onSelect={this.handleSelect}
				options={filters}
				placeholder={t('SavedFilters::Placeholder')}
			/>
		);
	}
}

export default SavedFilters;
