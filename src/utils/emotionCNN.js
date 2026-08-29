import { loadTensorflowModel } from "react-native-fast-tflite";
import jpeg from "jpeg-js";
import { toByteArray } from "base64-js";

const MODEL_ASSET = require(
  "../../assets/models/healio_emotion_recognition_v3_fp16.tflite"
);

// MUST match training output order exactly.
const CNN_LABELS = [
  "angry",
  "fear",
  "happy",
  "neutral",
  "sad",
];

let loadedModel = null;

export const loadEmotionModel = async () => {
  if (loadedModel) {
    return loadedModel;
  }

  loadedModel = await loadTensorflowModel(
    MODEL_ASSET,
    []
  );

  return loadedModel;
};

const cropFaceAndResizeTo48 = (
  rgba,
  sourceWidth,
  sourceHeight,
  faceFrame
) => {
  const TARGET = 48;

  if (!faceFrame) {
    throw new Error(
      "No detected face bounds were provided."
    );
  }

  const faceX =
    Number(faceFrame.origin?.x) || 0;

  const faceY =
    Number(faceFrame.origin?.y) || 0;

  const faceWidth =
    Number(faceFrame.size?.x) || 0;

  const faceHeight =
    Number(faceFrame.size?.y) || 0;

  if (
    faceWidth <= 0 ||
    faceHeight <= 0
  ) {
    throw new Error(
      "Invalid detected face bounds."
    );
  }

  /*
    Add some space around ML Kit's face rectangle.
    This keeps forehead, chin and cheeks,
    which are useful for FER classification.
  */
  const paddedWidth =
    faceWidth * 1.30;

  const paddedHeight =
    faceHeight * 1.35;

  let squareSize = Math.ceil(
    Math.max(
      paddedWidth,
      paddedHeight
    )
  );

  squareSize = Math.min(
    squareSize,
    sourceWidth,
    sourceHeight
  );

  const faceCenterX =
    faceX +
    faceWidth / 2;

  const faceCenterY =
    faceY +
    faceHeight / 2;

  let cropX = Math.round(
    faceCenterX -
    squareSize / 2
  );

  let cropY = Math.round(
    faceCenterY -
    squareSize / 2
  );

  cropX = Math.max(
    0,
    Math.min(
      cropX,
      sourceWidth - squareSize
    )
  );

  cropY = Math.max(
    0,
    Math.min(
      cropY,
      sourceHeight - squareSize
    )
  );

  const input =
    new Float32Array(
      TARGET * TARGET
    );

  for (let y = 0; y < TARGET; y++) {
    for (let x = 0; x < TARGET; x++) {
      const sourceX =
        cropX +
        Math.floor(
          (x / TARGET) *
            squareSize
        );

      const sourceY =
        cropY +
        Math.floor(
          (y / TARGET) *
            squareSize
        );

      const sourceIndex =
        (
          sourceY *
            sourceWidth +
          sourceX
        ) * 4;

      const r =
        rgba[sourceIndex];

      const g =
        rgba[sourceIndex + 1];

      const b =
        rgba[sourceIndex + 2];

      const gray =
        0.299 * r +
        0.587 * g +
        0.114 * b;

      input[
        y * TARGET + x
      ] = gray;
    }
  }

  console.log(
    "Face crop:",
    {
      x: cropX,
      y: cropY,
      size: squareSize,
    }
  );

  return input;
};

export const predictEmotionFromPhoto = async (
  base64Image,
  faceFrame
) => {
  const startTime = Date.now();

  const model =
    await loadEmotionModel();

  const jpegBytes =
    toByteArray(base64Image);

  const decoded =
    jpeg.decode(
      jpegBytes,
      {
        useTArray: true,
      }
    );

  if (
    !decoded?.data ||
    !decoded?.width ||
    !decoded?.height
  ) {
    throw new Error(
      "Unable to decode camera image."
    );
  }

  console.log(
    "Captured image:",
    decoded.width,
    "x",
    decoded.height
  );

  const inputTensor =
    cropFaceAndResizeTo48(
      decoded.data,
      decoded.width,
      decoded.height,
      faceFrame
    );

  /*
    Important:
    Don't divide by 255 here.
    The TFLite model already contains
    Rescaling(1 / 255).
  */

  const outputs =
    await model.run([
      inputTensor.buffer,
    ]);

  const probabilities =
    new Float32Array(
      outputs[0]
    );

  const ranked =
    Array.from(probabilities)
      .map(
        (confidence, index) => ({
          emotion:
            CNN_LABELS[index],
          confidence,
        })
      )
      .sort(
        (a, b) =>
          b.confidence -
          a.confidence
      );

  const primary =
    ranked[0];

  const secondConfidence =
    ranked[1].confidence;

  const confidenceGap =
    primary.confidence -
    secondConfidence;

  const lowConfidence =
    primary.confidence < 0.45 ||
    confidenceGap < 0.10;

  const scanTimeSeconds =
    (Date.now() -
      startTime) /
    1000;

  console.log(
    "CNN probabilities:",
    Array.from(
      probabilities
    )
  );

  console.log(
    "CNN prediction:",
    primary
  );

  console.log(
    "Confidence gap:",
    confidenceGap
  );

  console.log(
    "Low confidence:",
    lowConfidence
  );

  return {
    primaryEmotion:
      primary.emotion,

    confidence:
      primary.confidence,

    confidenceGap,

    lowConfidence,

    scanTimeSeconds:
      Number(
        scanTimeSeconds.toFixed(
          2
        )
      ),
  };
};