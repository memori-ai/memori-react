"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = require("react");
const lil_gui_1 = tslib_1.__importDefault(require("lil-gui"));
const AnimationControlPanel = ({ onBaseActionChange, baseActions, modifyTimeScale, onMorphTargetInfluencesChange, onMorphTargetDictionaryChange, morphTargetDictionary, timeScale, }) => {
    const guiRef = (0, react_1.useRef)(null);
    const panelSettingsRef = (0, react_1.useRef)({
        'modify time scale': timeScale,
    });
    const crossFadeControlsRef = (0, react_1.useRef)([]);
    (0, react_1.useEffect)(() => {
        const gui = new lil_gui_1.default({ width: 310 });
        guiRef.current = gui;
        const folder1 = gui.addFolder('Base Actions');
        const folder2 = gui.addFolder('Additive Action Weights');
        const folder3 = gui.addFolder('General Speed');
        const baseNames = ['None', ...Object.keys(baseActions)];
        baseNames.forEach(name => {
            const settings = baseActions[name];
            panelSettingsRef.current[name] = () => {
                onBaseActionChange(name, '');
            };
            const control = folder1.add(panelSettingsRef.current, name);
            crossFadeControlsRef.current.push(control);
        });
        Object.entries(morphTargetDictionary).forEach(([name, settings]) => {
            panelSettingsRef.current[name] = settings / 100;
            folder2
                .add(panelSettingsRef.current, name, -1.0, 1.0, 0.01)
                .listen()
                .onChange((weight) => {
                onMorphTargetInfluencesChange({ [name]: weight });
            });
        });
        folder3
            .add(panelSettingsRef.current, 'modify time scale', 0.0, 1.5, 0.01)
            .onChange((value) => {
            modifyTimeScale(value);
        });
        folder1.open();
        folder2.open();
        folder3.open();
        return () => {
            gui.destroy();
        };
    }, [
        onBaseActionChange,
        onMorphTargetInfluencesChange,
        onMorphTargetDictionaryChange,
        modifyTimeScale,
        baseActions,
        morphTargetDictionary,
        timeScale
    ]);
    return null;
};
exports.default = AnimationControlPanel;
//# sourceMappingURL=controls.js.map