// 手册链接 https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices
// 获取所有媒体设备
/**
 * @returns  {MediaDeviceInfo[] | []} devices
 */
export const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    // console.log("设备列表:", devices);
    return devices;
  } catch (err) {
    console.log(err.name + ": " + err.message);
    return [];
  }
};

// 获取所有视频输入设备
/**
 * @returns  {MediaDeviceInfo[] | []} devices
 */
export const getVideoDevices = async () => {
  const allDevices = await getDevices();
  const videoDevices = allDevices.filter(
    (device) => device.kind === "videoinput"
  );
  return videoDevices;
};

// 获取所有音频输入设备
/**
 * @returns  {MediaDeviceInfo[] | []} devices
 */
export const getAudioDevices = async () => {
  const allDevices = await getDevices();
  const audioDevices = allDevices.filter(
    (device) => device.kind === "audioinput"
  );
  return audioDevices;
};

// 获取用户媒体流
/**
 *
 * @param {{video:boolean | object,audio: boolean | object}} constraints
 * @returns  {MediaStream} stream
 */
export const getUserMedia = async (
  constraints = { video: true, audio: true }
) => {
  // 获取用户音频设备
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    if (error.name === "ConstraintNotSatisfiedError") {
      console.log(
        "The resolution " +
          constraints.video.width.exact +
          "x" +
          constraints.video.width.exact +
          " px is not supported by your device."
      );
    } else if (error.name === "PermissionDeniedError") {
      console.log(
        "尚未授予使用您的相机和麦克风的权限，您需要允许页面访问您的设备才能使正常工作。"
      );
    }
    console.log("getUserMedia error: " + error.name, error);
  }
  // console.log("获取媒体流:", stream);
  return stream;
};

// 获取显示设备媒体流 包含显示器、浏览器等显示内容
/**
 *
 * @param @param {{video:boolean | object,audio: boolean | object}} constraints
 * @returns  {MediaStream} captureStream
 */
export const getDisplayMedia = async (
  constraints = { video: true, audio: true }
) => {
  let captureStream = null;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
  } catch (err) {
    console.error("Error: " + err);
  }
  return captureStream;
};

/*********流应用********* */

// 获取到录音流数据
/**
 *
 * @param {{video:boolean | object,audio: boolean | object}} constraints
 * @returns  {MediaStream} stream
 */
export const getAudioStream = async (
  constraints = { video: false, audio: true }
) => {
  const stream = await getUserMedia(constraints);
  return stream;
};

// 获取视频流数据
/**
 *
 * @param {{video:boolean | object,audio: boolean | object}} constraints
 * @returns  {MediaStream} stream
 */
export const getVideoStream = async (
  constraints = { video: true, audio: false }
) => {
  const stream = await getUserMedia(constraints);
  return stream;
};

// 设置对象的的流数据 包括音频和视频
/**
 *
 * @param { HTMLAudioElement | HTMLVideoElement} dom
 * @param { MediaStream } stream
 * @returns void
 */
export const setStreamToDom = async (dom, stream) => {
  if (stream == null) return;
  // 给对象设置音频流
  dom.srcObject = stream;
};
