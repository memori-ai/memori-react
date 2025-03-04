import { Dialog } from "@headlessui/react";

import { Transition } from "@headlessui/react";
import { FC } from "react";
import Button from "./Button";
import React from "react";
import "./ConfirmDialog.css";
// Custom confirm dialog component
const ConfirmDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
  }> = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    return (
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="memori-confirm-dialog" onClose={onClose}>
          <div className="memori-confirm-dialog--backdrop" />
          <div className="memori-confirm-dialog--container">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="memori-confirm-dialog--panel">
                <Dialog.Title className="memori-confirm-dialog--title">{title}</Dialog.Title>
                <Dialog.Description className="memori-confirm-dialog--message">
                  {message}
                </Dialog.Description>
                <div className="memori-confirm-dialog--actions">
                  <Button  onClick={onClose}>
                    {cancelText}
                  </Button>
                  <Button primary onClick={onConfirm}>
                    {confirmText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    );
  };


export default ConfirmDialog;