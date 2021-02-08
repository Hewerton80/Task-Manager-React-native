import { useCallback, useState } from 'react';
import asyncStorage from '@react-native-async-storage/async-storage';
import {  getRandomInt, schedulePushNotification } from '../utils'
import useCategory from './useCategory';
export interface ITask {
    id: number | string;
    name: string;
    deadline: Date | string;
    categoryId: number | string;
    done: boolean;

}

export interface ICreateTaskDto {
    categoryId: number | string;
    name: string;
    deadline: Date | string;
}

export interface IEditTaskDto {
    taskId: number | string;
    categoryId: number | string;
    name: string;
    deadline: Date | string;
}

const useTask = () => {

    const [task, setTask] = useState<ITask | null | undefined>(null);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(false);
    const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false);
    const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
    const [isDeletingTask, setIsDeletingTask] = useState<boolean>(false);
    const [isDoingTask, setIsDoingTask] = useState<boolean>(false);

    const getAllTaksFromStorage = useCallback(async ()=>{
        let tasksFoundFromCash = await asyncStorage.getItem('@tasks');
        if(!tasksFoundFromCash){
            await asyncStorage.setItem('@tasks', JSON.stringify(JSON.stringify([])));
            tasksFoundFromCash = await asyncStorage.getItem('@tasks');
        }
        const tasksParsed: ITask[] = JSON.parse(tasksFoundFromCash as string);
        if(!Array.isArray(tasksParsed)){
            return [];
        }
        return tasksParsed;
    },[])

    const createTask = useCallback(async ({ categoryId, name, deadline }: ICreateTaskDto) => {
        setIsCreatingTask(true);
        try {
            const tasksFound = await getTasks();
            const newTask: ITask = {
                id: getRandomInt(0, 1000000),
                name,
                deadline,
                categoryId,
                done: false
            }
            
            const tasksFoundWithNewTaks = [...tasksFound, newTask];
            await asyncStorage.setItem('@tasks',JSON.stringify(tasksFoundWithNewTaks));
            await schedulePushNotification(newTask);
            return true;
        }
        catch (err) {
            alert('ops, tarefa não pôde ser criada');
            return false;
        }
    }, []);

    const editTask = useCallback(async ({ taskId, categoryId, name, deadline }: IEditTaskDto) => {
        try {
            setIsCreatingTask(true);
            const tasksFound = await getAllTaksFromStorage();
            const index = tasksFound.findIndex(t => String(t.id) === String(taskId))
            tasksFound[index].categoryId = categoryId;
            tasksFound[index].name = name;
            tasksFound[index].deadline = deadline;
            await asyncStorage.setItem('@tasks',JSON.stringify(tasksFound));
            return true;
        }
        catch (err) {
            alert('ops, tarefa não pôde ser criada');
            return false;
        }
    }, [getAllTaksFromStorage]);

    const getTasksByCategoryId = useCallback(async (idCategory: number | string) => {
        setIsLoadingTasks(true);
        try{
            const tasksFound = await getAllTaksFromStorage();
            const taskFromCategory = tasksFound.filter(t => t.categoryId === idCategory || Number(idCategory) === 0);
            setTasks(taskFromCategory);
            setIsLoadingTasks(false);
            return taskFromCategory;
        }
        catch(err){
            console.error(err);
            setIsLoadingTasks(false);
            return [] as ITask[];
        }
    }, [getAllTaksFromStorage]);

    const getTasks  = useCallback(async () => {
        setIsLoadingTasks(true);
        try{
            const tasksFound = await getAllTaksFromStorage();
            setTasks(tasksFound);
            setIsLoadingTasks(false);
            return tasksFound;
        }
        catch(err){
            console.error(err);
            return [] as ITask[];
        }
    }, [getAllTaksFromStorage]);

    const getTaskById  = useCallback(async (taskId: string | number) => {
        setIsLoadingTasks(true);
        try{
            const tasksFound = await getAllTaksFromStorage();
            const taskFound = tasksFound.find(t => String(t.id) === String(taskId))
            setTask(taskFound);
            setIsLoadingTasks(false);
        }
        catch(err){
            console.error(err);
            setIsLoadingTasks(false);
        }
    }, [getAllTaksFromStorage]);

    const deleteTasks  = useCallback(async (idsTasksToDelete: string[]) => {
        setIsDeletingTask(true);
        try{
            const tasksFound = await getAllTaksFromStorage();
            const restTasks = tasksFound.filter(task => !idsTasksToDelete.includes(String(task.id)));
            await asyncStorage.setItem('@tasks', JSON.stringify(restTasks));
            setIsDeletingTask(false);
            return true;
        }
        catch(err){
            console.error(err);
            setIsDeletingTask(false);
            return false;
        }
    }, [getAllTaksFromStorage]);

    const toDoTasks  = useCallback(async (idsTasksToDone: string[]) => {
        setIsDoingTask(true);
        try{
            const tasksFound = await getAllTaksFromStorage();
            tasksFound.forEach(task => {
                if(idsTasksToDone.includes(String(task.id))){
                    task.done = true;
                }
            });
            await asyncStorage.setItem('@tasks', JSON.stringify(tasksFound));
            setIsDoingTask(false);
            return true;
        }
        catch(err){
            console.error(err);
            setIsDoingTask(false);
            return false;
        }
    }, [getAllTaksFromStorage]);

    return { 
        task, 
        tasks, 
        isCreatingTask, 
        isLoadingTasks,
        isLoadingTask,
        isDeletingTask,
        isDoingTask,
        getTasks, 
        getTasksByCategoryId,
        deleteTasks,
        createTask,
        editTask,
        getTaskById,
        toDoTasks
    };
}
export default useTask;