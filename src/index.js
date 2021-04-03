import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Manager from './components/Manager';
import SettingsPage from './components/SettingsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { ToastContainer, toast } from 'react-toastify';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

// en/decryption will fail, but signatures will work
import { AccountSystem, MetadataAccess } from "../ts-client-library/packages/account-system/src/index.js"
import { WebAccountMiddleware, WebNetworkMiddleware } from "../ts-client-library/packages/middleware-web/src/index.js"
import { hexToBytes } from "../ts-client-library/packages/util/src/hex.js"

const storageNode = "https://beta-broker.opacitynodes.com:3000"

const run = async () => {
  const handle = hexToBytes("922323580916c93c25eef655691f2c672c1b46647aaa55be2e42013dd88e8ed434534b4a6cb137a03167bb4d72686b98e1274a592f71b9c75df1d2fbf22abd6f")

  const cryptoMiddleware = new WebAccountMiddleware({ asymmetricKey: handle })
  const netMiddleware = new WebNetworkMiddleware()

  const metadataAccess = new MetadataAccess({
    net: netMiddleware,
    crypto: cryptoMiddleware,
    metadataNode: storageNode,
  })
  const accountSystem = new AccountSystem({ metadataAccess })

  console.log(accountSystem)
}

run()


// Now we can render our application into it
render(
  <Router>
    <div>
      <main>
        <Route exact path="/" component={LoginForm} />
        <Route path="/manager" component={Manager} />
        <Route path="/settings" component={SettingsPage} />
      </main>
    </div>
    <ToastContainer
      position="bottom-right"
      limit={7}
      hideProgressBar={false}
      autoClose={false}
      newestOnTop={true}
      closeOnClick={true}
      draggable={false}
      rtl={false}
    />
  </Router>,
  document.getElementById('root')
);
