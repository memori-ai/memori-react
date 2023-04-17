import { render } from '@testing-library/react';
import Memori from '../MemoriWidget/MemoriWidget';
import { integration, memori, tenant } from '../../mocks/data';

it('renders Totem layout unchanged', () => {
  const { container } = render(
    <Memori
      showShare={true}
      showSettings={true}
      memori={memori}
      tenant={tenant}
      integration={integration}
      layout="TOTEM"
    />
  );
  expect(container).toMatchSnapshot();
});
