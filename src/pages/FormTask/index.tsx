import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import {
  Container,
  TextInputTask,
  InputButton,
  InputButtonContent,
  PickerCategory,
  PlaceHolder,
  BottomButton,
  BottomButtonContent
} from './styles';
import useCategory, { ICategory } from '../../hooks/useCategory';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';
import useTask from '../../hooks/useTask';
import { getFormatDate } from '../../utils';
import moment from 'moment';
import 'moment/locale/pt-br';
import BackGroundLoad from '../../components/BackGroundLoad';
import { Ionicons } from '@expo/vector-icons';
moment.locale('pt-br');

const FormTask: React.FC = () => {
  const route: any = useRoute();
  const navigation = useNavigation();
  const taskId: number | undefined = useMemo(() => route.params && route.params.taskId, [route]);
  const isEdit: boolean | undefined = useMemo(() => route.params && route.params.isEdit, [route]);
  const {
    createTask,
    getTaskById,
    editTask,
    task,
    isLoadingTask,
    isCreatingTask,
  } = useTask();

  const { getCategories, categories } = useCategory();
  const [taskName, setTaskName] = useState('');
  const [date, setDate] = useState<Date>(moment().toDate());
  const [mode, setMode] = useState<'date' | 'time' | undefined>('date');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [categorySelected, setCategorySelected] = useState<number | string>('first');
  const [isChangedDatePicker, setIsChangedDatePicker] = useState<boolean>(false);
  const [isChangedCategoryPicker, setIsChangedCategoryPicker] = useState<boolean>(false);

  useEffect(() => {
    let title = '';
    if(isEdit){
      title = 'Editar tarefa';
    }
    else{
      title = 'Criar tarefa';
    }
    navigation.setOptions({
      title,
    })
  }, [navigation, isEdit])

  useFocusEffect(
    useCallback(() => {
      getCategories();
      if (taskId !== undefined) {
        getTaskById(taskId);
      }
    }, [getCategories, taskId, route])
  )

  useEffect(() => {
    if (task) {
      console.log('task: ', task);
      setTaskName(task.name);
      setCategorySelected(task.categoryId);
      setDate(moment(task.deadline).toDate());
      setIsChangedDatePicker(true);
      setIsChangedCategoryPicker(true);
    }
  }, [task]);

  const categoriesPicker = useMemo<ICategory[]>(() => {
    const categoriesPickerTmp = [...categories.filter(c => !c.isAll)]
    if (!isChangedCategoryPicker) {
      return [{
        id: 'first',
        name: 'Categoria'
      }, ...categoriesPickerTmp];
    }
    return categoriesPickerTmp;
  }, [categories, isChangedCategoryPicker]);

  const isValidCreate = useMemo<boolean>(() => {
    return !!taskName && isChangedDatePicker && isChangedCategoryPicker
  }, [taskName, isChangedDatePicker, isChangedCategoryPicker])

  const handleChangeDateTime = useCallback((event: any, selectedDateTime: Date | undefined) => {
    const currentDateTime = selectedDateTime || date;
    const currentDateTimeMoment = moment(currentDateTime);
    if (mode === 'date' && selectedDateTime) {
      const year = currentDateTimeMoment.get('year');
      const month = currentDateTimeMoment.get('month');
      const day = currentDateTimeMoment.get('date');
      currentDateTimeMoment.set('year', year).set('month', month).set('date', day);
      setShowDateTimePicker(Platform.OS === 'ios');
      setDate(currentDateTimeMoment.toDate());
      setMode('time')
      setShowDateTimePicker(true);
    }
    else if (mode === 'time' && selectedDateTime) {
      const hours = currentDateTimeMoment.get('hours');
      const minutes = currentDateTimeMoment.get('minutes');
      currentDateTimeMoment.set('hours', hours).set('minutes', minutes);
      setShowDateTimePicker(Platform.OS === 'ios');
      setDate(currentDateTimeMoment.toDate());
      setIsChangedDatePicker(true);
    }
    else {
      setShowDateTimePicker(Platform.OS === 'ios');
    }
  }, [date, mode]);

  const showDatepicker = useCallback(() => {
    setShowDateTimePicker(true);
    setMode('date');
  }, []);

  const handleCreateTask = useCallback(async () => {
    const isCreated = await createTask({
      categoryId: categorySelected,
      name: taskName,
      deadline: date
    })
    if (isCreated) {
      navigation.navigate('ListCategorys');
    }
  }, [createTask, date, navigation, categorySelected, taskName]);

  const handleEditTask = useCallback(async () => {
    const isCreated = await editTask({
      taskId: taskId as number,
      categoryId: categorySelected,
      name: taskName,
      deadline: date
    })
    if (isCreated) {
      navigation.navigate('Tasks', { categoryId: categorySelected });
    }
  }, [editTask, date, navigation, categorySelected, taskName, taskId]);

  if (taskId && (!task || isLoadingTask)) {
    return <BackGroundLoad />
  }

  return (
    <>
      <Container>
        <TextInputTask
          value={taskName}
          placeholder={'O que você está planejando?'}
          onChangeText={(text: React.SetStateAction<string>) => setTaskName(text)}
        />
        <InputButton
          onPress={showDatepicker}
        >
          <InputButtonContent>
            {/* <Icon source={isChangedDatePicker ? NotificationBlueIcon : NotificationGreyIcon} /> */}
            <Ionicons name="md-notifications-sharp" size={24} color={isChangedDatePicker ? colors.lightBlue : colors.grey} style={{ marginRight: 20 }} />
            <PlaceHolder
              style={{
                color: isChangedDatePicker ? colors.black : colors.grey
              }}
            >
              {getFormatDate(date)}
            </PlaceHolder>
          </InputButtonContent>
        </InputButton>

        <PickerCategory>
          <InputButtonContent>
            {/* <Icon
              source={isChangedCategoryPicker ? CategoryBlueIcon : CategoryGreyIcon}
              style={{
                marginRight: 13
              }}
            /> */}
            <Ionicons name="md-pricetag" size={24} color={isChangedCategoryPicker ? colors.lightBlue : colors.grey} style={{ marginRight: 12 }} />

            <Picker
              selectedValue={categorySelected}
              mode='dropdown'
              style={{
                width: 250,
                color: isChangedCategoryPicker ? colors.black : colors.grey,
                fontSize: 18
              }}
              itemStyle={{
                fontSize: 18
              }}
              onValueChange={(itemValue) => {
                setIsChangedCategoryPicker(true);
                setCategorySelected(itemValue)
              }}>
              {categoriesPicker.map(category => (
                <Picker.Item key={category.name} label={category.name} value={category.id} />

              ))}
            </Picker>
          </InputButtonContent>
        </PickerCategory>

        {showDateTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display={mode === 'time' ? 'spinner' : 'default'}
            onChange={(e, selectedDateTime) => handleChangeDateTime(e, selectedDateTime)}
            minimumDate={moment().toDate()}
            locale='pt-br'
          />
        )}
      </Container>
      {
        isValidCreate && (
          <BottomButton
            onPress={() => {
              if (!isCreatingTask) {
                if (isEdit) {
                  handleEditTask();
                }
                else {
                  handleCreateTask();
                }
              }
            }}
          >
            <BottomButtonContent>
              {isEdit ? 'Editar' : 'Criar'} tarefa
            </BottomButtonContent>
          </BottomButton>
        )}
    </>
  );
};

export default FormTask;
