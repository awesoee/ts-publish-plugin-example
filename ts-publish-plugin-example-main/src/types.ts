import { IPluginConfig } from '@fraytools/plugin-core/lib/types';
import { BaseSymbolKeyframeTypes, BaseSymbolTypes, IAudioAssetMetadata, IBinaryAssetMetadata, ICollisionBodyKeyframe, ICollisionBodySymbol, ICollisionBoxKeyframe, ICollisionBoxSymbol, IFrameScriptKeyframe, IFrameScriptLayer, IImageAssetMetadata, IImageKeyframe, IImageSymbol, ILabelKeyframe, ILibraryAssetMetadata, ILineSegmentKeyframe, ILineSegmentSymbol, INineSliceAssetMetadata, IPaletteCollectionAssetMetadata, IPointKeyframe, IPointSymbol, IPolygonKeyframe, IPolygonSymbol, IScriptAssetMetadata, ISpriteAnimation, ISpriteEntityAssetMetadata, ITilemapKeyframe, ITilemapLayer, ITilemapSymbol, LayerTypeValues } from '@fraytools/plugin-core/lib/types/fraytools';

export type JsonExportFormat = 'base64' | 'raw' | 'prettify';

import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import PNGEncoderOptions from 'openfl/display/PNGEncoderOptions';
import Matrix from 'openfl/geom/Matrix';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import ByteArray from 'openfl/utils/ByteArray';
import Endian from 'openfl/utils/Endian';
import Loader from 'openfl/display/Loader';
import Event from 'openfl/events/Event';

interface IExporterConfig {
    outputFolders:{ id:string; path:string }[];
    guidToAsset:{ [guid:string]: { metadata:ILibraryAssetMetadata, binaryData?:Uint8Array, byteArray?:ByteArray, bitmapData?:BitmapData, filename?:string } };
    spriteEntityAssets:ISpriteEntityAssetMetadata[];
    imageAssets:IImageAssetMetadata[];
    audioAssets:IAudioAssetMetadata[];
    binaryAssets:IBinaryAssetMetadata[];
    scriptAssets:IScriptAssetMetadata[];
    paletteCollectionAssets:IPaletteCollectionAssetMetadata[];
    nineSliceAssets:INineSliceAssetMetadata[];
    exportFormat:JsonExportFormat;
    pngCompression:boolean;
    onProgress: (value:number) => void;
  }
  // Typedef stuff
  export interface IFraymakersContentExporterConfig extends IPluginConfig {
    jsonCompression:JsonExportFormat,
    pngCompression:boolean
  }
  export type FraymakersManifestContentType = 'character' | 'projectile' | 'customGameObject' | 'stage' | 'platform' | 'music' | '';
  export interface IFraymakersManifestContent {
    id:string;
    name:string;
    description:string;
    type:FraymakersManifestContentType;
  }
  export interface IFraymakersManifestGameObjectContent extends IFraymakersManifestContent {
    objectStatsId:string;
    animationStatsId:string;
    hitboxStatsId:string;
    costumesId:string;
    scriptId:string;
  }
  export interface IFraymakersManifestCharacterContent extends IFraymakersManifestGameObjectContent {
    type: 'character';
  }
  export interface IFraymakersManifestProjectileContent extends IFraymakersManifestGameObjectContent {
    type: 'projectile';
  }
  export interface IFraymakersManifestCustomGameObjectContent extends IFraymakersManifestGameObjectContent {
    type: 'customGameObject';
  }
  export interface IFraymakersManifestStageContent extends IFraymakersManifestContent {
    type: 'stage';
    scriptId:string;
    musicIds:{
      resourceId:string;
      contentId:string;
    }[];
  }
  export interface IFraymakersManifestPlatformContent extends IFraymakersManifestContent {
    type: 'platform';
    scriptId:string;
  }
  export interface IFraymakersManifestMusicContent extends IFraymakersManifestContent {
    type: 'music';
    audioId:string;
    loopPoint: number;
  }
  export interface IFraymakersManifest {
    resourceId:string;
    content:FraymakersManifestContentTypes[];
  }
  export type FraymakersManifestContentTypes = IFraymakersManifestContent | IFraymakersManifestCharacterContent | IFraymakersManifestProjectileContent | IFraymakersManifestCustomGameObjectContent | IFraymakersManifestMusicContent;
  
  export interface IFraymakersPaletteData {
    indexed: {
      base:number;
      red:number;
      green:number;
      blue:number;
    };
    palettes:IFraymakersPaletteMapEntry[];
  }
  
  export interface IFraymakersPaletteMapEntry {
    name: string;
    colors: {
      [sourceColor:string]: string;
    };
  }

export interface IFraymakersAssetMetadata extends IScriptAssetMetadata {
    pluginMetadata:{
      [key:string]:any,
      'my.example.publish.plugin'?: {
      }
    }
  }