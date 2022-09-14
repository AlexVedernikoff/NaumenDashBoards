// @flow
import api from 'api';
import {connect} from 'react-redux';
import type {Context} from 'utils/descriptorUtils/types';
import {createFilterContext, getFilterContext, parseCasesAndGroupCode} from 'utils/descriptorUtils';
import type {FilterFormOptionsDTO} from 'api/types';
import {findFilter, getSourceFilterAttributeGroup} from './helpers';
import {functions, props} from './selectors';
import {getDescriptorCases} from 'store/helpers';
import type {InjectedProps, Props, State} from './types';
import React, {PureComponent} from 'react';
import type {SourceData} from 'src/store/widgets/data/types';

export const withFilterForm = <Config: {}>(Component: React$ComponentType<Config & InjectedProps>): React$ComponentType<Config> => {
	class WithFilterForm extends PureComponent<Config & Props<Config>, State> {
		state = {
			fetchingFilterAttributes: false,
			filterAttributes: null,
			openingFilterForm: false
		};

		fetchFilterAttributes = async (source: SourceData) => {
			const {fetchingFilterAttributes} = this.state;

			if (!fetchingFilterAttributes) {
				this.setState({fetchingFilterAttributes: true, filterAttributes: null});

				const {value: classFqn} = source.value;
				const descriptor = this.getSourceDescriptor(source);
				const attrGroupCode = this.getAttrGroupCodeForSource(classFqn, descriptor);
				const filterAttributes = await this.getFilterAttributes(classFqn, attrGroupCode);

				this.setState({fetchingFilterAttributes: false, filterAttributes});
			}
		};

		generateRestriction = async (classFqn: string, attrGroupCode: string | null) => {
			const {sources} = this.props;
			const result = {};

			result[classFqn] = attrGroupCode ?? 'system';

			Object.keys(sources).forEach(key => {
				const sourceFilterAttributeGroup = getSourceFilterAttributeGroup(sources, key);

				result[key] = sourceFilterAttributeGroup ?? 'system';
			});

			return result;
		};

		getAttrGroupCodeForSource = (classFqn: string, descriptor: string): string | null => {
			const {isUserMode, sources} = this.props;
			let result = null;

			if (isUserMode) {
				// пользовательский режим
				// дескриптор у источника всегда выставлен
				const attrSetConditions = parseCasesAndGroupCode(descriptor);

				if (attrSetConditions) {
					result = attrSetConditions.attrGroupCode ?? null;
				}
			}

			if (!result) {
				const sourceFilterAttributeGroup = getSourceFilterAttributeGroup(sources, classFqn);

				if (sourceFilterAttributeGroup) {
					result = sourceFilterAttributeGroup;
				}
			}

			return result;
		};

		getFilterAttributes = async (classFqn: string, attrGroupCode: string | null) => {
			const {fetchGroupsAttributes} = this.props;
			const groupsAttributes = await fetchGroupsAttributes(classFqn, attrGroupCode ?? null);
			const {attributes: loadedAttributes, fetchAttributes} = this.props;
			let attributes = loadedAttributes[classFqn]?.options;

			if (!attributes) {
				attributes = await fetchAttributes(classFqn);
			}

			return attributes.filter(
				attribute => groupsAttributes.find(
					({attributeCode, metaClassCode}) =>
						attribute.code === attributeCode
						&& (attribute.declaredMetaClass ?? attribute.metaClassFqn) === metaClassCode
				)
			);
		};

		getSourceDescriptor = (source: SourceData) => {
			const {sourcesFilters} = this.props;
			const {descriptor, filterId} = source;
			let result = descriptor;

			if (filterId) {
				const filter = findFilter(sourcesFilters, source.value.value, filterId);

				if (filter) {
					result = filter;
				}
			}

			return result;
		};

		openFilterForm = async (source: SourceData) => {
			try {
				this.setState({openingFilterForm: true});

				const {value: classFqn} = source.value;
				const descriptor = this.getSourceDescriptor(source);
				const context: Context = descriptor
					? getFilterContext(descriptor, classFqn, getDescriptorCases)
					: createFilterContext(classFqn, getDescriptorCases);
				const options = await this.updateContext(context, classFqn, descriptor);

				this.setState({openingFilterForm: false});

				const {serializedContext} = await api.instance.filterForm.openForm(context, options);

				return serializedContext;
			} catch (e) {
				console.error('Filtration error: ', e);
			}

			return null;
		};

		updateContext = async (context: Context, classFqn: string, descriptor: string): Promise<FilterFormOptionsDTO> => {
			const {fetchGroupsAttributes, isUserMode} = this.props;
			const attrGroupCode = this.getAttrGroupCodeForSource(classFqn, descriptor);
			const options: FilterFormOptionsDTO = {
				restriction: null,
				useRestriction: attrGroupCode !== null
			};

			const groupsAttributes = await fetchGroupsAttributes(classFqn, attrGroupCode ?? null);

			if (groupsAttributes && groupsAttributes.length > 0) {
				context.attrCodes = groupsAttributes.map(attribute => `${attribute.metaClassCode}@${attribute.attributeCode}`);
				options.useRestriction = true;

				if (!isUserMode && attrGroupCode) {
					options.restriction = await this.generateRestriction(classFqn, attrGroupCode);
				}
			} else if (attrGroupCode) {
				context.attrGroupCode = attrGroupCode;
				options.useRestriction = true;
			}

			return options;
		};

		render () {
			const {parentProps} = this.props;
			const {fetchingFilterAttributes, filterAttributes, openingFilterForm} = this.state;
			return (
				<Component
					{...parentProps}
					fetchFilterAttributes={this.fetchFilterAttributes}
					fetchingFilterAttributes={fetchingFilterAttributes}
					filterAttributes={filterAttributes}
					openFilterForm={this.openFilterForm}
					openingFilterForm={openingFilterForm}
				/>
			);
		}
	}

	return connect(props, functions)(WithFilterForm);
};

export default withFilterForm;
