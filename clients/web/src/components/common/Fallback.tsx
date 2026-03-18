import React from 'react';
import { Flex,  Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const Fallback = () => {
  return (
    <Flex 
      align="center" 
      justify="center" 
      style={{ minHeight: '100vh' }}
    >
      <Result
        icon={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        title="Загрузка приложения"
        subTitle="Пожалуйста, подождите..."
      />
    </Flex>
  );
};