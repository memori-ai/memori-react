"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[7088],{"./src/components/AttachmentMediaModal/AttachmentMediaModal.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_i18next__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),_helpers_error__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/helpers/error.ts"),_helpers_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/helpers/constants.ts"),_helpers_media__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/helpers/media.ts"),_ui_Modal__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/ui/Modal.tsx"),_ui_Message__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/ui/Message.tsx"),_ui_Button__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/ui/Button.tsx"),_ImageUpload_ImageUpload__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/components/ImageUpload/ImageUpload.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/react/jsx-runtime.js");const AttachmentMediaModal=({visible,authToken,sessionID,tenantID,uploadAssetURL,deleteAsset,onCancel,onOk,apiURL})=>{const{t}=(0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.$)(),[asset,setAsset]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Modal__WEBPACK_IMPORTED_MODULE_3__.Z,{open:visible,title:t("media.addMediaLabel"),className:"attachment-media-modal",closable:!0,width:"100%",widthMd:"100%",onClose:()=>{onCancel&&onCancel()},footer:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_5__.Z,{onClick:onCancel,children:t("cancel")}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_5__.Z,{primary:!0,onClick:()=>{asset&&onOk(asset),setAsset(void 0)},disabled:!asset,children:t("confirm")})]}),children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ImageUpload_ImageUpload__WEBPACK_IMPORTED_MODULE_6__.Z,{tenantID,apiUrl:apiURL,uploadMultipleImages:!1,maxNumberOfVisualizedUploads:1,maxFileSizeInMB:100,uploadUrl:uploadAssetURL,useImageCrop:!1,allowedMimeTypes:_helpers_constants__WEBPACK_IMPORTED_MODULE_2__.go,fileList:asset?[{uid:"-1",name:asset.assetID,status:"done",thumbUrl:(0,_helpers_media__WEBPACK_IMPORTED_MODULE_9__.v)({resourceURI:asset.assetURL,tenantID,apiURL,sessionID})}]:[],uploadMessage:t("media.mediaUploadMessage"),imageProportions:1,onUploadFinished:file=>{let newAsset=file.response.asset,response=file.response;0===response.resultCode?setAsset(newAsset):(console.error(response,file),_ui_Message__WEBPACK_IMPORTED_MODULE_4__.Z.error(t((0,_helpers_error__WEBPACK_IMPORTED_MODULE_1__.r)(response.resultCode))))},onFileChanged:(_assetID,asset)=>{setAsset((a=>({...a||{},...asset})))},onRemove:async file=>{const resp=await deleteAsset(authToken,file.thumbUrl);return 0===resp.resultCode?setAsset(void 0):(console.error(resp,file),_ui_Message__WEBPACK_IMPORTED_MODULE_4__.Z.error(t((0,_helpers_error__WEBPACK_IMPORTED_MODULE_1__.r)(resp.resultCode)))),0===resp.resultCode}})})};AttachmentMediaModal.displayName="AttachmentMediaModal";const __WEBPACK_DEFAULT_EXPORT__=AttachmentMediaModal;try{AttachmentMediaModal.displayName="AttachmentMediaModal",AttachmentMediaModal.__docgenInfo={description:"",displayName:"AttachmentMediaModal",props:{visible:{defaultValue:null,description:"",name:"visible",required:!0,type:{name:"boolean"}},authToken:{defaultValue:null,description:"",name:"authToken",required:!0,type:{name:"string"}},sessionID:{defaultValue:null,description:"",name:"sessionID",required:!0,type:{name:"string"}},tenantID:{defaultValue:null,description:"",name:"tenantID",required:!0,type:{name:"string"}},uploadAssetURL:{defaultValue:null,description:"",name:"uploadAssetURL",required:!0,type:{name:"string"}},deleteAsset:{defaultValue:null,description:"",name:"deleteAsset",required:!0,type:{name:"(token: string, assetURL: string) => Promise<ResponseSpec>"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!1,type:{name:"(() => void)"}},onOk:{defaultValue:null,description:"",name:"onOk",required:!0,type:{name:"(asset: Asset) => Promise<void>"}},apiURL:{defaultValue:null,description:"",name:"apiURL",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/AttachmentMediaModal/AttachmentMediaModal.tsx#AttachmentMediaModal"]={docgenInfo:AttachmentMediaModal.__docgenInfo,name:"AttachmentMediaModal",path:"src/components/AttachmentMediaModal/AttachmentMediaModal.tsx#AttachmentMediaModal"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ImageUpload/ImageUpload.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_ui_Message__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/ui/Message.tsx"),_ui_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/ui/Button.tsx"),_ui_Tooltip__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/ui/Tooltip.tsx"),_ui_Modal__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/ui/Modal.tsx"),_ui_Spin__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/ui/Spin.tsx"),antd_lib_upload_Upload__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("./node_modules/antd/lib/upload/Upload.js"),antd_img_crop__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/antd-img-crop/dist/antd-img-crop.esm.js"),react_i18next__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),_icons_Edit__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/components/icons/Edit.tsx"),_icons_Delete__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/components/icons/Delete.tsx"),_MediaWidget_MediaItemWidget__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/components/MediaWidget/MediaItemWidget.tsx"),_helpers_media__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./src/helpers/media.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/react/jsx-runtime.js");const imgMimeTypes=["image/jpeg","image/png","image/jpg","image/gif"],UploadListItem=({originNode,file,tenantID,apiUrl,actions,resourceType})=>{const{t}=(0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.$)();return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div",{className:"memori--list-item-wrapper"+("uploading"===file.status?" listItemUploading":""),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Spin__WEBPACK_IMPORTED_MODULE_5__.Z,{spinning:"uploading"===file.status,children:"error"===file.status?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Tooltip__WEBPACK_IMPORTED_MODULE_3__.Z,{content:t("media.uploadError"),children:originNode.props.children}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_MediaWidget_MediaItemWidget__WEBPACK_IMPORTED_MODULE_9__.e,{item:{mediumID:file.uid,mimeType:"uploading"===file.status?"image/png":file.name?.endsWith(".glb")?"model/gltf-binary":file.type||"image/png",title:file.name??"",url:"uploading"===file.status?"":file.response?.asset?.assetURL?file.response.asset.assetURL:(0,_helpers_media__WEBPACK_IMPORTED_MODULE_12__.v)({type:resourceType,resourceURI:file.thumbUrl,tenantID,apiURL:apiUrl}),content:`${(0,_helpers_media__WEBPACK_IMPORTED_MODULE_12__.v)({resourceURI:file.thumbUrl,type:resourceType,apiURL:apiUrl})}`},preview:!1})}),("success"===file.status||"done"===file.status)&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div",{className:"list-item-actions",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{outlined:!0,shape:"circle",icon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_icons_Edit__WEBPACK_IMPORTED_MODULE_7__.default,{}),className:"action-button",title:t("edit")||"Edit",onClick:()=>actions?.download(file)}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{outlined:!0,shape:"circle",icon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_icons_Delete__WEBPACK_IMPORTED_MODULE_8__.default,{}),className:"action-button",title:t("delete")||"Delete",onClick:()=>actions?.remove(file)})]})]})};UploadListItem.displayName="UploadListItem";const ImageUpload=({uploadMultipleImages,maxNumberOfVisualizedUploads,uploadUrl,apiUrl,tenantID,fileList,maxFileSizeInMB=2,fileResolution,useImageCrop,uploadMessage,imageProportions=1,imageProportionsHelper,allowedMimeTypes,onRemove,onFileChanged,onUploadFinished,onFileNotValid,disabled,showHelper,additionalHelper,resourceType})=>{const{t}=(0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.$)(),[internalFileList,setInternalFileList]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(fileList??[]),[fileTitleModal,setFileTitleModal]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(),upload=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(antd_lib_upload_Upload__WEBPACK_IMPORTED_MODULE_13__.default,{className:"memori--upload",disabled:disabled??!1,accept:(allowedMimeTypes??imgMimeTypes)?.join(",")+";capture=camera,camcorder",action:uploadUrl,listType:"picture-card",showUploadList:{showPreviewIcon:!0,showRemoveIcon:!0,showDownloadIcon:!0,downloadIcon:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_icons_Edit__WEBPACK_IMPORTED_MODULE_7__.default,{title:t("edit")||"Edit"})},beforeUpload:file=>{if(!(allowedMimeTypes??imgMimeTypes).find((x=>x===file.type))&&file.type)return console.debug("File not allowed",file,allowedMimeTypes??imgMimeTypes),_ui_Message__WEBPACK_IMPORTED_MODULE_1__.Z.error(t("media.uploadMimeTypeNotAllowed")),onFileNotValid&&onFileNotValid(),Promise.reject(t("media.uploadMimeTypeNotAllowed"));if(!(file.size/1024/1024<(maxFileSizeInMB??2)))return _ui_Message__WEBPACK_IMPORTED_MODULE_1__.Z.error(t("media.uploadSizeLimitMessage",{size:maxFileSizeInMB})),onFileNotValid&&onFileNotValid(),Promise.reject(t("media.uploadSizeLimitMessage",{size:maxFileSizeInMB}));if(fileResolution&&fileResolution.length){const reader=new FileReader;return reader.readAsDataURL(file),new Promise(((resolve,reject)=>{reader.addEventListener("load",(event=>{var newImg=new Image;newImg.style.padding="0px",newImg.style.margin="0px",newImg.onload=()=>{newImg.width===fileResolution[0]&&newImg.height===fileResolution[1]?resolve(file):(_ui_Message__WEBPACK_IMPORTED_MODULE_1__.Z.error(t("media.uploadWrongResolutionMessage",{width:fileResolution[0],height:fileResolution[1]})),reject(),onFileNotValid&&onFileNotValid())},newImg.src=event.target?.result?.toString()??""}))}))}return Promise.resolve(file)},supportServerRender:!0,fileList:internalFileList,multiple:uploadMultipleImages,maxCount:maxNumberOfVisualizedUploads||(uploadMultipleImages?100:1),onChange:info=>{setInternalFileList(info.fileList.map((f=>({...f,status:f.status??"error"})))),"done"===info.file.status&&onUploadFinished&&onUploadFinished(info.file)},onRemove,onDownload:file=>{let asset=file.response?.asset;if(asset){let title=asset.originalFileName&&file.name.includes(asset.originalFileName)?asset.originalFileName:file.name;setFileTitleModal({...asset,title:title??asset.title})}else setFileTitleModal({assetID:file.uid,title:file.name??file.fileName})},itemRender:(originNode,file,currFileList,actions)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(UploadListItem,{resourceType,originNode,file,fileList:internalFileList||currFileList,actions,tenantID,apiUrl}),children:uploadMessage});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div",{"aria-live":"polite",children:[useImageCrop?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(antd_img_crop__WEBPACK_IMPORTED_MODULE_6__.Z,{rotate:!0,aspect:imageProportions,fillColor:"transparent",modalCancel:t("cancel")||"Cancel",modalMaskTransitionName:"none",modalTransitionName:"none",children:upload}):upload,(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_ui_Modal__WEBPACK_IMPORTED_MODULE_4__.Z,{open:!!fileTitleModal,title:t("media.editAttributes"),onClose:()=>{setFileTitleModal(void 0)},footer:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment,{}),width:"100%",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("label",{htmlFor:"media-title-input",className:"media-title-label",children:t("media.title")}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("input",{id:"media-title-input",className:"media-title-input",type:"text",name:"title",defaultValue:fileTitleModal?.title||"",onChange:e=>{setFileTitleModal({...fileTitleModal,title:e.target.value})}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div",{className:"memori-modal--footer",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{onClick:()=>{setFileTitleModal(void 0)},children:t("cancel")}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{primary:!0,onClick:()=>{onFileChanged&&fileTitleModal?.assetID&&onFileChanged(fileTitleModal.assetID,{...fileTitleModal}),setInternalFileList((fl=>fl.map((f=>f.uid===fileTitleModal?.assetID||f.response?.asset?.assetID===fileTitleModal?.assetID?{...f,title:fileTitleModal?.title,name:fileTitleModal?.title}:f)))),setFileTitleModal(void 0)},children:t("confirm")})]})]}),showHelper&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("legend",{className:"helper",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p",{children:t(allowedMimeTypes?"media.uploadHelper":"media.uploadHelperImages").replace("@size@",(maxFileSizeInMB??2).toString())}),imageProportionsHelper&&useImageCrop&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("p",{children:[t("media.scaleRatio"),": ",imageProportionsHelper]}),additionalHelper&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p",{children:additionalHelper})]})]})};ImageUpload.displayName="ImageUpload";const __WEBPACK_DEFAULT_EXPORT__=ImageUpload;try{ImageUpload.displayName="ImageUpload",ImageUpload.__docgenInfo={description:"",displayName:"ImageUpload",props:{uploadMultipleImages:{defaultValue:null,description:"",name:"uploadMultipleImages",required:!0,type:{name:"boolean"}},maxNumberOfVisualizedUploads:{defaultValue:null,description:"",name:"maxNumberOfVisualizedUploads",required:!1,type:{name:"number"}},fileList:{defaultValue:null,description:"",name:"fileList",required:!1,type:{name:"any[]"}},uploadUrl:{defaultValue:null,description:"",name:"uploadUrl",required:!0,type:{name:"string"}},apiUrl:{defaultValue:null,description:"",name:"apiUrl",required:!1,type:{name:"string"}},tenantID:{defaultValue:null,description:"",name:"tenantID",required:!0,type:{name:"string"}},maxFileSizeInMB:{defaultValue:{value:"2"},description:"",name:"maxFileSizeInMB",required:!1,type:{name:"number"}},fileResolution:{defaultValue:null,description:"",name:"fileResolution",required:!1,type:{name:"number[]"}},useImageCrop:{defaultValue:null,description:"",name:"useImageCrop",required:!1,type:{name:"boolean"}},uploadMessage:{defaultValue:null,description:"",name:"uploadMessage",required:!0,type:{name:"string"}},imageProportions:{defaultValue:{value:"1"},description:"",name:"imageProportions",required:!1,type:{name:"number"}},imageProportionsHelper:{defaultValue:null,description:"",name:"imageProportionsHelper",required:!1,type:{name:"string"}},allowedMimeTypes:{defaultValue:null,description:"",name:"allowedMimeTypes",required:!1,type:{name:"string[]"}},onRemove:{defaultValue:null,description:"",name:"onRemove",required:!1,type:{name:"((file: UploadFile<any>) => Promise<boolean>)"}},onUploadFinished:{defaultValue:null,description:"",name:"onUploadFinished",required:!1,type:{name:"((file: UploadFile<any>) => void)"}},onFileChanged:{defaultValue:null,description:"",name:"onFileChanged",required:!1,type:{name:"((assetID: string, asset: Partial<Asset>) => void)"}},onFileNotValid:{defaultValue:null,description:"",name:"onFileNotValid",required:!1,type:{name:"(() => void)"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},showHelper:{defaultValue:null,description:"",name:"showHelper",required:!1,type:{name:"boolean"}},additionalHelper:{defaultValue:null,description:"",name:"additionalHelper",required:!1,type:{name:"string"}},resourceType:{defaultValue:null,description:"",name:"resourceType",required:!1,type:{name:"enum",value:[{value:'"cover"'},{value:'"avatar"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ImageUpload/ImageUpload.tsx#ImageUpload"]={docgenInfo:ImageUpload.__docgenInfo,name:"ImageUpload",path:"src/components/ImageUpload/ImageUpload.tsx#ImageUpload"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Delete.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Delete=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",focusable:"false",role:"img",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"})});Delete.displayName="Delete";const __WEBPACK_DEFAULT_EXPORT__=Delete;try{Delete.displayName="Delete",Delete.__docgenInfo={description:"",displayName:"Delete",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Delete.tsx#Delete"]={docgenInfo:Delete.__docgenInfo,name:"Delete",path:"src/components/icons/Delete.tsx#Delete"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/icons/Edit.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Edit=({className,title})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("svg",{...title?{}:{"aria-hidden":"true"},xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1024 1024",focusable:"false",role:"img",className,"aria-label":title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path",{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"})});Edit.displayName="Edit";const __WEBPACK_DEFAULT_EXPORT__=Edit;try{Edit.displayName="Edit",Edit.__docgenInfo={description:"",displayName:"Edit",props:{className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/icons/Edit.tsx#Edit"]={docgenInfo:Edit.__docgenInfo,name:"Edit",path:"src/components/icons/Edit.tsx#Edit"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ui/Message.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js"),__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={error:console.error,info:console.info,success:console.log}},"./src/components/ui/Tooltip.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Tooltip=({content,className,alignLeft=!1,disabled=!1,visible=!1,children})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()("memori-tooltip",className,{"memori-tooltip--align-left":alignLeft,"memori-tooltip--disabled":disabled,"memori-tooltip--visible":visible}),children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"memori-tooltip--content",children:content}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div",{className:"memori-tooltip--trigger",children})]});Tooltip.displayName="Tooltip";const __WEBPACK_DEFAULT_EXPORT__=Tooltip;try{Tooltip.displayName="Tooltip",Tooltip.__docgenInfo={description:"",displayName:"Tooltip",props:{content:{defaultValue:null,description:"",name:"content",required:!0,type:{name:"Element | ReactNode"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}},alignLeft:{defaultValue:{value:"false"},description:"",name:"alignLeft",required:!1,type:{name:"boolean"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},visible:{defaultValue:{value:"false"},description:"",name:"visible",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ui/Tooltip.tsx#Tooltip"]={docgenInfo:Tooltip.__docgenInfo,name:"Tooltip",path:"src/components/ui/Tooltip.tsx#Tooltip"})}catch(__react_docgen_typescript_loader_error){}},"./src/helpers/error.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{r:()=>getErrori18nKey});const BACKEND_ERRORS=new Map(Object.entries({TENANT_NOT_FOUND:-1,TENANT_REGISTRATION_DISABLED:-2,TENANT_MISSING_NAME:-3,TENANT_MAX_USERS_REACHED:-4,TENANT_MAX_ADMINS_REACHED:-5,USER_NOT_CONFIRMED:-11,USER_NOT_FOUND:-12,USER_OR_PASSWORD_INVALID:-13,USER_MUST_CHANGE_PASSWORD:-14,USER_MUST_ENTER_VERIFICATION_CODE:-15,USER_MISSING_TENANT:-21,USER_MISSING_NAME:-22,USER_MISSING_PASSWORD:-23,USER_MISSING_EMAIL:-24,USER_MISSING_VERIFICATION_CODE:-25,USER_NAME_ALREADY_USED:-26,USER_PASSWORD_NOT_CONFORMING_TO_POLICY:-27,USER_EMAIL_ALREADY_USED:-28,USER_EMAIL_INVALID:-29,USER_VERIFICATION_CODE_INVALID:-30,USER_MISSING_NAME_OR_EMAIL:-31,USER_NAME_INVALID:-32,USER_HAS_ONE_OR_MORE_MEMORI:-33,USER_MISSING_NEW_PASSWORD:-34,USER_CANT_CREATE_MEMORI:-35,USER_MAX_MEMORI_REACHED:-36,USER_CANT_EDIT_INTEGRATIONS:-37,MEMORI_NOT_FOUND:-51,MEMORI_NOT_ACCESSIBLE:-52,MEMORI_ONLY_OWNER_CAN_CHANGE_GIVER_TAG_AND_PIN:-53,SESSION_NOT_FOUND:-101,SESSION_IS_NOT_ADMINISTRATIVE:-102,MEMORI_MISSING_CONFIGURATION:-201,MEMORI_CONFIGURATION_NOT_FOUND:-202,MEMORI_INVALID_PRIVACY_TYPE:-203,MEMORI_MISSING_PASSWORD:-204,MEMORI_INVALID_TOTAL_NUMBER_OF_RECOVERY_TOKENS:-205,MEMORI_INVALID_MINIMUM_NUMBER_OF_RECOVERY_TOKENS:-206,MEMORI_INVALID_VOICE_TYPE:-207,MEMORI_MISSING_NAME:-208,MEMORI_MISSING_PASSWORD_OR_RECOVERY_TOKENS:-209,MEMORI_INVALID_ID:-210,MEMORI_NAME_ALREADY_USED:-211,MEMORI_INVALID_PIN:-212,MEMORI_GIVER_TAG_PIN_CHANGE_REQUIRES_SEPARATE_OPERATION:-213,MEMORI_NO_PASSWORD_WHEN_PUBLIC:-214,MEMORI_TRANSFER_MISSING_DESTINATION_USER:-231,MEMORI_TRANSFER_INVALID_DESTINATION_USER_ID:-232,MEMORI_TRANSFER_DESTINATION_USER_DATA_INCONSISTENT:-233,MEMORI_TRANSFER_NOTHING_TO_DO:-234,MEMORI_CONFIGURATION_CANT_BE_CHANGED:-251,MEMORI_MISSING_NEW_PASSWORD:-252,MEMORI_SESSIONS_INVALID_DATE_FROM_FORMAT:-261,MEMORI_SESSIONS_INVALID_DATE_TO_FORMAT:-262,INTEGRATION_NOT_FOUND:-301,INTEGRATION_INVALID_TYPE:-401,INTEGRATION_ALREADY_EXISTS:-402,INTEGRATION_MEMORI_IS_NOT_PUBLIC:-403,INTEGRATION_MISSING_INVOCATION_TEXT:-404,INTEGRATION_MISSING_DEVICE_EMAILS:-405,INTEGRATION_MEMORI_IS_EMPTY:-406,INTEGRATION_MISSING_PRIVACY_POLICY:-407,INTEGRATION_MISSING_CATEGORY:-408,INTEGRATION_MISSING_DESCRIPTION:-409,INTEGRATION_INVALID_INVOCATION_TEXT:-410,INTEGRATION_GOOGLE_NO_MORE_AVAILABLE:-411,UPLOAD_REQUIRES_MULTIPART_ENCODING:-501,UPLOAD_MISSING_CONTENT_TYPE_BOUNDARY:-502,UPLOAD_MAX_LENGTH_EXCEEDED:-503,UPLOAD_FILE_IS_EMPTY:-504,UPLOAD_INVALID_FILE_TYPE_OR_SIGNATURE:-505,UPLOAD_MISSING_FILE_NAME:-506,UPLOAD_INVALID_MEMORY_ID:-507,UPLOAD_MISSING_FILE_CONTENT:-508,ASSET_NOT_FOUND:-601,ASSET_NOT_ACCESSIBLE:-602,ASSET_MISSING_SESSION_ID:-603,ASSET_INVALID_FILE_NAME:-604,INVITATION_NOT_FOUND:-701,INVITATION_NOT_ACCESSIBLE:-702,INVITATION_ALREADY_ACCEPTED:-703,INVITATION_ALREADY_REJECTED:-704,INVITATION_MISSING_DESTINATION_EMAIL:-705,INVITATION_DESTINATION_EMAIL_INVALID:-706,INVITATION_MISSING_TAG:-707,INVITATION_MISSING_PIN:-708,INVITATION_INVALID_PIN:-709,INVITATION_INVALID_TYPE:-710,INVITATION_MISSING_DESTINATION_NAME:-711,INVITATION_TAG_PIN_CANT_BE_CHANGED:-712,INVITATION_CANT_BE_CHANGED:-713,ACTIONLOG_INVALID_USER_ID:-801,ACTIONLOG_INVALID_DATE_FROM_FORMAT:-802,ACTIONLOG_INVALID_DATE_TO_FORMAT:-803,ACTIONLOG_INVALID_MEMORI_ID:-804,CONSUMPTIONLOG_INVALID_TYPE:-901,CONSUMPTIONLOG_INVALID_DATE_FROM_FORMAT:-902,CONSUMPTIONLOG_INVALID_DATE_TO_FORMAT:-903,CONSUMPTIONLOG_INVALID_USER_ID:-904,CONSUMPTIONLOG_INVALID_MEMORI_ID:-905}).map((([key,value])=>[value,key]))),getErrori18nKey=errorCode=>{if(!errorCode)return"error.generic";if(401===errorCode||403===errorCode)return"error.unauthorized";if(404===errorCode)return"error.notFound";if(422===errorCode)return"error.unprocessableEntity";if(500===errorCode)return"internal server error";let error=BACKEND_ERRORS.get(errorCode);return error?`errors.${error}`:"error.generic"}},"./src/components/AttachmentMediaModal/AttachmentMediaModal.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var _AttachmentMediaModal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/AttachmentMediaModal/AttachmentMediaModal.tsx"),_memori_ai_memori_api_client__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@memori.ai/memori-api-client/esm/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/jsx-runtime.js");const client=(0,_memori_ai_memori_api_client__WEBPACK_IMPORTED_MODULE_2__.Z)(),__WEBPACK_DEFAULT_EXPORT__={title:"AttachmentMediaModal",component:_AttachmentMediaModal__WEBPACK_IMPORTED_MODULE_1__.Z,parameters:{controls:{expanded:!0},layout:"fullscreen"}},Template=args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AttachmentMediaModal__WEBPACK_IMPORTED_MODULE_1__.Z,{...args});Template.displayName="Template";const Default=Template.bind({});Default.args={visible:!0,uploadAssetURL:client.backend.getUploadAssetURL("edaf4de9-3e94-4aff-8bee-42c9aa6c7b40","6573844d-a7cd-47ef-9e78-840d82020c21"),sessionID:"edaf4de-3e94-4aff-8bee-42c9aa6c7b41",authToken:"edaf4de-3e94-4aff-8bee-42c9aa6c7b42",tenantID:"app.memorytwin.com",deleteAsset:(_token,_assetURL)=>Promise.resolve({resultCode:0,resultMessage:"OK",requestID:"edaf4de9-3e94-4aff-8bee-42c9aa6c7b43",requestDateTime:"2021-05-05T12:00:00.000Z"}),onCancel:()=>{},onOk:_asset=>Promise.resolve()};const __namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => /*#__PURE__*/_jsx(AttachmentMediaModal, {\n  ...args\n})",...Default.parameters?.docs?.source}}}}}]);