// @flow

export const getLinkedAttributesKey = (parentClassFqn: string, classFqn: string): string =>
	`${parentClassFqn}::${classFqn}`;
