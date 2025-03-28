import axios from 'axios';
import fs from 'fs';
import protobuf from 'protobufjs';
import { arrayBuffer } from 'stream/consumers';

const gtfsProto = './gtfs-realtime.proto';

const getSubway = async () => {
  try {
    const res = await axios.get(
      'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct/Fgtfs',
      { responseType: 'arrayBuffer' }
    );
    const buffer = res.data;
    console.log(new Uint8Array(buffer)); // Log the raw data
    const root = await protobuf.load('./src/utils/gtfs-realtime.proto');
    const FeedMessage = root.lookupType('transit_realtime.FeedMessage');

    const message = FeedMessage.decode(new Uint8Array(buffer));
    console.log(JSON.stringify(message, null, 2));
  } catch (error) {
    console.log('🔴🔴🔴🔴🔴 - \n', error);
  }
};

getSubway();
