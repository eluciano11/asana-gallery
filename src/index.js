import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AsanaGallery from './AsanaGallery';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <AsanaGallery
    frames={[
      { height: 360, width: 1000, img: "https://picsum.photos/id/281/1000/360" },
      { height: 600, width: 400, img: "https://picsum.photos/id/281/400/600" },
      { height: 400, width: 600, img: "https://picsum.photos/id/281/600/400" },
      { height: 400, width: 600, img: "https://picsum.photos/id/281/600/400" },
      { height: 400, width: 300, img: "https://picsum.photos/id/281/300/400" },
      { height: 400, width: 300, img: "https://picsum.photos/id/281/300/400" }
    ]}
    width={800}
    maxRowHeight={360}
    spacing={10}
  />,
  document.getElementById('gallery')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
