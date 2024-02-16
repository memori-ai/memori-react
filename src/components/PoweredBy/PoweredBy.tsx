import { Tenant } from '@memori.ai/memori-api-client/dist/types';

export interface Props {
  tenant?: Tenant;
  userLang?: string;
}

const PoweredBy = ({ tenant, userLang = 'en' }: Props) => {
  const tenantId =
    tenant?.theme === 'memorytwin' ? 'memorytwin' : 'twincreator';

  return (
    <div className="memori--powered-by">
      <img src={`https://aisuru.com/images/${tenantId}/logo.png`} alt="" />
      <p>
        Powered by{' '}
        <a
          href={`https://app.${tenantId}.com/${
            userLang ? userLang.toLowerCase() : ''
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tenantId === 'memorytwin' ? 'MemoryTwin' : 'TwinCreator'}
        </a>
      </p>
    </div>
  );
};

export default PoweredBy;
