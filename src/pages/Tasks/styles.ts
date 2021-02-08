import styled from 'styled-components/native';
import { Dimensions, Platform, Animated } from 'react-native';
import Constants from 'expo-constants';
import colors from '../../styles/colors';
import { BaseButton, TouchableOpacity, BorderlessButton } from 'react-native-gesture-handler';

//console.log('Constants: ',Constants);
const statusBarHeigth = Platform.OS === 'android' ? Constants.statusBarHeight : 0;
const widthWindow = Dimensions.get('window').width;
const heightWindow = Dimensions.get('window').height;
const HeaderPaddingRigth = widthWindow * 0.11835748792270531400966183574879;
//const ContainerBorderRadios = widthWindow * 0.04830917874396135265700483091787;
const ContainerPadding = widthWindow * 0.09661835748792270531400966183575;
const HeaderHeight = 112;
const HeaderIConButtonWidth = 52;
// console.log('heightWindow: ', heightWindow);
// console.log('heightWindow - HeaderHeight: ', heightWindow - HeaderHeight);

export const Header = styled.View`
    /* margin-top: ${statusBarHeigth}px; */
    flex-direction: row;
    background: ${colors.lightBlue};
    height: 55.5px;
    align-items: center;
    width: ${widthWindow}px;
`;
export const HeaderContainer = styled.View`
    padding: 20px ${HeaderPaddingRigth}px;
    flex-direction: row;
    background: ${colors.lightBlue};
    height: ${HeaderHeight}px;
`;
export const HeaderContent = styled.View`
    width: ${widthWindow - HeaderIConButtonWidth}px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
export const HeaderTitle = styled.Text`
    font-size: 24px;
    color: ${colors.primary};
`;
export const HeaderActions = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
`;

export const HeaderIConButton = styled(BorderlessButton)`
    width: ${HeaderIConButtonWidth}px;
    height: 30px;
    align-items: center;
    justify-content: center;
`;

export const HeaderBadgeIcon = styled.View`
    height: 60px;
    width: 60px;
    background: ${colors.primary};
    border-radius: 30px;
    margin-right: 15px;
    margin-bottom: 12px;
    align-items: center;
    justify-content: center;

`;

export const InfoCategory = styled.View`
    height: 30px;
`;

export const ImageCategory = styled.Image`
    width: 30px;
    height: 30px;
`;
export const CategoryName = styled.Text`
    font-family: 'roboto_500';
    font-size: 28px;
    color: ${colors.primary};
    font-family: 'roboto_500';
    font-weight: bold;
    align-items: flex-start;
`;
export const CategoryNumberTasks = styled.Text`
    font-size: 20px;
    color: ${colors.grey};
    font-family: 'roboto_300';
`;

export const Container = styled.ScrollView`
    background: ${colors.primary};
    background: ${colors.lightBlue};
`;

export const TasksContainer = styled.ScrollView`
    min-height: ${heightWindow - HeaderHeight}px;
    background: ${colors.primary};
    padding: 4px;
   
`;
export const TasksTabWrap = styled.ScrollView`
    border-bottom-width: 1px;
    border-bottom-color: ${colors.grey};
    background-color: ${colors.primary};

`;
export const TasksTabs = styled.View`
    flex-direction: row;
    align-items: center;
    padding-left: ${ContainerPadding}px;
`;
export const TaskButton = styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    flex-direction: row;
    border-radius: 70px;
    padding: 4px 6px;
    border-width: 2px;
    border-color: ${colors.lightBlue};
    margin: 20px 0;
    margin-right: 5px;
    background: ${(props: any) => props.selected? colors.lightBlue: colors.primary };
`;
export const TaskButtonContent = styled.Text`
    font-family: 'roboto_300';
    font-size: 18px;
    color: ${(props: any) => props.selected? colors.primary: colors.lightBlue };
    font-weight: bold;
    margin-right: 4px;
`;
export const TaskButtonContentBadg = styled.View`
    background: ${(props: any) => props.selected? colors.primary: colors.lightBlue };
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    border-radius: 10px;
`;
export const TaskButtonContentBadgContent = styled.Text`
    font-family: 'roboto_300';
    font-size: 16px;
    color: ${(props: any) => props.selected? colors.lightBlue: colors.primary };
    font-weight: bold;
`;

export const ListTasks = styled(BaseButton).attrs(() => ({
    rippleColor: colors.black
}))`
    flex-direction: row;
    justify-content: space-between;
    padding-left: ${ContainerPadding}px;
    margin-top: 5px;
`;

export const InfoTask = styled.View`
    flex: .8;
    padding-right: ${ContainerPadding / 2}px;
    padding-bottom: 5px;

`;

export const TaskCheckBox = styled.View`
    flex: .2;
    padding-right: ${ContainerPadding}px;
    padding-top: 2px;
    align-items: flex-end;
`;

export const TaskName = styled.Text`
    font-family: 'roboto_300';
    font-size:20px;
    color: ${colors.black};
`;

export const TaskDate = styled.Text`
    font-family: 'roboto_300';
    font-size:18px;
    color: ${colors.grey};
`;

export const BottomButton = Animated.createAnimatedComponent(styled(BaseButton).attrs(() => ({
    rippleColor: colors.primary
}))`
    background: ${colors.lightBlue};
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom:0;
    width: ${widthWindow}px;
    height:55px;
`);

export const BottomButtonContent = styled.Text`
    font-family: 'roboto_300';
    font-weight: bold;
    font-size: 22px;
    color: ${colors.primary};
`;