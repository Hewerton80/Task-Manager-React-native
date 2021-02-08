import { arrayMonths, arrayWeekDays } from "../config/vars";
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native'
import Constants from 'expo-constants';
import moment from 'moment';
import 'moment/locale/pt-br';
import { ITask } from "../hooks/useTask";
moment.locale('pt-br');

export const getFormatDate = (date: Date | string) => {
    const dateMoment = moment(date);
    const month = dateMoment.get('months');
    const dayOfWeek = dateMoment.get('day');
    const dayOfMont = dateMoment.get('date');
    return `${dateMoment.format('hh:mm')} ${arrayWeekDays[dayOfWeek]}, ${dayOfMont} de ${arrayMonths[month]}`
}

//https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//https://docs.expo.io/versions/v40.0.0/sdk/notifications/
export const schedulePushNotification = async ({ categoryId, deadline, name }: ITask) => {
    const now = moment();
    const future = moment(deadline);
    const diffSeconds = future.diff(now, 'seconds');
    if (diffSeconds > 0) {
        const info = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Notificação de tarefa ⏱️📌🗒️",
                body: name,
                data: { categoryId },
            },
            trigger: { seconds: diffSeconds },
        });
        console.log(diffSeconds);
    }
}

export const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    return token;
}