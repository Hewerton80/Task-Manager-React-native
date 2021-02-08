import { BaseButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from '../../styles/colors';

const ButtonDiameter = 60;


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
export const IconPlus = styled.Image`
   width: ${ButtonDiameter/4}px;
   height: ${ButtonDiameter/4}px;
`;
