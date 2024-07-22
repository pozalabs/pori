import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SwitchRenderer from './SwitchRenderer';

describe('SwitchRenderer 렌더링 테스트', () => {
  afterEach(() => {
    cleanup();
  });

  it('SwitchRenderer은 자식 노드의 data-value 값이 본인의 value 값과 동일한 컴포넌트를 렌더링한다.', async () => {
    render(
      <SwitchRenderer value="hi">
        <div data-value="hi">hi</div>
        <div data-value="hello">hello</div>
      </SwitchRenderer>,
    );

    expect(await screen.findAllByText('hi')).toBeTruthy();
  });
});
