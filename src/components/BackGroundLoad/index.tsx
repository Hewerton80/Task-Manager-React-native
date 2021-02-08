import React from 'react';

import { ActivityIndicator } from 'react-native-paper';
import colors from '../../styles/colors';
import { Container } from './styles';

const BackGroundLoad: React.FC = () => {
  return (
    <Container>
      <ActivityIndicator animating={true} color={colors.lightBlue} size='large' />
    </Container>
  );
};

export default BackGroundLoad;
