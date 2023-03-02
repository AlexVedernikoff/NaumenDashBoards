// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FieldError from 'WidgetFormPanel/components/FieldError';
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import memoize from 'memoize-one';
import type {PivotLink} from 'store/widgets/data/types';
import type {Props} from './types';
import React, {Component} from 'react';
import SourceLink from './components/SourceLink';
import SourceLinkEditor from 'containers/SourceLinkEditor';
import styles from './styles.less';
import t from 'localization';

export class SourceLinksBox extends Component<Props> {
	getComponents = memoize(({components}: Props) => ({
		...components,
		SourceLink: this.renderSourceLink,
		SourceLinkEditor: this.renderSourceLinkEditor
	}));

	getLinkChangeHandler = index => (link: PivotLink) => {
		const {links, onChange} = this.props;
		const newLinks: Array<PivotLink> = [];

		links.forEach((oldLink, idx) => {
			if (idx === index) {
				newLinks.push(link);
				return;
			}

			newLinks.push(oldLink);
		});

		onChange(newLinks);
	};

	getLinkDeleteHandler = index => () => {
		const {links, onChange} = this.props;
		const newLinks = links.filter((_, idx) => idx !== index);

		onChange(newLinks);
	};

	handleAddLink = () => {
		const {data, links, onChange} = this.props;
		const newLink = {
			attribute: null,
			dataKey1: data[0].dataKey,
			dataKey2: data[1].dataKey
		};

		onChange([...links, newLink]);
	};

	renderAddSourceLinks = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleAddLink} />;

	renderLink = (link, index) => {
		const {data, position} = this.props;
		const key = link.dataKey1 + '@' + link.dataKey2;
		const components = this.getComponents(this.props);

		return (
			<components.SourceLink
				components={components}
				data={data}
				index={index}
				key={key}
				link={link}
				onChange={this.getLinkChangeHandler(index)}
				onDelete={this.getLinkDeleteHandler(index)}
				position={position}
			/>
		);
	};

	renderSourceLink = props => <SourceLink {...props} />;

	renderSourceLinkEditor = props => <SourceLinkEditor {...props} />;

	render () {
		const {data, links} = this.props;

		if (data.length > 1) {
			return (
				<FormBox
					rightControl={this.renderAddSourceLinks()}
					title={t('PivotWidgetForm::SourceLinksBox')}
				>
					{links.map(this.renderLink)}
					<FieldError className={styles.errorField} path={DIAGRAM_FIELDS.links} />
				</FormBox>
			);
		}

		return null;
	}
}

export default SourceLinksBox;
