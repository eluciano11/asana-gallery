import React from 'react';

//
// Part I
// ----------------------------------------------------------------------
/**
 * Adjust to current frame to fit the height that's provided. The height can be the max height provided to the component or the height of the first element in the row.
 *
 * @param {Object} frame - Image dimension.
 * @param {number} frame.height - Height of the current image.
 * @param {number} frame.width - Width of the current image.
 * @param {number} maxHeight - Max height that the image can have. This value can be the max height provided to the component or the height of the first item in the row.
 * @returns {Object} Scaled dimentions based on the height that was passed..
 */
function adjustHeight(frame, maxHeight) {
  const ratio = frame.height / frame.width;

  return { height: maxHeight, width: Math.round(maxHeight / ratio) };
}

/**
 * Verify if the current frame will need to use spacing.
 * Spacing will be added if one of the following conditions are meet:
 * 1. The current row has more than 2 frames and the row length is a pair number or the current index is not a pair number.
 * 2. The row has 2 frames and we're processing the first frame.
 *
 * @param {Array<Object>} row - List of frames in the current row.
 * @param {number} index - Index that the loop is on.
 * @param {number} spacing - Spacing that has been passed to the component.
 * @returns {number} Spacing to be added.
 */
function getSpaceToUse(row, index, spacing) {
  if (row.length > 2 && (row.length % 2 === 0 || index > 0)) {
    return spacing;
  } else if (row.length === 2 && index === 0) {
    return spacing;
  }

  return 0;
}

/**
 * Scale the frames' content to fit the container.
 * In order for our row to fit the container width we need to determine the amount of
 * space that's available for our row in the container. Once know the amount of space
 * that can be used from the row size we need to scale down our images so they can fit
 * on the rows' constrains.
 *
 * @param {Array<Object>} row - Row that has to be adjusted to fit the container width.
 * @param {number} rowSize - Sum of all of image widths in the frame.
 * @param {number} containerWidth - Width that we need our row to adjust to.
 * @param {number} spacing - Spacing that will be added to each element of the array expect the first one.
 */
function adjustRowWidth(row, rowSize, containerWidth, spacing) {
  const ratio = containerWidth / rowSize;

  return row.map((column, index) => {
    const spaceToUse = getSpaceToUse(row, index, spacing);

    return (Object.assign({}, column, {
      height: Math.floor(column.height * ratio),
      width: Math.floor(column.width * ratio) - spaceToUse
    }));
  });
}

/**
 * Layout the provided frames.
 * This function will create a layout that follows these constrains:
 * 1. The order of images must be maintained.
 * 2. Images must maintain their aspect ratio (+/- 1px) and not be cropped.
 * 3. Images in the same row must have the same height.
 * 4. Rows are variable-height, but must be less than or equal to the maximum row height.
 * 5. Every row except the last must have total width equal to the container width.
 *
 * In order to generate the layout we most do the follow:
 * 1. Iterate through all of the frames that have been provided.
 * 2. Calculate the width of each frame based on the max height or the height of the first element in the array.
 * 3. As we generate the new dimension for each frame we add them to an array that represents the current row and we accumulate the widths of the new frames.
 * 4. When the rows' width is equal or more than the container width we need to adjust the frames dimension to fit the containers width. Once we do that we push our adjusted row to the layout and reset the row array and the row accumulator.
 * 5. Once we've iterated through all the frames we need to make sure that we don't have items left in the row array and if we do we add them to the layout array.
 *
 * @param {Array<Object>} frames of frame objects with height/width properties
 * @param {number} containerWidth of the containing element, in pixels
 * @param {number} maxRowHeight height of each row of images, in pixels
 * @param {number} spacing between images in a row, in pixels
 * @returns {Array<Array<Object>>} array of rows of resized frames
 */
 function layoutFrames(frames, containerWidth, maxRowHeight, spacing) {
  const layout = []; // Layout that will be built as we evaluate each frame.
  let rowSize = 0; // Amount of space the the current row covering.
  let row = []; // Row that's being built.

  for(let index = 0; index < frames.length; index++) {
    const frame = frames[index];
    const maxHeight = row.length > 0 ? row[0].height : maxRowHeight;
    const { height, width } = adjustHeight(frame, maxHeight);

    row.push(Object.assign({}, frame, {
      height,
      width
    }));
    rowSize += width;

    if (rowSize >= containerWidth) {
      // Add row to the layout after adjusting its width.
      layout.push(adjustRowWidth(row, rowSize, containerWidth, spacing));

      // Reset row and the width accumulator.
      rowSize = 0;
      row = [];
    }
  }

  // Add any missing row to the layout.
  if (row.length > 0) {
    layout.push(row);
  }

  return layout;
}

//
// Part II
// ----------------------------------------------------------------------

class AsanaGallery extends React.Component {
  render() {
    const rows = layoutFrames(
      this.props.frames,
      this.props.width,
      this.props.maxRowHeight,
      this.props.spacing
    );

    return (
      <div
        className="AsanaGallery"
        style={{ width: this.props.width }}
      >
        <h1>Asana Gallery</h1>
        {rows.map((row, i) => row.map((frame, j) => (
          <div
            key={`image${i}_${j}`}
            className="asana-gallery__card"
            style={{
              width: frame.width,
              marginLeft: j > 0 ? this.props.spacing : 0,
            }}
          >
            <img
              src={frame.img}
              className="asana-gallery__card__image"
              style={{
                width: frame.width,
                height: frame.height
              }}
              alt=""
            />
            <footer className="asana-gallery__card__footer">
              <img className="asana-gallery__card__footer__image" src={frame.avatar || ""} alt="" />
              <div className="asana-gallery__card__footer__information">
                <p className="asana-gallery__card__footer__title ellipsis">
                  {frame.title || "A most interesting picture"}
                </p>
                <p className="asana-gallery__card__footer__subtitle ellipsis">
                  {frame.subtitle || "Other info you might care about"}
                </p>
              </div>
            </footer>
          </div>
        )))}
      </div>
    );
  }
}

export default AsanaGallery;
