export type UserItem = {
    code: string,
    ganttMaster: boolean,
    name: string
}

export type User = {
    department: string,
    innerDepartments: Departments,
    showUsers: boolean,
    users: UserItem[],
};

export type Departments = User[];
