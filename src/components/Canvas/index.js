import { useRef } from 'react';
import { CanvasContainer, RenderCanvas } from './styles';

const Canvas = (props) => {
  const canvasRef = useRef();
  return (
    <CanvasContainer {...props}>
      <RenderCanvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export { Canvas };
