import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { StatusBar, Animated } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import useCategory from '../../hooks/useCategory';
import useTask, { ITask } from '../../hooks/useTask';
import { getFormatDate } from '../../utils';
import BackGroundLoad from '../../components/BackGroundLoad';
import { AntDesign, MaterialIcons, FontAwesome5, Feather  } from '@expo/vector-icons'; 
import {
  Container,
  HeaderContainer,
  Header,
  HeaderContent,
  HeaderTitle,
  HeaderActions,
  HeaderBadgeIcon,
  HeaderIConButton,
  ImageCategory,
  InfoCategory,
  CategoryName,
  CategoryNumberTasks,
  TasksContainer,
  ListTasks,
  InfoTask,
  TaskName,
  TaskDate,
  TaskCheckBox,
  TasksTabWrap,
  TaskButton,
  TaskButtonContent,
  TasksTabs,
  TaskButtonContentBadg,
  TaskButtonContentBadgContent,
  BottomButton,
  BottomButtonContent
} from './styles';
import colors from '../../styles/colors';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');

const AnimatedBottomButton = Animated.createAnimatedComponent(BottomButton)

interface ITaskInfo extends ITask {
  selected?: boolean;
}

const Task: React.FC = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const { category, getCategoryById } = useCategory();
  const {
    getTasksByCategoryId,
    deleteTasks,
    toDoTasks,
    tasks,
    isDeletingTask,
    isLoadingTasks,
    isDoingTask
  } = useTask();
  const translateAnim = useRef(new Animated.Value(55)).current;  // Initial value for translateY: 55

  const [tasksInfo, setTasksInfo] = useState<ITaskInfo[]>([]);
  const [showTasksInfos, setShowTasksInfos] = useState<boolean[]>([
    true, //isTasksIsToLate
    false, //isTaskToDay
    false, //isTasksTomorrow
    false, //isTasksAfterTomorrow
    false, //isTaskDone
  ])
  const handleSelectTaks = useCallback((idTask: number | string) => {
    const tasksInfoTmp = [...tasksInfo];
    const idextaskFound = tasksInfoTmp.findIndex(task => String(task.id) === String(idTask));
    tasksInfoTmp[idextaskFound].selected = !tasksInfoTmp[idextaskFound].selected;
    setTasksInfo(() => tasksInfoTmp);
  }, [tasksInfo]);

  useFocusEffect(
    useCallback(() => {
      const categoryId: number = route.params.categoryId;
      getCategoryById(categoryId);
      getTasksByCategoryId(categoryId);
    }, [getCategoryById, route.params?.categoryId])
  );

  useEffect(() => {
    setTasksInfo(tasks)
  }, [tasks]);

  const handleChangeTab = useCallback((index: number) => {
    const showTasksInfosTmp = [...showTasksInfos];
    showTasksInfosTmp.forEach((showtasks, i) => {
      if (i === index) {
        showTasksInfosTmp[i] = true;
      }
      else {
        showTasksInfosTmp[i] = false;
      }
    })
    setShowTasksInfos(() => showTasksInfosTmp);
  }, [showTasksInfos]);

  const handleEditTask = useCallback(() => {
    const taskSelected = tasksInfo.find(t => !!t.selected) as ITaskInfo;
    const taskId = taskSelected.id
    navigation.navigate('FormTask', { taskId, isEdit: true })
  }, [navigation, tasksInfo]);

  const handleDeleteTasks = useCallback(async () => {
    const idsSelectedsTasks: string[] = [];
    const tasksInfoTmp = [...tasksInfo]
    tasksInfoTmp.forEach(task => {
      if (task.selected) {
        idsSelectedsTasks.push(String(task.id));
      }
    })
    const isDeleted = await deleteTasks(idsSelectedsTasks);
    if (isDeleted) {
      const categoryId: number = route.params.categoryId;
      getCategoryById(categoryId);
      getTasksByCategoryId(categoryId);
    }
  }, [getCategoryById, getTasksByCategoryId, deleteTasks, route, tasksInfo])

  const handleToDoTasks = useCallback(async () => {
    const idsSelectedsTasks: string[] = [];
    const tasksInfoTmp = [...tasksInfo]
    tasksInfoTmp.forEach(task => {
      if (task.selected) {
        idsSelectedsTasks.push(String(task.id));
      }
    })
    const isDoit = await toDoTasks(idsSelectedsTasks);
    if (isDoit) {
      const categoryId: number = route.params.categoryId;
      getCategoryById(categoryId);
      getTasksByCategoryId(categoryId);
    }
  }, [getCategoryById, getTasksByCategoryId, toDoTasks, route, tasksInfo])

  const tasksIsToLate = useMemo(() => {
    const now = moment();
    return tasksInfo.filter(task => {
      const taskDeadline = moment(task.deadline);
      const isAfter = now.isAfter(taskDeadline);
      return isAfter && !task.done;
    })
  }, [tasksInfo]);

  const taskToDay = useMemo(() => {
    const now = moment();
    const dayOfYear = now.get('dayOfYear');
    const year = now.get('year')
    return tasksInfo.filter(task => {
      const taskDeadline = moment(task.deadline);
      const dayOfYearTaksDeadline = taskDeadline.get('dayOfYear');
      const yearTaksDeadline = taskDeadline.get('year');
      const isBefore = now.isBefore(taskDeadline);
      return dayOfYear === dayOfYearTaksDeadline && year === yearTaksDeadline && isBefore && !task.done;
    });
  }, [tasksInfo]);

  const tasksTomorrow = useMemo(() => {
    const tomorrow = moment().add(1, 'days');
    const dayOfYear = tomorrow.get('dayOfYear');
    const year = tomorrow.get('year')
    return tasksInfo.filter(task => {
      const taskDeadline = moment(task.deadline);
      const dayOfYearTaksDeadline = taskDeadline.get('dayOfYear');
      const yearTaksDeadline = taskDeadline.get('year');
      return dayOfYear === dayOfYearTaksDeadline && year === yearTaksDeadline && !task.done;
    });
  }, [tasksInfo]);

  const tasksAfterTomorrow = useMemo(() => {
    const afterTomorrow = moment().add(1, 'days').startOf('days');
    return tasksInfo.filter(task => {
      const taskDeadline = moment(task.deadline).startOf('days');
      //console.log('deadline: ', taskDeadline, taskDeadline.isAfter(afterTomorrow));
      return taskDeadline.isAfter(afterTomorrow) && !task.done;
    })
  }, [tasksInfo]);

  const tasksDone = useMemo(() => tasksInfo.filter(task => task.done), [tasksInfo]);

  const countTasksSelected = useMemo(() =>
    tasksInfo.reduce((total, task) => {
      if (task.selected) {
        return total + 1;
      }
      else {
        return total;
      }
    }, 0)
    , [tasksInfo]);

  const countTasksDoNotDoneSelected = useMemo(() =>
    tasksInfo.reduce((total, task) => {
      if (task.selected && !task.done) {
        return total + 1;
      }
      else {
        return total;
      }
    }, 0)
    , [tasksInfo]);

  useEffect(() => {
    if (countTasksDoNotDoneSelected > 0) {
      Animated.timing(
        translateAnim, {
        toValue: 0,
        duration: 150,
        // easing: Easing.,
        useNativeDriver: true
      }
      ).start();
    }
  }, [translateAnim, countTasksDoNotDoneSelected])


  if (!category || isLoadingTasks) {
    return <BackGroundLoad />
  }
  if (isDeletingTask) {
    return <BackGroundLoad />
  }
  return (
    <>
      <StatusBar
        backgroundColor={colors.lightBlue}
      />
      <Header>
        <HeaderIConButton onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color={colors.primary} />
          {/* <HeaderBackIcon source={ArrowLeftIcon} /> */}
        </HeaderIConButton>
        <HeaderContent>
          <HeaderTitle> {countTasksSelected > 0 ? `${countTasksSelected} Selecionada(s)` : ''}  </HeaderTitle>
          <HeaderActions>
            {countTasksSelected === 1 && (
              <HeaderIConButton 
                onPress={handleEditTask}
              >
                <MaterialIcons name="edit" size={24} color={colors.primary} />
                {/* <HeaderBackIcon source={EditIcon} /> */}
              </HeaderIConButton>
            )}
            {countTasksSelected > 0 && (
              <HeaderIConButton 
                onPress={handleDeleteTasks}
              >
                <FontAwesome5 name="trash" size={18} color={colors.primary} />
                {/* <HeaderBackIcon source={TrashIcon} /> */}
              </HeaderIConButton>
            )}
          </HeaderActions>
        </HeaderContent>
      </Header>
      <HeaderContainer>


        <HeaderBadgeIcon>
          <ImageCategory source={category.image} />
        </HeaderBadgeIcon>
        <InfoCategory>
          <CategoryName>
            {category.name}
          </CategoryName>
          <CategoryNumberTasks>{tasksInfo.length} Tarefa(s)</CategoryNumberTasks>
        </InfoCategory>
      </HeaderContainer>

      <TasksTabWrap
        horizontal
      >
        <TasksTabs>
          <TaskButton
            onPress={() => handleChangeTab(0)}
            selected={showTasksInfos[0]}
          >
            <TaskButtonContent selected={showTasksInfos[0]}> Atrasadas</TaskButtonContent>
            <TaskButtonContentBadg selected={showTasksInfos[0]}>
              <TaskButtonContentBadgContent selected={showTasksInfos[0]}>{tasksIsToLate.length}</TaskButtonContentBadgContent>
            </TaskButtonContentBadg >
          </TaskButton>

          {taskToDay.length > 0 &&
            <TaskButton
              onPress={() => handleChangeTab(1)}
              selected={showTasksInfos[1]}
            >
              <TaskButtonContent selected={showTasksInfos[1]}>Para fazer hoje</TaskButtonContent>
              <TaskButtonContentBadg selected={showTasksInfos[1]}>
                <TaskButtonContentBadgContent selected={showTasksInfos[1]}>{taskToDay.length}</TaskButtonContentBadgContent>
              </TaskButtonContentBadg>
            </TaskButton>
          }

          {tasksTomorrow.length > 0 &&
            <TaskButton
              onPress={() => handleChangeTab(2)}
              selected={showTasksInfos[2]}
            >
              <TaskButtonContent selected={showTasksInfos[2]}>Para fazer amanhã</TaskButtonContent>
              <TaskButtonContentBadg selected={showTasksInfos[2]}>
                <TaskButtonContentBadgContent selected={showTasksInfos[2]}>{tasksTomorrow.length}</TaskButtonContentBadgContent>
              </TaskButtonContentBadg>
            </TaskButton>
          }
          {tasksAfterTomorrow.length > 0 &&
            <TaskButton
              onPress={() => handleChangeTab(3)}
              selected={showTasksInfos[3]}
            >
              <TaskButtonContent selected={showTasksInfos[3]}>Para fazer</TaskButtonContent>
              <TaskButtonContentBadg selected={showTasksInfos[3]}>
                <TaskButtonContentBadgContent selected={showTasksInfos[3]}>{tasksAfterTomorrow.length}</TaskButtonContentBadgContent>
              </TaskButtonContentBadg>
            </TaskButton>
          }

          <TaskButton
            onPress={() => handleChangeTab(4)}
            selected={showTasksInfos[4]}
          >
            <TaskButtonContent selected={showTasksInfos[4]}> Feitas</TaskButtonContent>
            <TaskButtonContentBadg selected={showTasksInfos[4]}>
              <TaskButtonContentBadgContent selected={showTasksInfos[4]}>{tasksDone.length}</TaskButtonContentBadgContent>
            </TaskButtonContentBadg>
          </TaskButton>

        </TasksTabs>
      </TasksTabWrap>


      <Container>
        <TasksContainer>
          {
            showTasksInfos[0] && tasksIsToLate.map(task => (
              <ListTasks
                key={task.id + task.name}
                onPress={() => handleSelectTaks(task.id)}

              >
                <InfoTask>
                  <TaskName numberOfLines={1}>
                    {task.name}
                  </TaskName>
                  <TaskDate>
                    {getFormatDate(task.deadline)}
                  </TaskDate>
                </InfoTask>
                <TaskCheckBox>
                  <CheckBox
                    value={!!task.selected}
                  />
                </TaskCheckBox>
              </ListTasks>

            ))
          }
          {
            showTasksInfos[1] && taskToDay.map(task => (
              <ListTasks
                key={task.id + task.name}
                onPress={() => handleSelectTaks(task.id)}
              >
                <InfoTask>
                  <TaskName numberOfLines={1}>
                    {task.name}
                  </TaskName>
                  <TaskDate>
                    {getFormatDate(task.deadline)}
                  </TaskDate>
                </InfoTask>
                <TaskCheckBox>
                  <CheckBox
                    value={!!task.selected}
                  />
                </TaskCheckBox>
              </ListTasks>
            ))
          }

          {
            showTasksInfos[2] && tasksTomorrow.map(task => (
              <ListTasks
                key={task.id + task.name}
                onPress={() => handleSelectTaks(task.id)}
              >
                <InfoTask>
                  <TaskName numberOfLines={1}>
                    {task.name}
                  </TaskName>
                  <TaskDate>
                    {getFormatDate(task.deadline)}
                  </TaskDate>
                </InfoTask>
                <TaskCheckBox>
                  <CheckBox
                    value={!!task.selected}
                  />
                </TaskCheckBox>
              </ListTasks>

            ))
          }
          {
            showTasksInfos[3] && tasksAfterTomorrow.map(task => (
              <ListTasks
                key={task.id + task.name}
                onPress={() => handleSelectTaks(task.id)}
              >
                <InfoTask>
                  <TaskName numberOfLines={1}>
                    {task.name}
                  </TaskName>
                  <TaskDate>
                    {getFormatDate(task.deadline)}
                  </TaskDate>
                </InfoTask>
                <TaskCheckBox>
                  <CheckBox
                    value={!!task.selected}
                  />
                </TaskCheckBox>
              </ListTasks>
            ))
          }
          {
            showTasksInfos[4] && tasksDone.map(task => (
              <ListTasks
                key={task.id + task.name}
                onPress={() => handleSelectTaks(task.id)}
              >
                <InfoTask>
                  <TaskName numberOfLines={1}>
                    {task.name}
                  </TaskName>
                  <TaskDate>
                    {getFormatDate(task.deadline)}
                  </TaskDate>
                </InfoTask>
                <TaskCheckBox>
                  <CheckBox
                    value={!!task.selected}
                  />
                </TaskCheckBox>
              </ListTasks>
            ))
          }
        </TasksContainer>
      </Container>
      {
        countTasksDoNotDoneSelected > 0 && (
          <BottomButton
            onPress={() => !isDoingTask && handleToDoTasks()}
            style={{
              transform: [{
                translateY: translateAnim
              }]
            }}
          >
            <BottomButtonContent>
              Marcar como feito <Feather name="check" size={24} color={colors.primary} />
              </BottomButtonContent>
          </BottomButton>
          )}
    </>
  );
};

export default Task;
