import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import LGR from './LGR';
import MinimalTime from './MinimalTime';

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
          <Tab>Diseño por LGR</Tab>
          <Tab>Tiempo Mínimo</Tab>
          <Tab>Diseño por frecuencia</Tab>
        </TabList>

        <TabPanel>
          <LGR server_url={server_url}></LGR>
        </TabPanel>
        <TabPanel>
          <MinimalTime server_url={server_url}/>
        </TabPanel>
        <TabPanel>
          Construyendo
        </TabPanel>
      </Tabs>
    )
  }
}

export default App;
