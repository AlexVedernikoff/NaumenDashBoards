// @flow
export type Components = Object;

export type InjectedProps = {
	getComponents: (components: Components) => Components
};
