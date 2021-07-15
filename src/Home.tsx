import React from "react";
import { signIn, signOut } from "./msal/authRedirect";
import { Button, Card, Row, Col, Layout, List } from "antd";
import { useStores } from "./stores/StoreProvider";
import { Observer } from "mobx-react";
import { styles } from "./stylesheet";

const HomePage: React.FC = () => {
  const { testStore } = useStores();

  return (
    <Observer
      render={() => (
        <Card style={styles.button}>
          <Row style={{paddingBottom: '2%'}}>
            <Col lg={6} md={4}></Col>
            <Col xs={24} lg={12} md={12}>
              {testStore.homeAccountId !== "" && (
                <div>Welcome!</div>
              )}
              {testStore.homeAccountId === "" ? (
                <Button type="default" onClick={signIn}>
                  Sign In
                </Button>
              ) : (
                // <div></div>
                <Button type="default" onClick={signOut}>
                  Sign Out
                </Button>
              )}
            </Col>
          </Row>
        </Card>
      )}
    />
  );
};

export default HomePage;
