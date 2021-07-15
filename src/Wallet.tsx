import React from "react";
import { useState, useEffect } from "react";
import { useStores } from "./stores/StoreProvider";
import { Button, Card, Row, Col, Avatar, List } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Observer } from "mobx-react";
import LinkModal from './LinkModal'

const Wallet: React.FC = () => {
  const { testStore } = useStores();

  const linkWallet = () => {
      testStore.setModalOpen(true)
  };

  const data = [
    {
      title: "Address:",
      description: "0xffeb2ac156e8c53bf5b50af07...",
      color: "#FFFF99",
    },
    {
      title: "Address:",
      description: "0x66eb2ac156e8c53bfb50af07a...",
      color: "#dadada",
    },
  ];

  const addData = {
    title: "Address:",
    description: "0x4433d156e8c53bf5b50af07aa...",
    color: "#baebe1",
  };

  return (
    <Observer
      render={() => (
        <Col style={{ width: "90%", marginLeft: "5%", marginTop: "10%" }}>
          <Card
            title="Active Wallet"
            extra={
              <span>
                <EditOutlined />
              </span>
            }
          >
            <List itemLayout="horizontal">
              <List.Item>
                <List.Item.Meta
                  title={"Address:"}
                  description={"0xffeb2ac156e8c53bf5b50af07..."}
                  avatar={
                    <Button
                      style={{ background: "#FFFF99", borderColor: "white" }}
                      shape="circle"
                    >
                      {" "}
                    </Button>
                  }
                />
              </List.Item>
            </List>
          </Card>
          &nbsp;
          <div>
            <Card
              title="My Wallets"
              extra={
                <span>
                  <EditOutlined /> &nbsp; <PlusOutlined onClick={linkWallet} />
                </span>
              }
            >
              <List itemLayout="horizontal">
                <List.Item>
                  <List.Item.Meta
                    title={"Address: "}
                    description={"0xffeb2ac156e8c53bf5b50af07..."}
                    avatar={
                      <Button
                        style={{ background: "#FFFF99", borderColor: "white" }}
                        shape="circle"
                      >
                        {" "}
                      </Button>
                    }
                  />
                </List.Item>
                <List.Item>
                  <List.Item.Meta
                    title={"Address: "}
                    description={"0x66eb2ac156e8c53bfb50af07a..."}
                    avatar={
                      <Button
                        style={{ background: "#dadada", borderColor: "white" }}
                        shape="circle"
                      >
                        {" "}
                      </Button>
                    }
                  />
                </List.Item>
                {(testStore.testWalletAddress !== "") && (
                  <List.Item>
                    <List.Item.Meta
                      title={addData.title}
                      description={addData.description}
                      avatar={
                        <Button
                          style={{
                            background: "#baebe1",
                            borderColor: "white",
                          }}
                          shape="circle"
                        >
                          {" "}
                        </Button>
                      }
                    />
                  </List.Item>
                )}
              </List>
            </Card>
          </div>
          {/* link modal */}
         <LinkModal/>
        </Col>
      )}
    />
  );
};

export default Wallet;
