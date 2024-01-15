import {
  ExpertReference,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import Drawer from '../ui/Drawer';
import { useTranslation } from 'react-i18next';
import { getResourceUrl } from '../../helpers/media';

export interface Props {
  experts: ExpertReference[];
  baseUrl: string;
  apiUrl: string;
  tenant?: Tenant;
  open?: boolean;
  onClose: () => void;
}

const ExpertsDrawer = ({
  open = false,
  baseUrl,
  apiUrl,
  tenant,
  experts,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className="memori--experts-drawer"
      title={
        <h2 className="memori--experts-drawer--title">
          {t('widget.expertsInTheBoard')}
        </h2>
      }
    >
      <ul className="memori--experts-drawer--list">
        {experts.map(expert => (
          <li key={expert.expertID} className="memori--experts-drawer--item">
            <figure className="memori--experts-drawer--avatar">
              <img
                src={`${apiUrl}/api/v1/memoriai/memori/avatar/${expert.expertMemoriID}`}
                alt={expert.name}
                onError={e => {
                  e.currentTarget.src = getResourceUrl({
                    tenantID: tenant?.id,
                    type: 'avatar',
                    baseURL: baseUrl,
                  });

                  e.currentTarget.onerror = null;
                }}
              />
            </figure>
            <div className="memori--experts-drawer--content">
              <h3 className="memori--experts-drawer--name">{expert.name}</h3>
              <p className="memori--experts-drawer--description">
                {expert.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Drawer>
  );
};

export default ExpertsDrawer;
