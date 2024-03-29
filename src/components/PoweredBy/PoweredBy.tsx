import { Tenant } from '@memori.ai/memori-api-client/dist/types';

export interface Props {
  tenant?: Tenant;
  userLang?: string;
  integrationID?: string;
  memoriHash?: string;
}

const PoweredBy = ({
  tenant,
  userLang = 'en',
  integrationID,
  memoriHash,
}: Props) => {
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
        <span className="sr-only">Powered by</span>
        <a
          href={`https://memori.ai/${
            userLang?.toLowerCase() === 'it' ? 'it' : 'en'
          }${integrationID ? `?integrationID=${integrationID}` : ''}${
            memoriHash ? `${integrationID ? '&' : '?'}memori=${memoriHash}` : ''
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Memori.AI
        </a>
      </p>
    </div>
  );
};

export default PoweredBy;
