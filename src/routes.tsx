import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from './styles/colors';
import ListCategorys from './pages/ListCategoriesTasks';
import Tasks from './pages/Tasks';
import FormTask from './pages/FormTask';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ListCategorys"
          component={ListCategorys}
          options={{
            title: 'Categorias',
            headerTitleStyle: {
              fontFamily: 'roboto_500',
              fontSize: 24
            }
          }}
        />
        <Stack.Screen
          name='Tasks'
          component={Tasks}
          
          options={{
            headerShown: false,
            title: '',
            headerTitleStyle: {
              fontFamily: 'roboto_500',
              fontSize: 24,
              color: colors.primary
            },
            headerTintColor : colors.primary,
            headerStyle:{
                backgroundColor: colors.lightBlue,
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
            },
          }}

        />
        <Stack.Screen
          name='FormTask'
          component={FormTask}
          options={{
            title: 'Criar tarefa',
            headerTitleStyle: {
              fontFamily: 'roboto_500',
              fontSize: 24,
              color: colors.black
            },
            headerTintColor : colors.black,
            headerStyle:{
                backgroundColor: colors.secondary,
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
    
            },
            headerTitleContainerStyle:{
              paddingLeft: 25

            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;