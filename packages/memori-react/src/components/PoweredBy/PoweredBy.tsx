import { Tenant } from '@memori.ai/memori-api-client/dist/types';
import MemoriIcon from '../../icons/MemoriIcon';

export interface Props {
  tenant?: Tenant;
  userLang?: string;
  integrationID?: string;
  memoriHash?: string;
}

const PoweredBy = ({
  tenant: _tenant,
  userLang = 'en',
  integrationID,
  memoriHash,
}: Props) => {
  const href = `https://memori.ai/${
    userLang?.toLowerCase() === 'it' ? 'it' : 'en'
  }${integrationID ? `?integrationID=${integrationID}` : ''}${
    memoriHash ? `${integrationID ? '&' : '?'}memori=${memoriHash}` : ''
  }`;

  return (
    <div className="memori--powered-by">
      <MemoriIcon className="memori--powered-by-icon" aria-hidden />
      <p className="memori--powered-by-label">
        <span>Powered by </span>
        <a href={href} target="_blank" rel="noopener noreferrer">
          Memori.AI
        </a>
      </p>
    </div>
  );
};

export default PoweredBy;
