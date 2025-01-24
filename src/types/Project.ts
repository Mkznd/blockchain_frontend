export enum ProjectStatus { Active, Successful, Failed, Withdrawn }

export default interface Project {
    projectId: bigint;
    owner: string;
    name: string;
    description: string;
    goal: bigint;
    fundsRaised: bigint;
    deadline: bigint;
    token: string;
    status: ProjectStatus;
    exists: boolean;
}
