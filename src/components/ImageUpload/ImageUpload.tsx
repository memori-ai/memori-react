import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { Asset, Medium } from '@memori.ai/memori-api-client/dist/types';
import React, { useState } from 'react';
import message from '../ui/Message';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import Modal from '../ui/Modal';
import Spin from '../ui/Spin';
import Upload from 'antd/lib/upload/Upload';
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';
import Edit from '../icons/Edit';
import Delete from '../icons/Delete';
import { RenderMediaItem } from '../MediaWidget/MediaItemWidget';
import { getResourceUrl } from '../../helpers/media';

const imgMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

export interface Props {
  uploadMultipleImages: boolean;
  maxNumberOfVisualizedUploads?: number;
  fileList?: any[];
  uploadUrl: string;
  apiUrl?: string;
  tenantID: string;
  maxFileSizeInMB?: number;
  fileResolution?: number[];
  useImageCrop?: boolean;
  uploadMessage: string;
  imageProportions?: number;
  imageProportionsHelper?: string;
  allowedMimeTypes?: string[];
  onRemove?: (file: UploadFile<any>) => Promise<boolean>;
  onUploadFinished?: (file: UploadFile) => void;
  onFileChanged?: (assetID: string, asset: Partial<Asset>) => void;
  onFileNotValid?: () => void;
  disabled?: boolean;
  showHelper?: boolean;
  additionalHelper?: string;
  resourceType?: 'avatar' | 'cover' | undefined;
}

interface UploadListItemProps {
  originNode: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  file: UploadFile;
  fileList: UploadFile[];
  actions: {
    download: (file: UploadFile) => void;
    preview: (file: UploadFile) => void;
    remove: (file: UploadFile) => void;
  };
  resourceType: 'avatar' | 'cover' | undefined;
  tenantID: string;
  apiUrl?: string;
}

const UploadListItem = ({
  originNode,
  file,
  tenantID,
  apiUrl,
  actions,
  resourceType,
}: UploadListItemProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`memori--list-item-wrapper${
        file.status === 'uploading' ? ` listItemUploading` : ''
      }`}
    >
      <Spin spinning={file.status === 'uploading'}>
        {file.status === 'error' ? (
          <Tooltip content={t('media.uploadError')}>
            {originNode.props.children}
          </Tooltip>
        ) : (
          <RenderMediaItem
            item={
              {
                mediumID: file.uid,
                mimeType:
                  file.status === 'uploading'
                    ? 'image/png'
                    : file.name?.endsWith('.glb')
                    ? 'model/gltf-binary'
                    : file.type || 'image/png',
                title: file.name ?? '',
                url:
                  file.status === 'uploading'
                    ? ''
                    : file.response?.asset?.assetURL
                    ? file.response.asset.assetURL
                    : getResourceUrl({
                        type: resourceType,
                        resourceURI: file.thumbUrl,
                        tenantID,
                        apiURL: apiUrl,
                      }),
                content: `${getResourceUrl({
                  resourceURI: file.thumbUrl,
                  type: resourceType,
                  apiURL: apiUrl,
                })}`,
              } as Medium
            }
            preview={false}
          />
        )}
      </Spin>
      {(file.status === 'success' || file.status === 'done') && (
        <div className="list-item-actions">
          <Button
            outlined
            shape="circle"
            icon={<Edit />}
            className="action-button"
            title={t('edit') || 'Edit'}
            onClick={() => actions?.download(file)}
          />
          <Button
            outlined
            shape="circle"
            icon={<Delete />}
            className="action-button"
            title={t('delete') || 'Delete'}
            onClick={() => actions?.remove(file)}
          />
        </div>
      )}
    </div>
  );
};

const ImageUpload: React.FC<Props> = ({
  uploadMultipleImages,
  maxNumberOfVisualizedUploads,
  uploadUrl,
  apiUrl,
  tenantID,
  fileList,
  maxFileSizeInMB = 2,
  fileResolution,
  useImageCrop,
  uploadMessage,
  imageProportions = 1,
  imageProportionsHelper,
  allowedMimeTypes,
  onRemove,
  onFileChanged,
  onUploadFinished,
  onFileNotValid,
  disabled,
  showHelper,
  additionalHelper,
  resourceType,
}) => {
  const { t } = useTranslation();

  const [internalFileList, setInternalFileList] = useState(
    (fileList ?? []) as any[]
  );

  const onChange = (info: UploadChangeParam<UploadFile>) => {
    setInternalFileList(
      info.fileList.map(f => ({ ...f, status: f.status ?? 'error' }))
    );
    if (info.file.status === 'done') {
      onUploadFinished && onUploadFinished(info.file);
    }
  };

  const beforeUpload = (file: any): Promise<File> => {
    const isAllowed = (allowedMimeTypes ?? imgMimeTypes).find(
      x => x === file.type
    );
    if (!isAllowed && file.type) {
      console.debug('File not allowed', file, allowedMimeTypes ?? imgMimeTypes);
      message.error(t('media.uploadMimeTypeNotAllowed'));
      onFileNotValid && onFileNotValid();
      return Promise.reject(t('media.uploadMimeTypeNotAllowed'));
    }
    const isLimitedSize = file.size / 1024 / 1024 < (maxFileSizeInMB ?? 2);
    if (!isLimitedSize) {
      message.error(
        t('media.uploadSizeLimitMessage', { size: maxFileSizeInMB })
      );
      onFileNotValid && onFileNotValid();
      return Promise.reject(
        t('media.uploadSizeLimitMessage', { size: maxFileSizeInMB })
      );
    }

    if (fileResolution && fileResolution.length) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<File>((resolve, reject) => {
        reader.addEventListener('load', event => {
          var newImg = new Image();
          newImg.style.padding = '0px';
          newImg.style.margin = '0px';

          newImg.onload = () => {
            let ok =
              newImg.width === fileResolution[0] &&
              newImg.height === fileResolution[1];
            if (!ok) {
              message.error(
                t('media.uploadWrongResolutionMessage', {
                  width: fileResolution[0],
                  height: fileResolution[1],
                })
              );
              reject();
              if (onFileNotValid) onFileNotValid();
            } else {
              resolve(file);
            }
          };
          newImg.src = event.target?.result?.toString() ?? '';
        });
      });
    } else return Promise.resolve(file);
  };

  const [fileTitleModal, setFileTitleModal] = useState<Partial<Asset>>();

  const upload = (
    <Upload
      className="memori--upload"
      disabled={disabled ?? false}
      accept={
        (allowedMimeTypes ?? imgMimeTypes)?.join(',') +
        ';capture=camera,camcorder'
      }
      action={uploadUrl}
      listType="picture-card"
      showUploadList={{
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: true,
        downloadIcon: <Edit title={t('edit') || 'Edit'} />,
      }}
      beforeUpload={beforeUpload}
      supportServerRender
      fileList={internalFileList}
      multiple={uploadMultipleImages}
      maxCount={
        maxNumberOfVisualizedUploads || (uploadMultipleImages ? 100 : 1)
      }
      onChange={onChange}
      onRemove={onRemove}
      onDownload={file => {
        let asset = file.response?.asset as Asset | undefined;
        if (asset) {
          let title =
            asset.originalFileName && file.name.includes(asset.originalFileName)
              ? asset.originalFileName
              : file.name;
          setFileTitleModal({
            ...asset,
            title: title ?? asset.title,
          });
        } else {
          setFileTitleModal({
            assetID: file.uid,
            title: file.name ?? file.fileName,
          });
        }
      }}
      itemRender={(originNode, file, currFileList, actions) => (
        <UploadListItem
          resourceType={resourceType}
          originNode={originNode}
          file={file}
          fileList={internalFileList || currFileList}
          actions={actions}
          tenantID={tenantID}
          apiUrl={apiUrl}
        />
      )}
    >
      {uploadMessage}
    </Upload>
  );

  return (
    <div aria-live="polite">
      {!!useImageCrop ? (
        <ImgCrop
          rotate
          aspect={imageProportions}
          fillColor={'transparent'}
          modalCancel={t('cancel') || 'Cancel'}
          modalMaskTransitionName="none"
          modalTransitionName="none"
        >
          {upload}
        </ImgCrop>
      ) : (
        upload
      )}
      <Modal
        open={!!fileTitleModal}
        title={t('media.editAttributes')}
        onClose={() => {
          setFileTitleModal(undefined);
        }}
        footer={<></>}
        width="100%"
      >
        <label htmlFor="media-title-input" className="media-title-label">
          {t('media.title')}
        </label>
        <input
          id="media-title-input"
          className="media-title-input"
          type="text"
          name="title"
          defaultValue={fileTitleModal?.title || ''}
          onChange={e => {
            setFileTitleModal({
              ...fileTitleModal,
              title: e.target.value,
            });
          }}
        />

        <div className="memori-modal--footer">
          <Button
            onClick={() => {
              setFileTitleModal(undefined);
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            primary
            onClick={() => {
              onFileChanged &&
                fileTitleModal?.assetID &&
                onFileChanged(fileTitleModal.assetID, {
                  ...fileTitleModal,
                });
              setInternalFileList(fl =>
                fl.map(f =>
                  f.uid === fileTitleModal?.assetID ||
                  f.response?.asset?.assetID === fileTitleModal?.assetID
                    ? {
                        ...f,
                        title: fileTitleModal?.title,
                        name: fileTitleModal?.title,
                      }
                    : f
                )
              );
              setFileTitleModal(undefined);
            }}
          >
            {t('confirm')}
          </Button>
        </div>
      </Modal>
      {showHelper && (
        <legend className="helper">
          <p>
            {t(
              allowedMimeTypes
                ? 'media.uploadHelper'
                : 'media.uploadHelperImages'
            ).replace('@size@', (maxFileSizeInMB ?? 2).toString())}
          </p>
          {imageProportionsHelper && useImageCrop && (
            <p>
              {t('media.scaleRatio')}: {imageProportionsHelper}
            </p>
          )}
          {additionalHelper && <p>{additionalHelper}</p>}
        </legend>
      )}
    </div>
  );
};

export default ImageUpload;
