// Typings
import {
  DialogState,
  Memori,
  Integration,
  Venue,
  Message,
  Medium,
  OpenSession,
  MemoriConfig,
  TranslatedHint,
  Invitation,
  GamificationLevel,
} from '@memori.ai/memori-api-client/dist/types';
import {
  SpeakerAudioDestination,
  SpeechConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';

// Libraries
import React, {
  useState,
  useEffect,
  useCallback,
  CSSProperties,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import memoriApiClient from '@memori.ai/memori-api-client';
import invariant from 'tiny-invariant';
import { AudioContext } from 'standardized-audio-context';
import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';

// UI
import Notification from '../ui/Notification';
import Spin from '../ui/Spin';
import Radio from '../ui/Radio';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import Drawer from '../ui/Drawer';
import Select from '../ui/Select';
import Tooltip from '../ui/Tooltip';

// Components
import ShareButton from '../ShareButton/ShareButton';
import ExportHistoryButton from '../ExportHistoryButton/ExportHistoryButton';
import ErrorBoundary from '../ErrorBoundary';
import MemoriChat from '../MemoriChat/MemoriChat';
import PositionDrawer from '../PositionDrawer/PositionDrawer';
import MemoriAuth from '../MemoriAuth/MemoriAuth';
import Blob from '../Blob/Blob';
import AvatarView from '../AvatarView';
import ModelViewer from '../ModelViewer/ModelViewer';
import BlockedMemoriBadge from '../BlockedMemoriBadge/BlockedMemoriBadge';

// Helpers / Utils
import { getTranslation } from '../../helpers/translations';
import { setLocalConfig, getLocalConfig } from '../../helpers/configuration';
import { hasTouchscreen } from '../../helpers/utils';
import { getResourceUrl } from '../../helpers/media';
import { anonTag, chatLanguages } from '../../helpers/constants';
import { getErrori18nKey } from '../../helpers/error';
import { getGamificationLevel } from '../../helpers/statistics';

// Icons
import Sound from '../icons/Sound';
import SoundDeactivated from '../icons/SoundDeactivated';
import Setting from '../icons/Setting';
import Edit from '../icons/Edit';
import Eye from '../icons/Eye';
import EyeInvisible from '../icons/EyeInvisible';
import Translation from '../icons/Translation';
import Warning from '../icons/Warning';
import MapMarker from '../icons/MapMarker';

// API calls methods
const {
  initSession,
  postTextEnteredEvent,
  postPlaceChangedEvent,
  postTimeoutEvent,
  postTagChangedEvent,
  getSession,
} = memoriApiClient('https://backend.memori.ai');

const MemoriWidget = () => <div>Pippo</div>;

export default MemoriWidget;
