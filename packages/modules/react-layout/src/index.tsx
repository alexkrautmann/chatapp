import React, { FC } from 'react';
import styled from 'styled-components/primitives';
// import { Text } from 'react-primitives';

const headerHeight = '40px';
const headerItemHeight = '32px';

const HeaderContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${headerHeight};
  padding: 0 16px;
  background-color: #686868;
  justify-content: space-between;
`;

const Hamburger = styled.Text`
  height: ${headerItemHeight};
  line-height: ${headerItemHeight};
  color: #FFFFFF;
  margin-right: 16px;
`;

const Logo = styled.Text`
  height: ${headerItemHeight};
  line-height: ${headerItemHeight};
  color: #FFFFFF;
`;

const SearchBar = styled.View`
  height: ${headerItemHeight};
  margin: 0 40px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SearchInput = styled.Text`
  line-height: ${headerItemHeight};
  color: #FFFFFF;
  border: 1px solid #FFFFFF;
  max-width: 640px;
`;

const Toolbar = styled.View`
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
`;

const ToolbarItem = styled.Text`
  height: ${headerItemHeight};
  line-height: ${headerItemHeight};
  color: #FFFFFF;
`;

interface HeaderProps {
  onHamburgerClick: (() => void)
  onLogoClick: (() => void)
}


export const Header: FC<HeaderProps> = ({ onHamburgerClick, onLogoClick }) => (
  <HeaderContent>
    <Hamburger onClick={() => onHamburgerClick()}>
      HB
    </Hamburger>
    <Logo onClick={() => onLogoClick()}>
      Chatapp
    </Logo>
    <SearchBar>
      <SearchInput>
        Search...
      </SearchInput>
    </SearchBar>
    <Toolbar>
      <ToolbarItem>
        1
      </ToolbarItem>
      <ToolbarItem>
        2
      </ToolbarItem>
      <ToolbarItem>
        3
      </ToolbarItem>
      <ToolbarItem>
        1
      </ToolbarItem>
      <ToolbarItem>
        2
      </ToolbarItem>
      <ToolbarItem>
        3
      </ToolbarItem>
      <ToolbarItem>
        1
      </ToolbarItem>
      <ToolbarItem>
        2
      </ToolbarItem>
      <ToolbarItem>
        3
      </ToolbarItem>
      <ToolbarItem>
        1
      </ToolbarItem>
      <ToolbarItem>
        2
      </ToolbarItem>
      <ToolbarItem>
        3
      </ToolbarItem>
    </Toolbar>
  </HeaderContent>
);
