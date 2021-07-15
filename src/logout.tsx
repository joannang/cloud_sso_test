import React from "react";
import { Card, Button } from "antd";
import { signIn } from "./msal/authRedirect";

const Logout: React.FC = () => {
  return (
    <Card>
      Successfully logged out!
      {/* <div>
        <Button type="default" onClick={signIn}>
            Sign In Again
        </Button>
      </div> */}
    </Card>
  );
};

export default Logout;
