import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import LGR from './LGR';

//const server_url = 'http://control.tabares.me';
const server_url = 'http://localhost:8000';

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {

    return (
      <Tabs>
        <TabList>
          <Tab>LGR</Tab>
          <Tab>Tiempo Mínimo</Tab>
        </TabList>

        <TabPanel>
          <LGR server_url={server_url}></LGR>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    )
  }
}

export default App;
