import { Dimensions } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import colors from '../../styles/colors';

const windowWidth = Dimensions.get('window').width;

const CategoryPaddingWidth = windowWidth * 0.0772946859903381642512077294686;

export const Container = styled.View`
    padding: 20px ${CategoryPaddingWidth}px;
`;

export const TextInputTask = styled.TextInput.attrs(()=>({
    placeholderTextColor: colors.grey
}))`
    font-family: 'roboto_300';
    height: 40px;
    font-size: 18px;
    border-bottom-width: 1px;
    border-bottom-color: ${colors.grey};
    margin-bottom: 25px;
`;

export const InputButton = styled(BaseButton).attrs(() => ({
    rippleColor: colors.grey
}))`
    padding: 5px 2px;
    margin-bottom: 5px;
`;

export const PickerCategory = styled.View`
    padding: 5px 2px;
    margin-bottom: 5px;
`;

export const InputButtonContent = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const PlaceHolder = styled.Text`
    font-family: 'roboto_300';
    font-size: 18px;
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
    width: ${windowWidth}px;
    height:55px;
`);

export const BottomButtonContent = styled.Text`
    font-family: 'roboto_300';
    font-weight: bold;
    font-size: 22px;
    color: ${colors.primary};
`;