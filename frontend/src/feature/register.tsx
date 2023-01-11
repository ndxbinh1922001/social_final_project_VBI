import * as React from "react";
import { getApi } from "../api/config/utils";
import { useSubstrate } from "../api/providers/connectContext";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { web3FromAddress } from "@polkadot/extension-dapp";
import { keys } from "@mui/system";

export interface IRegisterProps {}

export default function Register(props: IRegisterProps) {
  const { getExtension, accounts } = useSubstrate();

  const [apiBC, setApiBC] = React.useState<any>();
  const callApi = async () => {
    const api = await getApi();

    setApiBC(api);
  };

  React.useEffect(() => {
    callApi();
    getExtension();
  }, []);

  const handleTransaction = async () => {
    console.log("Call api");
    console.log("Current account:{}", accounts);
    if (accounts !== null) {
      console.log("current Account:", accounts);
      const injector = await web3FromAddress(accounts[0].address);
      const events = new Promise(async (resolve, reject) => {
        console.log("apiBC.tx.social:", apiBC.tx.social);

        //ordered param
        await apiBC.tx.social
          // fixed value
          // dynamic value
          .createPost("Nguyen Doan Xuan Binh", "Le Ngoc Mai Thanh")
          .signAndSend(
            accounts[0].address,
            { signer: injector?.signer },
            ({ status, events, dispatchError }: any) => {
              if (dispatchError) {
                if (dispatchError.isModule) {
                  // for module errors, we have the section indexed, lookup
                  const decoded = apiBC.registry.findMetaError(
                    dispatchError.asModule
                  );
                  const { docs, name, section } = decoded;
                  const res = "Error".concat(":", section, ".", name);
                  //console.log(`${section}.${name}: ${docs.join(' ')}`);
                  resolve(res);
                } else {
                  // Other, CannotLookup, BadOrigin, no extra info
                  //console.log(dispatchError.toString());
                  resolve(dispatchError.toString());
                }
              } else {
                events.forEach(({ event, phase }: any) => {
                  const { data, method, section } = event;
                  //console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                  if (section == "social") {
                    const res = "Success".concat(":", section, ".", method);
                    resolve(res);
                  }
                });
              }
            }
          );
      });
      console.log(await events);
    }
  };

  const handleQuery = async () => {
    console.log("apiBC.query.social.posts:", apiBC.query.social.posts);
    const keys = await apiBC.query.social.posts.keys(); //key
    console.log(keys[0].toHuman());

    const res = await apiBC.query.social.posts.entries(); //key-value
    console.log("res[0][0].toHuman():", res[0][0].toHuman());
    console.log("keys[0].toHuman():", keys[0].toHuman());

    if (res[0][0].toHuman()[0] === keys[0].toHuman()[0]) {
      console.log("res:", res[0][1].toHuman());
    } else {
      console.log("khong dc");
    }
  };

  return (
    <div>
      <Button onClick={handleTransaction}>Transaction me</Button>

      <Button onClick={handleQuery}>Query me</Button>
    </div>
  );
}
