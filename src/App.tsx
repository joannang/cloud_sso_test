import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { handleRedirect, selectAccount } from "./msal/authRedirect";
import { PageHeader, Button, Descriptions, Layout, Typography } from "antd";
import HomePage from "./Home";
import Logout from "./logout";
import Wallet from "./Wallet";
import { useStores } from "./stores/StoreProvider";
import { Observer } from "mobx-react";
import "./App.css";
import { signIn, signOut } from "./msal/authRedirect";
import { HomeOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;
const {Title} = Typography;

const App: React.FC = () => {
  const { testStore } = useStores();

  useEffect(() => {
    handleRedirect(testStore);
    selectAccount(testStore); // in case of page refresh??

    console.log(testStore.homeAccountId);
    console.log(testStore.homeAccountId === "");
    console.log(window.location.href);
  });

  return (
    <div className="App">
      {/* <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> 
      </head> */}
      <Observer
        render={() => (
          <div>
            <PageHeader
              style={{ backgroundColor: "#add8e6" }}
              title={
                window.location.href !== "https://localhost:3000/wallet" ? (
                  <div>Kickstarter Project</div>
                ) : (
                  <div>
                    <HomeOutlined
                      onClick={(e) => (window.location.href = "/home")}
                    />
                    &nbsp;Wallet Dashboard
                  </div>
                )
              }
              // subTitle="This is a subtitle"
              extra={[
                <div>
                  {testStore.homeAccountId === "" ? (
                    <Button key="1" onClick={signIn}>
                      Sign In
                    </Button>
                  ) : (
                    <div>
                      <Button
                        style={{ background: "#FFFF99" }}
                        shape="circle"
                        onClick={(e) => (window.location.href = "/wallet")}
                      >
                        {" "}
                      </Button>{" "}
                      Addr: <i>0xffe...</i>
                    </div>
                  )}
                </div>,
              ]}
            ></PageHeader>

            <Router>
              <Link to="home"></Link>

              <Switch>
                {/* <Route path="/">
                  {testStore.homeAccountId !== "" ? (
                    <HomePage />
                  ) : (
                    <div style={{ paddingTop: "10px" }}>
                      Start by signing in to link an Ethereum wallet!
                    </div>
                  )}
                </Route> */}
                <Route path="/home">
                  {testStore.homeAccountId !== "" ? (
                    <HomePage />
                  ) : (
                    <Title level={5} style={{ textAlign: 'center', paddingTop: "10%", marginLeft: '10%', marginRight: '10%'}}>
                      Start by linking an Ethereum wallet!
                    </Title>
                  )}
                </Route>
                <Route path="/logout">
                  <Logout />
                </Route>
                <Route path="/wallet">
                  <Wallet />
                </Route>
              </Switch>
            </Router>
          </div>
        )}
      />
    </div>
  );
};

export default App;
