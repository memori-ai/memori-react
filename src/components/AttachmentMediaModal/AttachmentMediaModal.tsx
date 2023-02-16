import { Asset, ResponseSpec } from '@memori.ai/memori-api-client/dist/types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getErrori18nKey } from '../../helpers/error';
import { allowedMediaTypes } from '../../helpers/constants';
import { getResourceUrl } from '../../helpers/media';
import Modal from '../ui/Modal';
import message from '../ui/Message';
import Button from '../ui/Button';
import ImageUpload from '../ImageUpload/ImageUpload';

export interface Props {
  visible: boolean;
  authToken: string;
  sessionID: string;
  tenantID: string;
  uploadAssetURL: string;
  deleteAsset: (token: string, assetURL: string) => Promise<ResponseSpec>;
  onCancel?: () => void;
  onOk: (asset: Asset) => Promise<void>;
  apiURL?: string;
}

const AttachmentMediaModal = ({
  visible,
  authToken,
  sessionID,
  tenantID,
  uploadAssetURL,
  deleteAsset,
  onCancel,
  onOk,
  apiURL,
}: Props) => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState<Asset>();

  return (
    <Modal
      open={visible}
      title={t('media.addMediaLabel')}
      className="attachment-media-modal"
      closable
      width="100%"
      widthMd="100%"
      onClose={() => {
        if (onCancel) onCancel();
      }}
      footer={
        <>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button
            primary
            onClick={() => {
              if (asset) onOk(asset);
              setAsset(undefined);
            }}
            disabled={!asset}
          >
            {t('confirm')}
          </Button>
        </>
      }
    >
      <ImageUpload
        tenantID={tenantID}
        apiUrl={apiURL}
        uploadMultipleImages={false}
        maxNumberOfVisualizedUploads={1}
        maxFileSizeInMB={100}
        uploadUrl={uploadAssetURL}
        useImageCrop={false}
        allowedMimeTypes={allowedMediaTypes}
        fileList={
          asset
            ? [
                {
                  uid: `-1`,
                  name: asset.assetID,
                  status: 'done',
                  thumbUrl: getResourceUrl({
                    resourceURI: asset.assetURL,
                    tenantID,
                    apiURL,
                    sessionID,
                  }),
                },
              ]
            : []
        }
        uploadMessage={t('media.mediaUploadMessage')}
        imageProportions={1}
        onUploadFinished={(file: any) => {
          let newAsset = file.response.asset as Asset;
          let response = file.response as ResponseSpec;
          if (response.resultCode === 0) {
            setAsset(newAsset);
          } else {
            console.error(response, file);
            message.error(t(getErrori18nKey(response.resultCode)));
          }
        }}
        onFileChanged={(_assetID: string, asset: Partial<Asset>) => {
          setAsset(
            a =>
              ({
                ...(a || {}),
                ...asset,
              } as Asset)
          );
        }}
        onRemove={async (file: any) => {
          const resp = await deleteAsset(authToken, file.thumbUrl);
          if (resp.resultCode === 0) {
            setAsset(undefined);
          } else {
            console.error(resp, file);
            message.error(t(getErrori18nKey(resp.resultCode)));
          }

          return resp.resultCode === 0;
        }}
      />
    </Modal>
  );
};

export default AttachmentMediaModal;
