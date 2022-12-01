// @flow
export type UserData = {
	admin: boolean,
	licensed: boolean,
	login: string,
	roles: string[],
	title: string,
	uuid: string
};

export type Context = {
	contentCode: string,
	contentsParameters: string | null,
	currentUser: UserData,
	subjectUuid: string
};
