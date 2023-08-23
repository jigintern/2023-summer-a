import type { Task, Tasks } from "../task.type";

const taskListMock: Tasks[] = [
        {
            id: 0,
            user: "shuya",
            completed: 80,
            tasks: [ // あとで実装するかも
                {
                    id: 0,
                    name: "漢字どりる40ページまで",
                    isCompleted: true
                }, 
                {
                    id: 1,
                    name: "漢字どりる80ページまで",
                    isCompleted: false
                },
            ]
        },
        {
            id: 1,
            user: "ooi",
            completed: 95,
            tasks: [ // あとで実装するかも
                {
                    id: 0,
                    name: "漢字どりる40ページまで",
                    isCompleted: true
                }, 
                {
                    id: 1,
                    name: "漢字どりる80ページまで",
                    isCompleted: true
                },
            ]
        },
	];

const tasksMockUser0: Tasks = {
    id: 0,
    user: "shuya",
    completed: 80,
    tasks: [
        {
            id: 0,
            name: "漢字どりる40ページまで",
            isCompleted: true
        }, 
        {
            id: 1,
            name: "漢字どりる80ページまで",
            isCompleted: false
        },
    ]
};

const tasksMockUser1: Tasks = {
    id: 1,
    user: "ooi",
    completed: 95,
    tasks: [
        {
            id: 0,
            name: "漢字どりる40ページまで",
            isCompleted: true
        }, 
        {
            id: 1,
            name: "漢字どりる80ページまで",
            isCompleted: true
        },
    ]
}

export { taskListMock, tasksMockUser0, tasksMockUser1 };