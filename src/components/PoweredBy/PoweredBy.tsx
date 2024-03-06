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
          href={`https://memori.ai/${
            userLang?.toLowerCase() === 'it' ? 'it' : 'en'
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
