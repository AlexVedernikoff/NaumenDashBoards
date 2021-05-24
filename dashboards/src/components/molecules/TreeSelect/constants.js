// @flow
import Container from 'components/atoms/Container';
import Node from './components/Node';
import SearchInput from 'components/atoms/SearchInput';
import Tree from './components/Tree';

const DEFAULT_COMPONENTS = {
	IndicatorsContainer: Container,
	LabelContainer: Container,
	MenuContainer: Container,
	Node,
	SearchInput,
	Tree,
	ValueContainer: Container
};

export {
	DEFAULT_COMPONENTS
};
