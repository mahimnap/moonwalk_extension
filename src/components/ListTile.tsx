import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
`;

const ListTile = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Container>
        <Text>{title}</Text>
      </Container>
    </TouchableOpacity>
  );
};

export default ListTile;