// Other imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import './MyExamplePublishPlugin.scss';
import { byteArrayToArrayBuffer } from '@fraytools/plugin-core/lib/util/ByteUtil';
import FrayToolsPluginCore from '@fraytools/plugin-core';
import BasePublishPlugin, { IPublishPluginProps, IPublishPluginState } from '@fraytools/plugin-core/lib/base/BasePublishPlugin';
import { IFraymakersContentExporterConfig, IFraymakersManifest, JsonExportFormat } from './types';
/**
 * Example view for the publish plugin.
 */

// OpenFL Stuff
import ByteArray from 'openfl/utils/ByteArray';
import { IManifestJson, PublishPluginMessageDataFilesMap } from '@fraytools/plugin-core/lib/types';
import { ILibraryAssetMetadata } from '@fraytools/plugin-core/lib/types/fraytools';

declare var MANIFEST_JSON:IManifestJson;

// Main UI
interface IFraymakersContentExporterProps extends IPublishPluginProps {
  configMetadata: IFraymakersContentExporterConfig;
}
interface IFraymakersContentExporterState extends IPublishPluginState {
  manifest?:IFraymakersManifest;
  isPublishing?:boolean;
  isErrored?:boolean;
  errorType?:string;
  errorMessage?:string;
  publishProgress?:number;
}

export default class MyPublishPlugin extends BasePublishPlugin<IFraymakersContentExporterProps, IFraymakersContentExporterState> {
  constructor(props) {
    super(props);

    this.state = {
      isPublishing: false
    };
  }

  /**
   * Force this component to re-render when parent window sends new props
   */
  onPropsUpdated(props) {
    ReactDOM.render(<MyPublishPlugin {...props} />, document.querySelector('.MyPublishPluginWrapper'));
  }

  onForcePublishRequest() {
    this.publish();
  }

  /**
   * This function should be called when you desire to send new persistent data back to the parent
   */
  publish() {
    // First must always inform the parent that a publish has started
    FrayToolsPluginCore.sendPublishStart();

    // Lock UI and start the publish process
    this.setState({ isPublishing: true} , () => { 
      // Now implementation of the publish process can go below (this example generates a simple foo.txt file)
      var files = {};
      // For each output folder defined in the parent app, we will output a text file and emit a copy of all image files from the project
      for(var i = 0; i < this.props.outputFolders.length; i++) {
        var folder = this.props.outputFolders[i];
        files[folder.id] = files[folder.id] || [];
        files[folder.id].push({
          filename: 'foo.txt',
          arrayBuffer: new TextEncoder().encode('bar')
        });

        for (var j = 0; j < this.props.imageAssets.length; j++) {
          let imageAssetMeta = this.props.imageAssets[j];
          let imageAsset = this.props.guidToAsset[imageAssetMeta.guid];
          files[folder.id].push({
            filename: imageAsset.filename,
            arrayBuffer: imageAsset.binaryData
          });
        }
      }
   
      // Forward the published file data to the parent app
      this.setState({ isPublishing: false }, () => {
        FrayToolsPluginCore.sendPublishEnd(files);
      });
    });
  }
  public render() {
    if (this.props.configMode) {
      // If configMode is enabled, display a different view specifically for configuring the plugin
      return (
        <div style={{ color: '#ffffff', background: '#000000' }}>
          <p>{JSON.stringify(MANIFEST_JSON)}</p>
          <p>Hello world! This is an example configuration view for a Publish plugin.</p>
          <p>Here you would provide a UI for assigning custom settings to persist between sessions using 'pluginConfigSyncRequest' postMessage() commands sent to the parent window. This data will then be stored within the current FrayTools project settings file.</p>
        </div>
      );
    }

    // Display some basic information about the project and provide a button to trigger publish
    return (
      <div className="MyPublishComponent" style={{ color: '#ffffff', background: '#000000' }}>
        <p>MyPublishPlugin {MANIFEST_JSON.version}</p>
        <p>Output folders: {this.props.outputFolders.map((folder) => folder.id).join(', ')}</p>
        <p>Sprite entities: {this.props.spriteEntityAssets.map((entity) => entity.id).join(', ')}</p>
        <p>Nine Slices: {this.props.nineSliceAssets.map((nineSlice) => nineSlice.id).join(', ')}</p>
        <p>Total images: {this.props.imageAssets.length}</p>
        <p>Total audio: {this.props.audioAssets.length}</p>
        <p>Total scripts: {this.props.scriptAssets.length}</p>
        <p>Total binary assets: {this.props.binaryAssets.length}</p>
        <div>
          <button onClick={() => {
            // Trigger the publish process
            this.publish()
          }}>
            Start Publish
          </button>
        </div>
      </div>
    );
  }
}