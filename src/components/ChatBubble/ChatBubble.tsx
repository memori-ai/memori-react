import React from 'react';
import cx from 'classnames';
import {
  Memori,
  Message,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import { Transition } from '@headlessui/react';
import { getResourceUrl } from '../../helpers/media';
import User from '../icons/User';

import './ChatBubble.css';

export interface Props {
  message: Message;
  memori: Memori;
  tenant?: Tenant;
  baseUrl?: string;
}

const ChatBubble: React.FC<Props> = ({ message, memori, tenant, baseUrl }) => (
  <Transition
    show
    appear
    as="div"
    className={cx('memori-chat--bubble-container', {
      'memori-chat--bubble-from-user': !!message.fromUser,
    })}
  >
    {message.initial && <div className="memori-chat--bubble-initial" />}
    {!message.fromUser && (
      <Transition.Child
        as="picture"
        className="memori-chat--bubble-avatar"
        enter="transition ease-in-out duration-300"
        enterFrom={`opacity-0 scale-075 ${
          message.fromUser ? 'translate-x-15' : 'translate-x--15'
        }`}
        enterTo="opacity-1 scale-1 translate-x-0"
        leave="transition ease-in-out duration-300"
        leaveFrom="opacity-1 scale-1 translate-x-0"
        leaveTo={`opacity-0 scale-075 ${
          message.fromUser ? 'translate-x-15' : 'translate-x--15'
        }`}
      >
        <source
          src={getResourceUrl({
            type: 'avatar',
            tenantID: tenant?.id,
            resourceURI: memori.avatarURL,
            baseURL: baseUrl,
          })}
        />
        <img
          className="memori-chat--bubble-avatar-img"
          alt={memori.name}
          src={
            memori.avatarURL && memori.avatarURL.length > 0
              ? getResourceUrl({
                  type: 'avatar',
                  tenantID: tenant?.id,
                  resourceURI: memori.avatarURL,
                  baseURL: baseUrl,
                })
              : getResourceUrl({
                  tenantID: tenant?.id,
                  type: 'avatar',
                  baseURL: baseUrl || 'https://app.twincreator.com',
                })
          }
        />
      </Transition.Child>
    )}
    <Transition.Child
      as="div"
      className={cx('memori-chat--bubble', {
        'memori-chat--user-bubble': !!message.fromUser,
      })}
      enter="transition ease-in-out duration-300"
      enterFrom={`opacity-0 scale-09 translate-x-${
        message.fromUser ? '30' : '-30'
      }`}
      enterTo="opacity-1 scale-1 translate-x-0"
      leave="transition ease-in-out duration-300"
      leaveFrom="opacity-1 scale-1 translate-x-0"
      leaveTo={`opacity-0 scale-09  translate-x-${
        message.fromUser ? '30' : '-30'
      }`}
    >
      {(message.translatedText || message.text)
        .split(/\r\n|\r|\n/)
        .map((row, index) => (
          <p key={index}>{row}</p>
        ))}
    </Transition.Child>

    {message.fromUser && (
      <Transition.Child
        as="div"
        className="memori-chat--bubble-avatar"
        enter="transition ease-in-out duration-300"
        enterFrom={`opacity-0 scale-075 ${
          message.fromUser ? 'translate-x-15' : 'translate-x--15'
        }`}
        enterTo="opacity-1 scale-1 translate-x-0"
        leave="transition ease-in-out duration-300"
        leaveFrom="opacity-1 scale-1 translate-x-0"
        leaveTo={`opacity-0 scale-075 ${
          message.fromUser ? 'translate-x-15' : 'translate-x--15'
        }`}
      >
        <User />
      </Transition.Child>
    )}
  </Transition>
);

export default ChatBubble;
