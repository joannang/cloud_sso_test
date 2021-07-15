import React from "react";
import { useState } from "react";
import { useStores } from "./stores/StoreProvider";
import { Modal, Button, Input } from "antd";
import { Observer } from "mobx-react";

const LinkModal = () => {
  const { testStore } = useStores();
  const [wallet, setWallet] = useState("");

  const onChangeAddr = (e: any) => {
    setWallet(e.target.value);
  };

  const onSubmit = () => {
    console.log(testStore.modalOpen);
    testStore.setTestWalletAddress(wallet);
    testStore.setModalOpen(false);
  };

  const { TextArea } = Input;

  return (
    <Observer
      render={() => (
        <Modal
          title="Link a wallet by Wallet Address"
          visible={testStore.modalOpen}
          onOk={onSubmit}
          onCancel={() => testStore.setModalOpen(false)}
          footer={[
            <Button key="back" onClick={() => testStore.setModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={onSubmit}>
              Link Wallet
            </Button>,
          ]}
        >
          <TextArea rows={3} onChange={onChangeAddr}></TextArea>
        </Modal>
      )}
    />
  );
};

export default LinkModal;
