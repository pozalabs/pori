import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  // NOTE: 그때그때 개발이 필요한 컴포넌트 또는 코드를 넣어서 사용하시면 됩니다.
  return <main></main>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
