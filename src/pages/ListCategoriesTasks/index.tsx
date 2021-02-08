import React, { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import useCategory from '../../hooks/useCategory';
import BackGroundLoad from '../../components/BackGroundLoad';
import {
  Container,
  CategoriesContainer,
  CategoryNameContainer,
  CategoryWraper,
  Category,
  CategoryIconContainer,
  CategoryName,
  CategoryNumberTasksContainer,
  ImageCategory,
  CategoryNumberTasks,
  FloatingButton,
} from './styles';
import { registerForPushNotificationsAsync } from '../../utils';
import colors from '../../styles/colors';
import { FontAwesome5 } from '@expo/vector-icons';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const ListCategorys: React.FC = () => {
  const { getCategories, categories, isLoadingCategories } = useCategory();

  useFocusEffect(
    useCallback(() => {
      getCategories();
    }, [])
  );

  const navigation = useRef(useNavigation()).current;
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    //passso 01: obter token
    registerForPushNotificationsAsync().then(token => console.log('token: ', token));

    //passo 03: quando a notificação chega no celular
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação checgou: ')
    });

    //quando o usuário clica na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { categoryId }: any = response && response.notification.request.content.data;

      console.log('response: ', categoryId);
      navigation.navigate('Tasks', { categoryId });
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener as any);
      Notifications.removeNotificationSubscription(responseListener as any);
    };
  }, []);

  const handleNavegateToTasks = useCallback((categoryId: number | string) => {
    navigation.navigate('Tasks', { categoryId });
  }, [navigation]);

  const handleNavigationToCreateTask = useCallback(() => {
    navigation.navigate('FormTask');
  }, [navigation]);

  //Sumir com o header enquando a tela carrega
  useEffect(() => {
    navigation.setOptions({
      headerShown: !isLoadingCategories
    })
  }, [navigation, isLoadingCategories])

  if (isLoadingCategories || categories.length === 0) {
    return <BackGroundLoad />
  }

  return (
    <>
      <Container>
        <CategoriesContainer>
          {categories.map((category, i) => (
            <CategoryWraper
              key={category.id}
              isLeft={i % 2 === 0}
              style={{
                elevation: 5, // shadow on Android
                shadowOpacity: 5, // shadow on iOS
              }}
            >
              <Category
                onPress={() => handleNavegateToTasks(category.id)}
              >
                <CategoryIconContainer>
                  {/* <MaterialCommunityIcons name="clipboard-list-outline" size={30} color={colors.blue} /> */}
                  <ImageCategory source={category.image} />
                </CategoryIconContainer>
                <CategoryNameContainer>
                  <CategoryName>
                    {category.name}
                  </CategoryName>
                </CategoryNameContainer>
                <CategoryNumberTasksContainer>
                  <CategoryNumberTasks>
                    {category.tasks?.length} Tarefa(s)
                  </CategoryNumberTasks>
                </CategoryNumberTasksContainer>
              </Category>
            </CategoryWraper>
          ))}
        </CategoriesContainer>
      </Container>

      <FloatingButton
        onPress={() => handleNavigationToCreateTask()}
        style={{
          elevation: 8, // shadow on Android
          shadowOpacity: 8, // shadow on iOS
        }}
      >
        {/* <IconPlus
          source={plusIcon}
        /> */}
        <FontAwesome5 name="plus" size={24} color={colors.primary} />
      </FloatingButton>

    </>
  );
};

export default ListCategorys;
