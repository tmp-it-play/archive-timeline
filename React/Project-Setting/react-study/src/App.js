import styled from 'styled-components';

const SquareButton = styled.button`
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  margin: 4px;
`;

function Square({ value }) {
  return <SquareButton>{value}</SquareButton>;
}

const BoardRow = styled.div`
  display: flex;
`;

const OutLine = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

export default function Board() {
  return (
    <OutLine>
      <BoardRow>
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </BoardRow>
      <BoardRow>
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </BoardRow>
      <BoardRow>
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </BoardRow>
    </OutLine>
  );
}
