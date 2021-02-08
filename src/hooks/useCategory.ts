import { useCallback, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import CategoriesData from '../data/categories';
import useTask, { ITask } from './useTask';

export interface ICategory {
    id: number | string;
    name: string;
    image?: ImageSourcePropType;
    icon?: any;
    isAll?: boolean;
    tasks?: ITask[];
}

const useCategory = () => {

    const { getTasksByCategoryId, getTasks } = useTask();

    const [category, setCategory] = useState<ICategory | null | undefined>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

    const getCategoryById = useCallback((idCategory: number) => {
        setCategory(null);
        const categoryFound = CategoriesData.find(category => category.id === idCategory);
        setCategory(categoryFound);
    }, []);
    
    const getCategories = useCallback(async () => {
        setIsLoadingCategories(true);

        try{
            const categories = await Promise.all([...CategoriesData].map(async category=>{
                if(category.isAll){
                    category.tasks = await getTasks();
                }
                else{
                    category.tasks = await getTasksByCategoryId(category.id);
                }
                return category;
            }))
            setCategories(categories);
        }
        catch(err){
            console.error(err);
        }

        setIsLoadingCategories(false);
    }, [getTasksByCategoryId]);

    return { category, categories, isLoadingCategories, getCategories, getCategoryById };
}
export default useCategory;