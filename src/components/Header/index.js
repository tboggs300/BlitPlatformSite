import { HeaderContainer, BrandContainer } from './styles';

const Header = (props) => {
  return (
    <HeaderContainer>
      <BrandContainer>
        <strong>Blit </strong> Platform
      </BrandContainer>
      <a id="Modeling-anchor">Modeling</a>
    </HeaderContainer>
  );
};

export { Header };
