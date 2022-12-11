import styled from 'styled-components';

export const HeaderContainer = styled('div')`
  background: #7744f8;
  height: 100%;
  grid-area: app-header;
  display: grid;
  grid-template-areas: 'brand navbar';
  grid-template-columns: 20% 80%;
`;

export const NavBar = styled('div')`
  display: flex;
  justify-content: space-around;
  background: cadetblue;
  grid-area: navbar;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  &a {
    hover {
      cursor: pointer;
      font-weight: 800;
    }
  }
`;

export const BrandContainer = styled('div')`
  background: rgb(95, 158, 160);
  grid-area: brand;
  display: flex;
  font-family: 'Roboto', sans-serif;
  justify-content: flex-start;
  padding-left: 1rem;
  align-items: center;

  h3 {
    color: white;
    padding-left: 1px;
  }
`;
