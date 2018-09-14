import React from 'react';
import PropTypes from 'prop-types';
import {
  Map,
  TileLayer,
} from 'react-leaflet';

const AdditionalContents = (props) => {
  const { contents } = props;

  return (
    <div>
      {JSON.stringify(contents, undefined, 1)}
      <hr />
      {
        (contents.lat !== undefined && contents.lon !== undefined)
          ? (
            <Map center={[contents.lat, contents.lon]} zoom={13} style={{ width: '300px', height: '160px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />
            </Map>
          ) : null
      }
    </div>
  );
};

AdditionalContents.propTypes = {
  contents: PropTypes.shape().isRequired,
};

export default AdditionalContents;
