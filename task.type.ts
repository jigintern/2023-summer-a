export interface Task {
	id: number;
	name: string;
	isCompleted: boolean;
}

export interface Tasks {
	id: number;
	user: string;
	completed: number;
	tasks: Task[];
}