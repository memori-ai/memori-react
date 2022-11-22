import React from 'react';
import { render } from '@testing-library/react';
import ModelViewer from './ModelViewer';

it('renders ModelViewer unchanged', () => {
  const { container } = render(
    <ModelViewer
      src="https://assets.memori.ai/api/v2/asset/b791f77c-1a94-4272-829e-eca82fcc62b7.glb"
      poster="https://assets.memori.ai/api/v2/asset/d8035229-08cf-42a7-a532-ab051df2603d.png"
    />
  );
  expect(container).toMatchSnapshot();
});
