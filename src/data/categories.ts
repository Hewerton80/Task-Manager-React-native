import { ICategory }  from '../hooks/useCategory';
import IconList from '../images/list.png';
import IconWork from '../images/work.png';
import IconHome from '../images/home.png';
import IconTravel from '../images/travel.png';
import IconStudy from '../images/study.png';
import IconRecreation from '../images/recreation.png';
import IconBuy from '../images/buy.png';
import IconSport from '../images/sport.png';
import IconOther from '../images/other.png';

const CategoriesData: ICategory[] = [
    {
        id: 0,
        name: 'Todas',
        image: IconList,
        isAll: true
    },
    {
        id: 1,
        name: 'Casa',
        image: IconHome,
    },
    {
        id: 2,
        name: 'Trabalho',
        image: IconWork,
    },
    {
        id: 3,
        name: 'Viagem',
        image: IconTravel,
    },
    {
        id: 4,
        name: 'Estudo',
        image: IconStudy,
    },
    {
        id: 5,
        name: 'Lazer',
        image: IconRecreation,
    },
    {
        id: 6,
        name: 'Compras',
        image: IconBuy,
    },
    {
        id: 7,
        name: 'Esporte',
        image: IconSport,
    },
    {
        id: 8,
        name: 'Outra',
        image: IconOther,
    }
]

export default CategoriesData;