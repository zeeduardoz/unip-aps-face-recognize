$(document).ready(async function () {
  const MODEL_URL = "/assets/lib/face-api/models";

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
});

$("#upload").change(async function () {
  const imgFile = document.getElementById("upload").files[0];
  const img64 = await faceapi.bufferToImage(imgFile);
  document.getElementById("image").src = img64.src;

  const img = document.getElementById("image");

  let faceDescriptions = await faceapi
    .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions()
    .withAgeAndGender()
    .withFaceDescriptors();
  const canvas = $("#reflay").get(0);
  faceapi.matchDimensions(canvas, img);

  faceDescriptions = faceapi.resizeResults(faceDescriptions, img);

  faceapi.draw.drawDetections(canvas, faceDescriptions);
  faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions);
  faceapi.draw.drawFaceExpressions(canvas, faceDescriptions);

  faceDescriptions.forEach((detection) => {
    const { age, gender, genderProbability } = detection;
    console.log(detection);
    new faceapi.draw.DrawTextField(
      [
        `${parseInt(age, 10)} anos`,
        `${gender === "male" ? "Homem" : "Mulher"} (${parseInt(
          genderProbability * 100,
          10
        )}%)`,
      ],
      detection.detection.box.topRight
    ).draw(canvas);
  });
});
