import React from 'react';
import { FloatingButton, IconPlus } from './styles';
import plusIcon from '../../images/plus.png';

const FloatingButtonComponent: any = () => {
  return (
    <FloatingButton
      style={{
        elevation: 8, // shadow on Android
        shadowOpacity: 8, // shadow on iOS
      }}
    >
      <IconPlus
        source={plusIcon}
      />
    </FloatingButton>
  );
};

export default FloatingButtonComponent;
