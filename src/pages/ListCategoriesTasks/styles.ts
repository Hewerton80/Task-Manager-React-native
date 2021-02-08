import styled from 'styled-components/native';
import colors from '../../styles/colors';
import { Dimensions } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';

const windowWidth = Dimensions.get('window').width;

const paddingContainer = windowWidth * 0.03381642512077294685990338164251;
const CategoryWidth = windowWidth * 0.43478260869565217391304347826087;
const CategoryHeight = CategoryWidth;
const CategoryMargin = windowWidth * 0.06280193236714975845410628019324;
const CategoryPaddingHeight = CategoryHeight * 0.13888888888888888888888888888889;
const CategoryPaddingWidth = CategoryWidth * 0.15;

const ButtonDiameter = 60;

// console.log('windowWidth: ',windowWidth);
// console.log('paddingContainer: ',paddingContainer);
// console.log('CategoryWidth: ',CategoryWidth);
// console.log('CategoryHeight: ',CategoryHeight);
// console.log('CategoryMargin: ',CategoryMargin);
// console.log('CategoryPaddingHeight: ',CategoryPaddingHeight);
// console.log('CategoryPaddingWidth: ',CategoryPaddingWidth);

export const Container = styled.ScrollView`
    flex: 1;
    padding: 0 ${paddingContainer}px;
`;

export const CategoriesContainer = styled.View`
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: ${CategoryMargin}px;
`;

export const CategoryWraper = styled.View`
    width: ${CategoryWidth}px;
    height: ${CategoryHeight}px;
    margin: 0  ${(props: any) => props.isLeft ? CategoryMargin : 0}px ${CategoryMargin}px 0;
    border-color: ${colors.primary};
`;
export const Category = styled(BaseButton).attrs(() => ({
    rippleColor: colors.grey
}))`
    width: 100%;
    height:100%;
    background: ${colors.primary};
    padding: ${CategoryPaddingWidth}px ${CategoryPaddingHeight}px;
`;
export const ImageCategory = styled.Image`
    width: 30px;
    height: 30px;
`;
export const CategoryIconContainer = styled.View`
    flex:1;
    width: 100%;
    margin-bottom: 0px;
    padding: 0px;
    height:${43.8 - (2 * CategoryPaddingHeight)}%;
`;

export const CategoryNameContainer = styled.View`
    height:${17.2 - (2 * CategoryPaddingHeight)}%;
    align-items:flex-start;
`;

export const CategoryName = styled.Text`
    font-size:24px;
    font-family: 'roboto_300';
    color: ${colors.black};
    align-items: flex-start;
`;

export const CategoryNumberTasksContainer = styled.View`
    height:${11.6 - (2 * CategoryPaddingHeight)}%;
`;

export const CategoryNumberTasks = styled.Text`
    font-family: 'roboto_300';
    font-size:18px;
    color: ${colors.grey};
`;



export const FloatingButton = styled(BaseButton).attrs(() => ({
   rippleColor: colors.primary
}))`
   position: absolute;
   right: 30px;
   bottom: 30px;
   width: ${ButtonDiameter}px;
   height: ${ButtonDiameter}px;
   align-items: center;
   justify-content: center;
   background: ${colors.lightBlue};
   border-radius: ${ButtonDiameter /2}px;
   z-index:2;
`;

