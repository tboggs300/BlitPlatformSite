import styled from 'styled-components';

export const CanvasContainer = styled('div')`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  #scene-explorer-host,
  #inspector-host {
    // Babylon inspector
    height: 100%;
  }
`;

export const RenderCanvas = styled('canvas')`
  width: 100%;
  height: 100%;

  &:focus {
    outline: none;
  }
`;
