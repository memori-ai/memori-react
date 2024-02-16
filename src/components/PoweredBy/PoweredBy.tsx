import { Tenant } from '@memori.ai/memori-api-client/dist/types';

export interface Props {
  tenant?: Tenant;
  userLang?: string;
}

const PoweredBy = ({ tenant, userLang = 'en' }: Props) => {
  const tenantId =
    tenant?.theme === 'memorytwin'
      ? 'memorytwin'
      : tenant?.theme === 'twincreator'
      ? 'twincreator'
      : 'aisuru';

  return (
    <div className="memori--powered-by">
      <img src={`https://aisuru.com/images/${tenantId}/logo.png`} alt="" />
      <p>
        Powered by{' '}
        <a
          href={`https://${
            tenant?.theme === 'twincreator'
              ? 'app.twincreator.com'
              : tenant?.theme === 'memorytwin'
              ? 'app.memorytwin.com'
              : 'aisuru.com'
          }/${userLang ? userLang.toLowerCase() : ''}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tenantId === 'memorytwin'
            ? 'MemoryTwin'
            : tenantId === 'twincreator'
            ? 'TwinCreator'
            : 'AIsuru'}
        </a>
      </p>
    </div>
  );
};

export default PoweredBy;
