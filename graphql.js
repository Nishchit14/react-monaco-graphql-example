import React from "react";
import { render } from "react-dom";
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { buildSchema } from 'graphql';
 
import { api as GraphQLAPI } from 'monaco-graphql/esm/monaco.contribution';
 
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker';
import GraphQLWorker from 'worker-loader!monaco-graphql/esm/graphql.worker';
 
window.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === 'graphqlDev') {
      return new GraphQLWorker();
    }
    return new EditorWorker();
  },
};
monaco.editor.create(document.getElementById('root'), {
  value: 'query { }',
  language: 'graphqlDev',
  automaticLayout: true,
});

// GraphQLAPI.setSchemaUri('https://api.spacex.land/graphql');

console.log(GraphQLAPI)
GraphQLAPI.setSchemaConfig({
  uri: 'https://api.spacex.land/graphql'
})

// GraphQLAPI.setSchema(`
//   type Query {
//     hello: String
//   }
// `);


// render(<App />, document.getElementById("root"));
