"use strict";(self.webpackChunk_memori_ai_memori_react=self.webpackChunk_memori_ai_memori_react||[]).push([[8337],{"./src/components/Avatar/AvatarView/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>ContainerAvatarView});var react=__webpack_require__("./node_modules/react/index.js"),react_three_fiber_esm=__webpack_require__("./node_modules/@react-three/fiber/dist/react-three-fiber.esm.js"),SpotLight=__webpack_require__("./node_modules/@react-three/drei/core/SpotLight.js"),Environment=__webpack_require__("./node_modules/@react-three/drei/core/Environment.js"),OrbitControls=__webpack_require__("./node_modules/@react-three/drei/core/OrbitControls.js"),utils=__webpack_require__("./src/helpers/utils.ts"),lil_gui_esm=__webpack_require__("./node_modules/lil-gui/dist/lil-gui.esm.js");const components_controls=({onBaseActionChange,baseActions,modifyTimeScale,onMorphTargetInfluencesChange,onMorphTargetDictionaryChange,morphTargetDictionary,timeScale})=>{const guiRef=(0,react.useRef)(null),panelSettingsRef=(0,react.useRef)({"modify time scale":timeScale}),crossFadeControlsRef=(0,react.useRef)([]);return(0,react.useEffect)((()=>{const gui=new lil_gui_esm.ZP({width:310});guiRef.current=gui;const folder1=gui.addFolder("Base Actions"),folder2=gui.addFolder("Additive Action Weights"),folder3=gui.addFolder("General Speed");return["None",...Object.keys(baseActions)].forEach((name=>{baseActions[name];panelSettingsRef.current[name]=()=>{onBaseActionChange(name)};const control=folder1.add(panelSettingsRef.current,name);crossFadeControlsRef.current.push(control)})),Object.entries(morphTargetDictionary).forEach((([name,settings])=>{panelSettingsRef.current[name]=settings/100,folder2.add(panelSettingsRef.current,name,-1,1,.01).listen().onChange((weight=>{onMorphTargetInfluencesChange({[name]:weight})}))})),folder3.add(panelSettingsRef.current,"modify time scale",0,1.5,.01).onChange((value=>{modifyTimeScale(value)})),folder1.open(),folder2.open(),folder3.open(),()=>{gui.destroy()}}),[onBaseActionChange,onMorphTargetInfluencesChange,onMorphTargetDictionaryChange,modifyTimeScale,baseActions,morphTargetDictionary,timeScale]),null};try{controls.displayName="controls",controls.__docgenInfo={description:"",displayName:"controls",props:{baseActions:{defaultValue:null,description:"",name:"baseActions",required:!0,type:{name:"Record<string, BaseAction>"}},onBaseActionChange:{defaultValue:null,description:"",name:"onBaseActionChange",required:!0,type:{name:"(action: string) => void"}},currentBaseAction:{defaultValue:null,description:"",name:"currentBaseAction",required:!0,type:{name:"{ action: string; weight: number; }"}},onMorphTargetInfluencesChange:{defaultValue:null,description:"",name:"onMorphTargetInfluencesChange",required:!0,type:{name:"(influences: { [key: string]: number; }) => void"}},onMorphTargetDictionaryChange:{defaultValue:null,description:"",name:"onMorphTargetDictionaryChange",required:!0,type:{name:"(dictionary: { [key: string]: number; }) => void"}},morphTargetDictionary:{defaultValue:null,description:"",name:"morphTargetDictionary",required:!0,type:{name:"{ [key: string]: number; }"}},modifyTimeScale:{defaultValue:null,description:"",name:"modifyTimeScale",required:!0,type:{name:"(value: number) => void"}},timeScale:{defaultValue:null,description:"",name:"timeScale",required:!0,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/AvatarComponent/components/controls.tsx#controls"]={docgenInfo:controls.__docgenInfo,name:"controls",path:"src/components/Avatar/AvatarView/AvatarComponent/components/controls.tsx#controls"})}catch(__react_docgen_typescript_loader_error){}var three_module=__webpack_require__("./node_modules/three/build/three.module.js"),useGLTF=__webpack_require__("./node_modules/@react-three/drei/core/useGLTF.js"),useAnimations=__webpack_require__("./node_modules/@react-three/drei/core/useAnimations.js");const DEFAULT_BLINK_CONFIG={minInterval:1e3,maxInterval:5e3,blinkDuration:150};function useAvatarBlink({enabled,setMorphTargetInfluences,config={}}){const blinkTimeoutRef=(0,react.useRef)(),isBlinkingRef=(0,react.useRef)(!1),lastBlinkTime=(0,react.useRef)(0),blinkConfig={...DEFAULT_BLINK_CONFIG,...config},blink=(0,react.useCallback)((()=>{enabled&&!isBlinkingRef.current&&(isBlinkingRef.current=!0,setMorphTargetInfluences((prev=>({...prev,eyesClosed:1}))),setTimeout((()=>{setMorphTargetInfluences((prev=>({...prev,eyesClosed:0}))),isBlinkingRef.current=!1,lastBlinkTime.current=Date.now(),scheduleNextBlink()}),blinkConfig.blinkDuration))}),[enabled,blinkConfig.blinkDuration,setMorphTargetInfluences]),scheduleNextBlink=(0,react.useCallback)((()=>{blinkTimeoutRef.current&&clearTimeout(blinkTimeoutRef.current);const nextBlinkDelay=Math.random()*(blinkConfig.maxInterval-blinkConfig.minInterval)+blinkConfig.minInterval;blinkTimeoutRef.current=setTimeout(blink,nextBlinkDelay)}),[blink,blinkConfig.maxInterval,blinkConfig.minInterval]);return(0,react.useEffect)((()=>(enabled?scheduleNextBlink():(blinkTimeoutRef.current&&clearTimeout(blinkTimeoutRef.current),setMorphTargetInfluences((prevInfluences=>({...prevInfluences,eyesClosed:0})))),()=>{blinkTimeoutRef.current&&clearTimeout(blinkTimeoutRef.current)})),[enabled,scheduleNextBlink,setMorphTargetInfluences]),{isBlinking:isBlinkingRef.current,lastBlinkTime:lastBlinkTime.current,triggerBlink:blink}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const AVATAR_POSITION=new three_module.Vector3(0,-1,0),AVATAR_ROTATION=new three_module.Euler(.175,0,0),AVATAR_POSITION_ZOOMED=new three_module.Vector3(0,-1.45,0),ANIMATION_URLS={MALE:"https://assets.memori.ai/api/v2/asset/1c350a21-97d8-4add-82cc-9dc10767a26b.glb",FEMALE:"https://assets.memori.ai/api/v2/asset/c2b07166-de10-4c66-918b-7b7cd380cca7.glb"};function FullbodyAvatar({url,sex,onLoaded,currentBaseAction,timeScale,isZoomed,setMorphTargetInfluences,setMorphTargetDictionary,morphTargetInfluences,eyeBlink,setMeshRef,clearVisemes}){const{scene}=(0,useGLTF.L)(url),{animations}=(0,useGLTF.L)(ANIMATION_URLS[sex]),{nodes,materials}=(0,react_three_fiber_esm.n4)(scene),{actions}=(0,useAnimations.v)(animations,scene),[mixer]=(0,react.useState)((()=>new three_module.AnimationMixer(scene))),avatarMeshRef=(0,react.useRef)(),currentActionRef=(0,react.useRef)(null),isTransitioningRef=(0,react.useRef)(!1);useAvatarBlink({enabled:eyeBlink||!1,setMorphTargetInfluences,config:{minInterval:1500,maxInterval:4e3,blinkDuration:120}});const transitionToIdle=(0,react.useCallback)((()=>{if(!actions||isTransitioningRef.current)return;isTransitioningRef.current=!0;const startIdleAnimation=()=>{const idleAnimations=Object.keys(actions).filter((key=>key.startsWith("Idle"))),randomIdle=idleAnimations[Math.floor(Math.random()*idleAnimations.length)],idleAction=actions[randomIdle];currentActionRef.current&&currentActionRef.current.fadeOut(.5),idleAction?.reset().fadeIn(.5).play(),currentActionRef.current=idleAction,setTimeout((()=>{isTransitioningRef.current=!1}),1e3)};currentActionRef.current&&!currentActionRef.current.getClip().name.startsWith("Idle")?(()=>{if(currentActionRef.current&&!currentActionRef.current.paused){const remainingTime=1e3*(currentActionRef.current.getClip().duration-currentActionRef.current.time);setTimeout((()=>{startIdleAnimation()}),remainingTime)}else startIdleAnimation()})():startIdleAnimation()}),[actions]);return(0,react.useEffect)((()=>{if(!actions||!currentBaseAction.action||isTransitioningRef.current)return;const newAction=actions[currentBaseAction.action];if(!newAction)return void console.warn(`Animation "${currentBaseAction.action}" not found in actions.`);currentBaseAction.action.startsWith("Idle")||setTimeout((()=>{transitionToIdle()}),3e3),currentActionRef.current&&currentActionRef.current.fadeOut(.8),newAction.timeScale=timeScale,newAction.reset().fadeIn(.8).play(),currentActionRef.current=newAction}),[currentBaseAction,timeScale,actions,transitionToIdle]),(0,react.useEffect)((()=>((0,utils.lc)(materials),scene.traverse((object=>{if(object instanceof three_module.SkinnedMesh&&("GBNL__Head"===object.name||"Wolf3D_Avatar"===object.name)&&(avatarMeshRef.current=object,setMeshRef(object),object.morphTargetDictionary&&object.morphTargetInfluences)){setMorphTargetDictionary(object.morphTargetDictionary);const initialInfluences=Object.keys(object.morphTargetDictionary).reduce(((acc,key)=>({...acc,[key]:0})),{});setMorphTargetInfluences(initialInfluences)}})),onLoaded?.(),()=>{Object.values(materials).forEach(react_three_fiber_esm.B9),Object.values(nodes).filter(utils.Av).forEach(react_three_fiber_esm.B9),clearVisemes()})),[materials,nodes,url,onLoaded,setMorphTargetDictionary,setMorphTargetInfluences,setMeshRef,clearVisemes]),(0,react_three_fiber_esm.xQ)(((_,delta)=>{avatarMeshRef.current&&avatarMeshRef.current.morphTargetDictionary&&function updateMorphTargetInfluences(){Object.entries(morphTargetInfluences).forEach((([key,value])=>{const index=avatarMeshRef.current.morphTargetDictionary[key];if("number"==typeof index&&avatarMeshRef.current.morphTargetInfluences){const currentValue=avatarMeshRef.current.morphTargetInfluences[index],smoothValue=currentValue*(1-(alpha=.1))+value*alpha;avatarMeshRef.current.morphTargetInfluences[index]=smoothValue}var alpha}))}(),mixer.update(.001*delta)})),(0,jsx_runtime.jsx)("group",{position:isZoomed?AVATAR_POSITION_ZOOMED:AVATAR_POSITION,rotation:AVATAR_ROTATION,children:(0,jsx_runtime.jsx)("primitive",{object:scene})})}FullbodyAvatar.displayName="FullbodyAvatar";try{fullbodyAvatar.displayName="fullbodyAvatar",fullbodyAvatar.__docgenInfo={description:"",displayName:"fullbodyAvatar",props:{url:{defaultValue:null,description:"",name:"url",required:!0,type:{name:"string"}},sex:{defaultValue:null,description:"",name:"sex",required:!0,type:{name:"enum",value:[{value:'"MALE"'},{value:'"FEMALE"'}]}},onLoaded:{defaultValue:null,description:"",name:"onLoaded",required:!1,type:{name:"(() => void)"}},currentBaseAction:{defaultValue:null,description:"",name:"currentBaseAction",required:!0,type:{name:"{ action: string; weight: number; }"}},timeScale:{defaultValue:null,description:"",name:"timeScale",required:!0,type:{name:"number"}},loading:{defaultValue:null,description:"",name:"loading",required:!1,type:{name:"boolean"}},speaking:{defaultValue:null,description:"",name:"speaking",required:!1,type:{name:"boolean"}},isZoomed:{defaultValue:null,description:"",name:"isZoomed",required:!1,type:{name:"boolean"}},setMorphTargetInfluences:{defaultValue:null,description:"",name:"setMorphTargetInfluences",required:!0,type:{name:"(influences: { [key: string]: number; }) => void"}},setMorphTargetDictionary:{defaultValue:null,description:"",name:"setMorphTargetDictionary",required:!0,type:{name:"(dictionary: { [key: string]: number; }) => void"}},morphTargetInfluences:{defaultValue:null,description:"",name:"morphTargetInfluences",required:!0,type:{name:"{ [key: string]: number; }"}},morphTargetDictionary:{defaultValue:null,description:"",name:"morphTargetDictionary",required:!0,type:{name:"{ [key: string]: number; }"}},setMeshRef:{defaultValue:null,description:"",name:"setMeshRef",required:!0,type:{name:"any"}},eyeBlink:{defaultValue:null,description:"",name:"eyeBlink",required:!1,type:{name:"boolean"}},clearVisemes:{defaultValue:null,description:"",name:"clearVisemes",required:!0,type:{name:"() => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/AvatarComponent/components/fullbodyAvatar.tsx#fullbodyAvatar"]={docgenInfo:fullbodyAvatar.__docgenInfo,name:"fullbodyAvatar",path:"src/components/Avatar/AvatarView/AvatarComponent/components/fullbodyAvatar.tsx#fullbodyAvatar"})}catch(__react_docgen_typescript_loader_error){}const utils_lerp=(start,end,time=.05)=>start*(1-time)+end*time,mapRange=(value,inMin,inMax,outMin,outMax)=>((value=((value,min,max)=>Math.min(Math.max(value,min),max))(value,inMin,inMax))-inMin)*(outMax-outMin)/(inMax-inMin)+outMin,rad=Math.PI/180;let timeout,useHeadMovement_reset=!1;const targetPos=new three_module.Vector2(0,0),currentPos=new three_module.Vector2(0,0),setResetTrue=()=>{timeout=setTimeout((()=>{useHeadMovement_reset=!0}),1e3)},setResetFalse=()=>{clearTimeout(timeout),useHeadMovement_reset=!1};const halfbodyAvatar_AVATAR_POSITION=new three_module.Vector3(0,-.6,0);function HalfBodyAvatar({url,setMorphTargetInfluences,setMorphTargetDictionary,headMovement,eyeBlink,setMeshRef,onLoaded,clearVisemes,morphTargetInfluences}){const{scene}=(0,useGLTF.L)(url),{nodes,materials}=(0,react_three_fiber_esm.n4)(scene),avatarMeshRef=(0,react.useRef)(null);useAvatarBlink({enabled:eyeBlink||!1,setMorphTargetInfluences,config:{minInterval:1500,maxInterval:4e3,blinkDuration:120}}),function useHeadMovement(enabled,nodes){const{gl}=(0,react_three_fiber_esm.Ky)();(0,react.useEffect)((()=>{if(enabled)return gl.domElement.addEventListener("mouseleave",setResetTrue),gl.domElement.addEventListener("mouseenter",setResetFalse),()=>{gl.domElement.removeEventListener("mouseleave",setResetTrue),gl.domElement.removeEventListener("mouseenter",setResetFalse)}}),[gl.domElement,enabled]),(0,react_three_fiber_esm.xQ)((state=>{if(!enabled||!nodes?.Neck||!nodes?.Head)return;const cameraRotation=Math.abs(state.camera.rotation.z);!useHeadMovement_reset&&cameraRotation<.2?(targetPos.x=mapRange(state.mouse.y,-1,1,5*rad,-5*rad),targetPos.y=mapRange(state.mouse.x,-1,1,-10*rad,10*rad)):targetPos.set(0,0),currentPos.x=utils_lerp(currentPos.x,targetPos.x),currentPos.y=utils_lerp(currentPos.y,targetPos.y),nodes.Neck.rotation.x=currentPos.x+.1,nodes.Neck.rotation.y=currentPos.y,nodes.Head.rotation.x=2*currentPos.x,nodes.Head.rotation.y=2*currentPos.y}))}(headMovement,nodes),(0,react.useEffect)((()=>((()=>{(nodes=>{nodes.Wolf3D_Hands&&(nodes.Wolf3D_Hands.visible=!1),nodes.RightHand&&nodes.LeftHand&&(nodes.RightHand.position.set(0,-2,0),nodes.LeftHand.position.set(0,-2,0))})(nodes),(0,utils.lc)(materials);const firstSkinnedMesh=Object.values(nodes).find(utils.Av);if(firstSkinnedMesh&&(setMeshRef(firstSkinnedMesh),avatarMeshRef.current=firstSkinnedMesh,firstSkinnedMesh.morphTargetDictionary&&firstSkinnedMesh.morphTargetInfluences)){setMorphTargetDictionary(firstSkinnedMesh.morphTargetDictionary);const initialInfluences=Object.keys(firstSkinnedMesh.morphTargetDictionary).reduce(((acc,key)=>({...acc,[key]:0})),{});setMorphTargetInfluences(initialInfluences)}onLoaded?.()})(),()=>{Object.values(materials).forEach(react_three_fiber_esm.B9),Object.values(nodes).filter(utils.Av).forEach(react_three_fiber_esm.B9),clearVisemes()})),[materials,nodes,url,onLoaded,clearVisemes]);const skinnedMeshes=(0,react.useMemo)((()=>Object.values(nodes).filter(utils.Av)),[nodes]);return(0,react_three_fiber_esm.xQ)((_=>{avatarMeshRef.current&&avatarMeshRef.current.morphTargetDictionary&&function updateMorphTargetInfluences(){Object.entries(morphTargetInfluences).forEach((([key,value])=>{const index=avatarMeshRef.current.morphTargetDictionary[key];if("number"==typeof index&&avatarMeshRef.current.morphTargetInfluences){const currentValue=avatarMeshRef.current.morphTargetInfluences[index],smoothValue=currentValue*(1-(alpha=.1))+value*alpha;avatarMeshRef.current.morphTargetInfluences[index]=smoothValue}var alpha}))}()})),(0,jsx_runtime.jsxs)("group",{position:halfbodyAvatar_AVATAR_POSITION,children:[nodes.Hips&&(0,jsx_runtime.jsx)("primitive",{object:nodes.Hips},"armature"),skinnedMeshes.map((node=>node&&(0,jsx_runtime.jsx)("primitive",{object:node,receiveShadow:!0,castShadow:!0},node.name)))]})}HalfBodyAvatar.displayName="HalfBodyAvatar";try{halfbodyAvatar.displayName="halfbodyAvatar",halfbodyAvatar.__docgenInfo={description:"",displayName:"halfbodyAvatar",props:{url:{defaultValue:null,description:"",name:"url",required:!0,type:{name:"string"}},setMorphTargetInfluences:{defaultValue:null,description:"",name:"setMorphTargetInfluences",required:!0,type:{name:"(morphTargetInfluences: any) => void"}},headMovement:{defaultValue:null,description:"",name:"headMovement",required:!1,type:{name:"boolean"}},speaking:{defaultValue:null,description:"",name:"speaking",required:!1,type:{name:"boolean"}},onLoaded:{defaultValue:null,description:"",name:"onLoaded",required:!1,type:{name:"(() => void)"}},setMeshRef:{defaultValue:null,description:"",name:"setMeshRef",required:!0,type:{name:"(mesh: Object3D<Event>) => void"}},clearVisemes:{defaultValue:null,description:"",name:"clearVisemes",required:!0,type:{name:"() => void"}},setMorphTargetDictionary:{defaultValue:null,description:"",name:"setMorphTargetDictionary",required:!0,type:{name:"(morphTargetDictionary: any) => void"}},eyeBlink:{defaultValue:null,description:"",name:"eyeBlink",required:!1,type:{name:"boolean"}},morphTargetInfluences:{defaultValue:null,description:"",name:"morphTargetInfluences",required:!0,type:{name:"any"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/AvatarComponent/components/halfbodyAvatar.tsx#halfbodyAvatar"]={docgenInfo:halfbodyAvatar.__docgenInfo,name:"halfbodyAvatar",path:"src/components/Avatar/AvatarView/AvatarComponent/components/halfbodyAvatar.tsx#halfbodyAvatar"})}catch(__react_docgen_typescript_loader_error){}const baseActions={Gioia1:{weight:0},Gioia2:{weight:0},Gioia3:{weight:0},Idle1:{weight:1},Idle2:{weight:0},Idle3:{weight:0},Idle4:{weight:0},Idle5:{weight:0},Rabbia1:{weight:0},Rabbia2:{weight:0},Rabbia3:{weight:0},Sorpresa1:{weight:0},Sorpresa2:{weight:0},Sorpresa3:{weight:0},Timore1:{weight:0},Timore2:{weight:0},Timore3:{weight:0},Tristezza1:{weight:0},Tristezza2:{weight:0},Tristezza3:{weight:0},Loading1:{weight:0},Loading2:{weight:0},Loading3:{weight:0}},avatarComponent_AvatarView=({setMeshRef,clearVisemes,chatEmission,showControls,animation,url,sex,eyeBlink,headMovement,speaking,halfBody,loading,isZoomed,setEmotion})=>{const[currentBaseAction,setCurrentBaseAction]=(0,react.useState)({action:animation||"Idle1",weight:1}),[morphTargetInfluences,setMorphTargetInfluences]=(0,react.useState)({}),[morphTargetDictionary,setMorphTargetDictionary]=(0,react.useState)({}),[timeScale,setTimeScale]=(0,react.useState)(.8),setEmotionMorphTargetInfluences=(0,react.useCallback)((action=>{const emotionMap={Gioia:{Gioria:1},Rabbia:{Rabbia:1},Sorpresa:{Sorpresa:1},Tristezza:{Tristezza:1},Timore:{Timore:1},Loading:{Loading1:1,Loading2:1,Loading3:1}},newEmotion=action.slice(0,-1);setEmotion(newEmotion);const defaultEmotions=Object.keys(emotionMap).reduce(((acc,key)=>(acc[key]=0,acc)),{}),emotion=Object.keys(emotionMap).find((key=>action.startsWith(key)))||"default",emotionValues="default"===emotion?defaultEmotions:emotionMap[emotion];setMorphTargetInfluences((prevInfluences=>({...prevInfluences,...defaultEmotions,...emotionValues})))}),[]),onBaseActionChange=(0,react.useCallback)((action=>{setEmotionMorphTargetInfluences(action),setCurrentBaseAction({action,weight:1})}),[]),onMorphTargetInfluencesChange=(0,react.useCallback)((influences=>{setMorphTargetInfluences((prevInfluences=>({...prevInfluences,...influences})))}),[]),onMorphTargetDictionaryChange=(0,react.useCallback)((dictionary=>{setMorphTargetDictionary(dictionary)}),[]),modifyTimeScale=(0,react.useCallback)((value=>{setTimeScale(value)}),[]);return(0,react.useEffect)((()=>{const hasOutputTag=chatEmission?.includes('<output class="memori-emotion">'),outputContent=hasOutputTag?chatEmission?.split('<output class="memori-emotion">')[1]?.split("</output>")[0]?.trim():null;if(outputContent){const randomNumber=Math.floor(3*Math.random())+1;onBaseActionChange(`${outputContent}${randomNumber}`)}}),[chatEmission]),(0,react.useEffect)((()=>{if(loading){const randomNumber=Math.floor(3*Math.random())+1;onBaseActionChange(`Loading${randomNumber}`)}}),[loading]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[showControls&&(0,jsx_runtime.jsx)(components_controls,{timeScale,morphTargetDictionary,onBaseActionChange,onMorphTargetInfluencesChange,onMorphTargetDictionaryChange,baseActions,currentBaseAction,modifyTimeScale}),halfBody?(0,jsx_runtime.jsx)(HalfBodyAvatar,{url,setMeshRef,setMorphTargetInfluences,headMovement,speaking,eyeBlink,morphTargetInfluences,clearVisemes,setMorphTargetDictionary}):(0,jsx_runtime.jsx)(FullbodyAvatar,{url,sex,eyeBlink,speaking,currentBaseAction,timeScale,setMorphTargetInfluences,setMorphTargetDictionary,morphTargetInfluences,morphTargetDictionary,isZoomed,setMeshRef,clearVisemes})]})};try{avatarComponent_AvatarView.displayName="AvatarView",avatarComponent_AvatarView.__docgenInfo={description:"",displayName:"AvatarView",props:{showControls:{defaultValue:null,description:"",name:"showControls",required:!0,type:{name:"boolean"}},animation:{defaultValue:null,description:"",name:"animation",required:!1,type:{name:"string"}},loading:{defaultValue:null,description:"",name:"loading",required:!0,type:{name:"boolean"}},url:{defaultValue:null,description:"",name:"url",required:!0,type:{name:"string"}},sex:{defaultValue:null,description:"",name:"sex",required:!0,type:{name:"enum",value:[{value:'"MALE"'},{value:'"FEMALE"'}]}},eyeBlink:{defaultValue:null,description:"",name:"eyeBlink",required:!0,type:{name:"boolean"}},headMovement:{defaultValue:null,description:"",name:"headMovement",required:!0,type:{name:"boolean"}},speaking:{defaultValue:null,description:"",name:"speaking",required:!0,type:{name:"boolean"}},isZoomed:{defaultValue:null,description:"",name:"isZoomed",required:!0,type:{name:"boolean"}},chatEmission:{defaultValue:null,description:"",name:"chatEmission",required:!0,type:{name:"any"}},setMeshRef:{defaultValue:null,description:"",name:"setMeshRef",required:!0,type:{name:"any"}},clearVisemes:{defaultValue:null,description:"",name:"clearVisemes",required:!0,type:{name:"() => void"}},setEmotion:{defaultValue:null,description:"",name:"setEmotion",required:!0,type:{name:"(emotion: string) => void"}},halfBody:{defaultValue:null,description:"",name:"halfBody",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/AvatarComponent/avatarComponent.tsx#AvatarView"]={docgenInfo:avatarComponent_AvatarView.__docgenInfo,name:"AvatarView",path:"src/components/Avatar/AvatarView/AvatarComponent/avatarComponent.tsx#AvatarView"})}catch(__react_docgen_typescript_loader_error){}var useProgress=__webpack_require__("./node_modules/@react-three/drei/core/useProgress.js"),Html=__webpack_require__("./node_modules/@react-three/drei/web/Html.js"),Spin=__webpack_require__("./src/components/ui/Spin.tsx");const Loader=({fallbackImg})=>{const{progress}=(0,useProgress.S)();return(0,jsx_runtime.jsx)(Html.V,{center:!0,className:"avatar-loader",children:(0,jsx_runtime.jsx)(Spin.Z,{spinning:!0,children:fallbackImg?(0,jsx_runtime.jsxs)("figure",{children:[(0,jsx_runtime.jsx)("img",{src:fallbackImg,alt:`${Math.round(progress)}% loaded`,title:`${Math.round(progress)}% loaded`}),(0,jsx_runtime.jsx)("figcaption",{children:`${Math.round(progress)}%`})]}):(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[Math.round(progress)," % loaded"]})})})};Loader.displayName="Loader";const components_loader=Loader;try{loader.displayName="loader",loader.__docgenInfo={description:"",displayName:"loader",props:{fallbackImg:{defaultValue:null,description:"",name:"fallbackImg",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/AvatarComponent/components/loader.tsx#loader"]={docgenInfo:loader.__docgenInfo,name:"loader",path:"src/components/Avatar/AvatarView/AvatarComponent/components/loader.tsx#loader"})}catch(__react_docgen_typescript_loader_error){}const defaultStyles={halfBody:{width:"100%",height:"100%",minHeight:"500px",backgroundColor:"white",borderRadius:"100%"},fullBody:{width:"500px",height:"500px",backgroundColor:"white"}},getCameraSettings=(halfBody,isZoomed)=>halfBody?{fov:40,position:[0,0,.6]}:!halfBody&&isZoomed?{fov:44,position:[0,0,1.25]}:{fov:40,position:[0,175e-7,3]},getLightingComponent=()=>(0,utils.Dt)()||(0,utils.Tt)()?(0,jsx_runtime.jsx)(SpotLight.P,{distance:100,position:[-.3,.2,1.25],angle:Math.PI/2,attenuation:5,anglePower:5}):(0,jsx_runtime.jsx)(Environment.qA,{files:"https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/venice_sunset_1k.hdr"});function ContainerAvatarView({url,sex,style,rotateAvatar,eyeBlink,headMovement,speaking,fallback,fallbackImg,halfBody=!0,loading,animation,showControls=!1,isZoomed,chatEmission,setMeshRef,clearVisemes,setEmotion}){return(0,jsx_runtime.jsx)(react_three_fiber_esm.Xz,{style:style||(halfBody?defaultStyles.halfBody:defaultStyles.fullBody),camera:getCameraSettings(halfBody,isZoomed),children:(0,jsx_runtime.jsxs)(react.Suspense,{fallback:fallback||(0,jsx_runtime.jsx)(components_loader,{fallbackImg}),children:[getLightingComponent(),rotateAvatar&&(0,jsx_runtime.jsx)(OrbitControls.z,{enablePan:!1,enableZoom:!1}),(0,jsx_runtime.jsx)(avatarComponent_AvatarView,{url,sex,showControls,loading:loading||!1,animation,isZoomed:isZoomed||!1,eyeBlink:eyeBlink||!1,headMovement:headMovement||!1,speaking:speaking||!1,halfBody:halfBody||!1,chatEmission,setMeshRef,clearVisemes,setEmotion})]})})}ContainerAvatarView.displayName="ContainerAvatarView";try{AvatarView.displayName="AvatarView",AvatarView.__docgenInfo={description:"",displayName:"AvatarView",props:{url:{defaultValue:null,description:"",name:"url",required:!0,type:{name:"string"}},sex:{defaultValue:null,description:"",name:"sex",required:!0,type:{name:"enum",value:[{value:'"MALE"'},{value:'"FEMALE"'}]}},fallbackImg:{defaultValue:null,description:"",name:"fallbackImg",required:!1,type:{name:"string"}},eyeBlink:{defaultValue:null,description:"",name:"eyeBlink",required:!1,type:{name:"boolean"}},headMovement:{defaultValue:null,description:"",name:"headMovement",required:!1,type:{name:"boolean"}},rotateAvatar:{defaultValue:null,description:"",name:"rotateAvatar",required:!1,type:{name:"boolean"}},speaking:{defaultValue:null,description:"",name:"speaking",required:!1,type:{name:"boolean"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},fallback:{defaultValue:null,description:"",name:"fallback",required:!1,type:{name:"ReactNode"}},halfBody:{defaultValue:{value:"true"},description:"",name:"halfBody",required:!1,type:{name:"boolean"}},loading:{defaultValue:null,description:"",name:"loading",required:!1,type:{name:"boolean"}},animation:{defaultValue:null,description:"",name:"animation",required:!1,type:{name:"string"}},showControls:{defaultValue:{value:"false"},description:"",name:"showControls",required:!1,type:{name:"boolean"}},isZoomed:{defaultValue:null,description:"",name:"isZoomed",required:!1,type:{name:"boolean"}},chatEmission:{defaultValue:null,description:"",name:"chatEmission",required:!1,type:{name:"any"}},setMeshRef:{defaultValue:null,description:"",name:"setMeshRef",required:!1,type:{name:"any"}},clearVisemes:{defaultValue:null,description:"",name:"clearVisemes",required:!0,type:{name:"() => void"}},setEmotion:{defaultValue:null,description:"",name:"setEmotion",required:!0,type:{name:"(emotion: string) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Avatar/AvatarView/index.tsx#AvatarView"]={docgenInfo:AvatarView.__docgenInfo,name:"AvatarView",path:"src/components/Avatar/AvatarView/index.tsx#AvatarView"})}catch(__react_docgen_typescript_loader_error){}},"./src/context/visemeContext.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>useViseme,j:()=>VisemeProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const VisemeContext=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(void 0),VISEME_MAP={0:"viseme_sil",1:"viseme_PP",2:"viseme_FF",3:"viseme_TH",4:"viseme_DD",5:"viseme_kk",6:"viseme_CH",7:"viseme_SS",8:"viseme_nn",9:"viseme_RR",10:"viseme_aa",11:"viseme_E",12:"viseme_I",13:"viseme_O",14:"viseme_U",15:"viseme_kk",16:"viseme_CH",17:"viseme_SS",18:"viseme_TH",19:"viseme_RR",20:"viseme_kk",21:"viseme_PP"},VisemeProvider=({children})=>{const[isMeshSet,setIsMeshSet]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),[emotion,setEmotion]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("Neutral"),isAnimatingRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),currentVisemesRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),visemeQueueRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),animationFrameRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),startTimeRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),currentVisemeWeightRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({}),meshRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),setMeshRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((mesh=>{mesh&&mesh.morphTargetDictionary&&mesh.morphTargetInfluences?(meshRef.current=mesh,setIsMeshSet(!0)):console.error("Invalid mesh provided:",mesh)}),[meshRef]),addVisemeToQueue=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((viseme=>{visemeQueueRef.current.push(viseme)}),[]),getCurrentViseme=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((elapsedTime=>elapsedTime<.01?null:currentVisemesRef.current.find(((viseme,index)=>{const nextViseme=currentVisemesRef.current[index+1];return elapsedTime>=viseme.startTime&&(!nextViseme||elapsedTime<nextViseme.startTime)}))),[]),applyViseme=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(((viseme,elapsedTime)=>{if(!meshRef.current)return void console.error("Mesh not set");const visemeProgress=Math.min((elapsedTime-viseme.startTime)/viseme.duration,1),dynamicSpeedFactor=.1/viseme.duration*1*1;const easedProgress=(x=visemeProgress*dynamicSpeedFactor)<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;var x;const targetWeight=Math.sin(easedProgress*Math.PI)*viseme.weight;var alpha;currentVisemeWeightRef.current[viseme.name]=(currentVisemeWeightRef.current[viseme.name]||0)*(1-(alpha=.5))+targetWeight*alpha;const visemeIndex=meshRef.current.morphTargetDictionary?.[viseme.name];"number"==typeof visemeIndex&&meshRef.current.morphTargetInfluences?meshRef.current.morphTargetInfluences[visemeIndex]=currentVisemeWeightRef.current[viseme.name]:console.error(`Viseme not found in morph target dictionary: ${viseme.name}`)}),[]),animate=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((time=>{null===startTimeRef.current&&(startTimeRef.current=time);const elapsedTime=(time-startTimeRef.current)/1e3*1,currentViseme=getCurrentViseme(elapsedTime);currentViseme&&applyViseme(currentViseme,elapsedTime),currentVisemesRef.current.length>0&&elapsedTime<currentVisemesRef.current[currentVisemesRef.current.length-1].startTime+currentVisemesRef.current[currentVisemesRef.current.length-1].duration?animationFrameRef.current=requestAnimationFrame(animate):clearVisemes()}),[getCurrentViseme,applyViseme]),processVisemeQueue=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((()=>{const azureVisemes=[...visemeQueueRef.current];if(visemeQueueRef.current=[],0===azureVisemes.length)return[];const processedVisemes=azureVisemes.map(((currentViseme,i)=>{const nextViseme=azureVisemes[i+1],duration=nextViseme?(nextViseme.audioOffset-currentViseme.audioOffset)/1e7:.1;return{name:VISEME_MAP[currentViseme.visemeId]||"viseme_sil",duration,weight:1,startTime:currentViseme.audioOffset/1e7}}));if(currentVisemesRef.current=processedVisemes,isAnimatingRef.current){if(null!==startTimeRef.current){const currentTime=performance.now(),elapsedTime=(currentTime-startTimeRef.current)/1e3*1;startTimeRef.current=currentTime-elapsedTime/1*1e3}}else isAnimatingRef.current=!0,startTimeRef.current=performance.now(),animationFrameRef.current=requestAnimationFrame(animate);return processedVisemes}),[isMeshSet,animate]),clearVisemes=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((()=>{currentVisemesRef.current=[],visemeQueueRef.current=[],null!==animationFrameRef.current&&(cancelAnimationFrame(animationFrameRef.current),animationFrameRef.current=null),meshRef.current?.morphTargetDictionary&&meshRef.current?.morphTargetInfluences&&Object.values(meshRef.current.morphTargetDictionary).forEach((index=>{"number"==typeof index&&(meshRef.current.morphTargetInfluences[index]=0)})),currentVisemeWeightRef.current={},startTimeRef.current=null,isAnimatingRef.current=!1}),[]),emotionToAzureStyleMap={Gioia:"cheerful",Rabbia:"angry",Sorpresa:"excited",Tristezza:"sad",Timore:"terrified"};(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>()=>{null!==animationFrameRef.current&&cancelAnimationFrame(animationFrameRef.current)}),[]);const contextValue={setMeshRef,addVisemeToQueue,processVisemeQueue,clearVisemes,isMeshSet,setEmotion,emotion,getAzureStyleForEmotion:function getAzureStyleForEmotion(emotion){return emotionToAzureStyleMap[emotion]||"neutral"}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(VisemeContext.Provider,{value:contextValue,children})};VisemeProvider.displayName="VisemeProvider";const useViseme=()=>{const context=(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(VisemeContext);if(void 0===context)throw new Error("useViseme must be used within a VisemeProvider");return context};try{VisemeProvider.displayName="VisemeProvider",VisemeProvider.__docgenInfo={description:"",displayName:"VisemeProvider",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/context/visemeContext.tsx#VisemeProvider"]={docgenInfo:VisemeProvider.__docgenInfo,name:"VisemeProvider",path:"src/context/visemeContext.tsx#VisemeProvider"})}catch(__react_docgen_typescript_loader_error){}}}]);