/* global monaco */

import 'regenerator-runtime/runtime';
import { api as GraphQLAPI } from 'monaco-graphql/esm/monaco.contribution';

import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker';
import JSONWorker from 'worker-loader!monaco-editor/esm/vs/language/json/json.worker';
import GraphQLWorker from 'worker-loader!monaco-graphql/esm/graphql.worker';

const SCHEMA_URL = 'https://api.spacex.land/graphql/';

window.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'graphqlDev') {
      return new GraphQLWorker();
    }
    if (label === 'json') {
      return new JSONWorker();
    }
    return new EditorWorker();
  },
};

const schemaInput = document.createElement('input');
schemaInput.type = 'text';

schemaInput.value = SCHEMA_URL;

schemaInput.onkeyup = e => {
  e.preventDefault();
  // @ts-ignore
  const val = e?.target?.value;
  if (val && typeof val === 'string') {
    monaco.languages.graphql.graphqlDefaults.setSchemaConfig({ uri: val });
  }
};

const toolbar = document.getElementById('toolbar');
toolbar?.appendChild(schemaInput);

const variablesModel = monaco.editor.createModel(
  `{}`,
  'json',
  monaco.Uri.file('/1/variables.json'),
);

const resultsEditor = monaco.editor.create(
  document.getElementById('results'),
  {
    model: variablesModel,
    automaticLayout: true,
  },
);
const variablesEditor = monaco.editor.create(
  document.getElementById('variables'),
  {
    value: `{ "limit": 10 }`,
    language: 'json',
    automaticLayout: true,
  },
);
const model = monaco.editor.createModel(
  `
query Example($limit: Int) { 
  launchesPast(limit: $limit) {
    mission_name
    # format me using the right click context menu
              launch_date_local
    launch_site {
      site_name_long
    }
    links {
      article_link
      video_link
    }
  }
}
`,
  'graphqlDev',
  monaco.Uri.file('/1/operation.graphql'),
);

const operationEditor = monaco.editor.create(
  document.getElementById('operation'),
  {
    model,
    automaticLayout: true,
  },
);

GraphQLAPI.setSchemaUri(SCHEMA_URL);
// monaco.languages.graphql.graphqlDefaults.setSchemaConfig({ uri: SCHEMA_URL });

/**
 * Basic Operation Exec Example
 */

async function executeCurrentOp() {
  try {
    const operation = operationEditor.getValue();
    const variables = variablesEditor.getValue();
    const body= { query: operation };
    const parsedVariables = JSON.parse(variables);
    if (parsedVariables && Object.keys(parsedVariables).length) {
      body.variables = variables;
    }
    const result = await fetch(SCHEMA_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const resultText = await result.text();
    resultsEditor.setValue(JSON.stringify(JSON.parse(resultText), null, 2));
  } catch (err) {
    resultsEditor.setValue(err.toString());
  }
}

const opAction = {
  id: 'graphql-run',
  label: 'Run Operation',
  contextMenuOrder: 0,
  contextMenuGroupId: 'graphql',
  keybindings: [
    // eslint-disable-next-line no-bitwise
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
  ],
  run: executeCurrentOp,
};

operationEditor.addAction(opAction);
variablesEditor.addAction(opAction);
resultsEditor.addAction(opAction);

// add your own diagnostics? why not!
// monaco.editor.setModelMarkers(
//   model,
//   'graphql',
//   [{
//     severity: 5,
//     message: 'An example diagnostic error',
//     startColumn: 2,
//     startLineNumber: 4,
//     endLineNumber: 4,
//     endColumn: 0,
//   }],
// );

// operationEditor.onDidChangeModelContent(() => {
//   // this is where
// })
