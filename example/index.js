import React, {Component} from 'react';
import {render} from 'react-dom';
import {APIClient, Openlaw} from 'openlaw';

import {OpenLawForm} from '../src';
import SampleTemplateText from './SAMPLE_TEMPLATE.txt';
import './style.css';

/**
 * Example app showing how you can render `OpenLawForm`
 * with a valid OpenLaw template.
 */

// for running against your OpenLaw instance: 'https://[YOUR.INSTANCE.URL]';
const apiClient = new APIClient('https://develop.dev.openlaw.io');
apiClient.login('openlawuser+1@gmail.com', 'OpenLaw2018!');

/**
 * OpenLawForm requires:
 *   - apiClient {object}: OpenLaw helper `new APIClient('...')` instance
 *   - executionResult {object}
 *   - parameters {array}
 *   - onChangeFunction {(key: String, ?value: String, ?force: Boolean) => any}
 *   - openLaw {object}
 *   - variables {array}
 */
class Form extends Component {
  state = {
    definedValues: {},
    executionResult: {},
    parameters: {},
    variables: {},
  };

  componentDidMount() {
    this.update();
  }

  update = (key, value) => {
    const updatedDraftParameters = key
      ? ({
        ...this.state.parameters,
        [key]: value,
      }) : (
        this.state.parameters
      );

    // https://docs.openlaw.io/openlaw-object/#compiletemplate
    const {compiledTemplate} = Openlaw.compileTemplate(SampleTemplateText);
    // https://docs.openlaw.io/openlaw-object/#execute
    const {executionResult} = Openlaw.execute(compiledTemplate, {}, {});
    // https://docs.openlaw.io/openlaw-object/#getexecutedvariables
    const variables = Openlaw.getExecutedVariables(executionResult, {});
console.log(variables)
    this.setState(({parameters}) => ({
      executionResult,
      parameters: {...parameters, ...updatedDraftParameters},
      variables,
    }));
  };

  render() {
    return (
      <div>
        {Object.keys(this.state.executionResult).length && (
          <OpenLawForm
            apiClient={apiClient}
            executionResult={this.state.executionResult}
            parameters={this.state.parameters}
            onChangeFunction={this.update}
            openLaw={Openlaw}
            variables={this.state.variables}
          />
        )}
      </div>
    );
  }
}

const styles = {
  pre: {
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
  },
  wrapApp: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const App = () => (
  <div style={styles.wrapApp}>
    <div>
      <Form />
    </div>
    <div>
      <pre style={styles.pre}>{SampleTemplateText}</pre>
    </div>
  </div>
);

render(<App />, document.getElementById('root'));
