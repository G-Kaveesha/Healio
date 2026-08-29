import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import * as Haptics
  from "expo-haptics";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  useFaceDetection,
} from "@infinitered/react-native-mlkit-face-detection";

import {
  loadEmotionModel,
  predictEmotionFromPhoto,
} from "../utils/emotionCNN";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";

import {
  getScanMoodData,
} from "../utils/scanMoodData";

import {
  getFaceScanActivityRecommendations,
} from "../services/faceScanActivityRecommendationService";


const {
  width,
  height,
} = Dimensions.get(
  "window"
);


const GREEN =
  "#88BF98";

const BLACK =
  "#111111";

const GRAY =
  "#666666";


const CAMERA_CARD_WIDTH =
  width - 68;

const CAMERA_CARD_HEIGHT =
  Math.min(
    height * 0.52,
    430
  );


const CHATBOT_CARD_IMAGE =
  require(
    "../../assets/images/healiochat.png"
  );

const JOURNAL_CARD_IMAGE =
  require(
    "../../assets/images/write_journal.png"
  );

const getLocalDateKey =
  () => {

    const date =
      new Date();


    const year =
      date.getFullYear();


    const month =
      `${date.getMonth() + 1}`
        .padStart(
          2,
          "0"
        );


    const day =
      `${date.getDate()}`
        .padStart(
          2,
          "0"
        );


    return (
      `${year}-${month}-${day}`
    );
  };


/*face scan screen*/

export default function FaceScanScreen({
  navigation,
}) {

  const cameraRef =
    useRef(
      null
    );


  const faceDetector =
    useFaceDetection();


  const [
    permission,
    requestPermission,
  ] =
    useCameraPermissions();


  const [
    capturedPhoto,
    setCapturedPhoto,
  ] =
    useState(
      null
    );


  const [
    capturedPhotoSize,
    setCapturedPhotoSize,
  ] =
    useState(
      null
    );


  const [
    detectedFaceFrame,
    setDetectedFaceFrame,
  ] =
    useState(
      null
    );


  const [
    scanProgress,
    setScanProgress,
  ] =
    useState(
      0
    );


  const [
    isScanning,
    setIsScanning,
  ] =
    useState(
      false
    );


  const [
    scanResult,
    setScanResult,
  ] =
    useState(
      null
    );


  const [
    cameraKey,
    setCameraKey,
  ] =
    useState(
      1
    );


  /*Load cnn model*/

  useEffect(
    () => {

      const prepareModel =
        async () => {

          try {

            const model =
              await loadEmotionModel();


            console.log(
              "CNN MODEL LOADED:",
              model
            );

          } catch (
            error
          ) {

            console.log(
              "CNN MODEL LOAD ERROR:",
              error
            );
          }
        };


      prepareModel();

    },
    []
  );


  /*save mood log*/

  const saveMoodLogToFirestore =
    async (
      result
    ) => {

      const currentUser =
        auth.currentUser;


      if (
        !currentUser
      ) {
        return;
      }


      const recommendedActivities =
        Array.isArray(
          result
            .recommendedActivities
        )
          ? result
              .recommendedActivities
          : [];


      await addDoc(
        collection(
          db,
          "moodCheckIns"
        ),
        {

          userId:
            currentUser.uid,


          source:
            "face_scan_cnn",

          primaryEmotion:
            result
              .primaryEmotion,

          primaryEmotionName:
            result
              .displayName,

          confidence:
            result
              .confidence,

          confidenceGap:
            result
              .confidenceGap,

          lowConfidence:
            result
              .lowConfidence,

          scanTimeSeconds:
            result
              .scanTimeSeconds,
          caption:
            result
              .caption,

          color:
            result
              .color,

          recommendedActivityIds:
            recommendedActivities
              .map(
                (
                  activity
                ) =>
                  activity.id
              ),

          recommendedActivityTitles:
            recommendedActivities
              .map(
                (
                  activity
                ) =>
                  activity.title
              ),

          localDateKey:
            getLocalDateKey(),


          photoStored:
            false,


          createdAt:
            serverTimestamp(),
        }
      );
    };


  /*get largest detected face*/

  const getLargestFace =
    (
      faces
    ) => {

      return [
        ...faces,
      ].sort(
        (
          a,
          b
        ) => {

          const areaA =
            (
              a.frame
                ?.size
                ?.x ||
              0
            ) *
            (
              a.frame
                ?.size
                ?.y ||
              0
            );


          const areaB =
            (
              b.frame
                ?.size
                ?.x ||
              0
            ) *
            (
              b.frame
                ?.size
                ?.y ||
              0
            );


          return (
            areaB -
            areaA
          );
        }
      )[0];
    };


  /*scan face*/

  const handleScanFace =
    async () => {

      try {

        setIsScanning(
          true
        );

        setScanProgress(
          10
        );

        setScanResult(
          null
        );

        setDetectedFaceFrame(
          null
        );


        await Haptics
          .impactAsync(
            Haptics
              .ImpactFeedbackStyle
              .Medium
          );


        if (
          !cameraRef.current
        ) {
          throw new Error(
            "CAMERA_NOT_READY"
          );
        }


        /*capture photo*/

        const photo =
          await cameraRef
            .current
            .takePictureAsync({
              quality:
                0.5,

              base64:
                true,

              skipProcessing:
                false,
            });


        const photoUri =
          photo?.uri ||
          null;


        const photoBase64 =
          photo?.base64 ||
          null;


        if (
          !photoUri ||
          !photoBase64
        ) {
          throw new Error(
            "PHOTO_CAPTURE_FAILED"
          );
        }


        setCapturedPhoto(
          photoUri
        );


        if (
          photo?.width &&
          photo?.height
        ) {
          setCapturedPhotoSize({
            width:
              photo.width,

            height:
              photo.height,
          });
        }


        setScanProgress(
          25
        );


        /*ml kit face detection*/

        const detectionResult =
          await faceDetector
            .detectFaces(
              photoUri
            );


        console.log(
          "ML KIT RESULT:",
          detectionResult
        );


        const faces =
          detectionResult
            ?.faces ||
          [];

        if (
          faces.length ===
          0
        ) {
          throw new Error(
            "NO_FACE_DETECTED"
          );
        }


        const detectedFace =
          getLargestFace(
            faces
          );


        if (
          !detectedFace
            ?.frame
        ) {
          throw new Error(
            "INVALID_FACE_FRAME"
          );
        }


        console.log(
          "Detected face frame:",
          detectedFace.frame
        );


        setDetectedFaceFrame(
          detectedFace.frame
        );


        setScanProgress(
          50
        );


        /*CNN model prediction*/

        const prediction =
          await predictEmotionFromPhoto(
            photoBase64,
            detectedFace.frame
          );


        setScanProgress(
          80
        );


        /*display meta data*/

        const primaryMoodData =
          getScanMoodData(
            prediction
              .primaryEmotion
          );


        /*get activities*/

        const recommendedActivities =
          getFaceScanActivityRecommendations({
            emotion:
              prediction
                .primaryEmotion,

            lowConfidence:
              prediction
                .lowConfidence,

            count:
              2,
          });


        console.log(
          "FACE SCAN RECOMMENDATIONS:",
          recommendedActivities.map(
            (
              activity
            ) => ({
              id:
                activity.id,

              title:
                activity.title,

              category:
                activity.category,

              route:
                activity
                  .activityScreen,
            })
          )
        );


        setScanProgress(
          95
        );


        /*final result*/

        const finalResult = {

          ...prediction,

          ...primaryMoodData,


          recommendedActivities,


          caption:
            prediction
              .lowConfidence

              ? (
                "I'm not fully sure about this expression. These are general activities you can choose from, or you can try another scan."
              )

              : primaryMoodData
                  .caption,
        };


        setScanProgress(
          100
        );


        setScanResult(
          finalResult
        );

        setIsScanning(
          false
        );
        saveMoodLogToFirestore(
          finalResult
        ).catch(
          (
            error
          ) => {

            console.log(
              "Mood save error:",
              error
            );
          }
        );


        await Haptics
          .notificationAsync(
            Haptics
              .NotificationFeedbackType
              .Success
          );


      } catch (
        error
      ) {

        console.log(
          "FACE SCAN ERROR:",
          error
        );


        setCapturedPhoto(
          null
        );

        setCapturedPhotoSize(
          null
        );

        setDetectedFaceFrame(
          null
        );


        if (
          error
            ?.message ===
          "NO_FACE_DETECTED"
        ) {

          Alert.alert(
            "Face not detected",
            "Make sure your face is clearly visible and look toward the camera, then try again."
          );


        } else if (
          error
            ?.message ===
          "CAMERA_NOT_READY"
        ) {

          Alert.alert(
            "Camera not ready",
            "Please wait a moment and try again."
          );


        } else {

          Alert.alert(
            "Scan failed",
            "The facial-expression scan could not be completed. Please try again."
          );
        }


      } finally {

        setIsScanning(
          false
        );
      }
    };


  /*restart scan*/

  const handleRestart =
    () => {

      setCapturedPhoto(
        null
      );

      setCapturedPhotoSize(
        null
      );

      setDetectedFaceFrame(
        null
      );

      setScanResult(
        null
      );

      setScanProgress(
        0
      );

      setIsScanning(
        false
      );


      setCameraKey(
        (
          previous
        ) =>
          previous +
          1
      );
    };

  const handleActivityPress =
    (
      activity
    ) => {

      if (
        !activity
          ?.activityScreen
      ) {
        return;
      }


      navigation.navigate(
        "HomeTab",
        {
          screen:
            activity
              .activityScreen,

          params: {
            activityId:
              activity.id,

            category:
              activity.category,

            source:
              "faceScan",

            detectedEmotion:
              scanResult
                ?.primaryEmotion ||
              null,
          },
        }
      );
    };


  /*open chatbot*/

  const handleChatbotPress =
    () => {

      navigation.navigate(
        "Chatbot"
      );
    };


  /*open journal*/

  const handleJournalPress =
    () => {

      navigation.navigate(
        "Journal",
        {
          screen:
            "AddJournal",
        }
      );
    };


  /*get face overlay style*/

  const getFaceOverlayStyle =
    () => {

      if (
        !detectedFaceFrame ||
        !capturedPhotoSize
      ) {
        return null;
      }


      const imageWidth =
        capturedPhotoSize
          .width;


      const imageHeight =
        capturedPhotoSize
          .height;


      const scaleX =
        CAMERA_CARD_WIDTH /
        imageWidth;


      const scaleY =
        CAMERA_CARD_HEIGHT /
        imageHeight;


      const faceX =
        detectedFaceFrame
          .origin
          ?.x ||
        0;


      const faceY =
        detectedFaceFrame
          .origin
          ?.y ||
        0;


      const faceWidth =
        detectedFaceFrame
          .size
          ?.x ||
        0;


      const faceHeight =
        detectedFaceFrame
          .size
          ?.y ||
        0;


      const paddingX =
        faceWidth *
        0.12;


      const paddingY =
        faceHeight *
        0.12;


      return {

        left:
          Math.max(
            0,

            (
              faceX -
              paddingX
            ) *
              scaleX
          ),


        top:
          Math.max(
            0,

            (
              faceY -
              paddingY
            ) *
              scaleY
          ),


        width:
          Math.min(
            CAMERA_CARD_WIDTH,

            (
              faceWidth +
              paddingX *
                2
            ) *
              scaleX
          ),


        height:
          Math.min(
            CAMERA_CARD_HEIGHT,

            (
              faceHeight +
              paddingY *
                2
            ) *
              scaleY
          ),
      };
    };


  const faceOverlayStyle =
    getFaceOverlayStyle();


  /*permission*/

  if (
    !permission
  ) {

    return (
      <SafeAreaView
        style={
          styles
            .centerContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={
            GREEN
          }
        />
      </SafeAreaView>
    );
  }


  if (
    !permission
      .granted
  ) {

    return (
      <SafeAreaView
        style={
          styles
            .centerContainer
        }
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />


        <Text
          style={
            styles
              .permissionTitle
          }
        >
          Camera Permission
        </Text>


        <Text
          style={
            styles
              .permissionText
          }
        >
          Healio needs camera
          access to scan your
          facial expression.
        </Text>


        <TouchableOpacity
          style={
            styles
              .permissionButton
          }
          activeOpacity={
            0.85
          }
          onPress={
            requestPermission
          }
        >
          <Text
            style={
              styles
                .permissionButtonText
            }
          >
            Allow Camera
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  /*main ui*/

  return (
    <View
      style={
        styles.background
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#c8f4e4"
      />


      <SafeAreaView
        style={
          styles.safeArea
        }
      >

        <View
          style={
            styles.topBar
          }
        >

          <TouchableOpacity
            activeOpacity={
              0.7
            }
            onPress={
              () =>
                navigation.navigate(
                  "HomeTab"
                )
            }
          >
            <Text
              style={
                styles.backIcon
              }
            >
              ‹
            </Text>
          </TouchableOpacity>


          <Text
            style={
              styles.screenTitle
            }
          >
            Scan Me
          </Text>


          <TouchableOpacity
            activeOpacity={
              0.7
            }
            onPress={
              handleRestart
            }
          >
            <Text
              style={
                styles.refreshIcon
              }
            >
              ↻
            </Text>
          </TouchableOpacity>

        </View>


        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* camera*/}

          <View
            style={
              styles.cameraCard
            }
          >

            {capturedPhoto ? (

              <>
                <Image
                  source={{
                    uri:
                      capturedPhoto,
                  }}
                  style={
                    styles
                      .photoPreview
                  }
                  resizeMode="cover"
                />


                {faceOverlayStyle && (

                  <View
                    pointerEvents="none"
                    style={[
                      styles
                        .detectedFaceBox,

                      faceOverlayStyle,
                    ]}
                  >

                    <View
                      style={[
                        styles.corner,

                        styles
                          .cornerTopLeft,
                      ]}
                    />


                    <View
                      style={[
                        styles.corner,

                        styles
                          .cornerTopRight,
                      ]}
                    />


                    <View
                      style={[
                        styles.corner,

                        styles
                          .cornerBottomLeft,
                      ]}
                    />


                    <View
                      style={[
                        styles.corner,

                        styles
                          .cornerBottomRight,
                      ]}
                    />

                  </View>
                )}
              </>

            ) : (

              <>
                <CameraView
                  key={
                    cameraKey
                  }
                  ref={
                    cameraRef
                  }
                  style={
                    styles.camera
                  }
                  facing="front"
                  mode="picture"
                  mirror
                />


                <View
                  pointerEvents="none"
                  style={
                    styles
                      .cameraHintContainer
                  }
                >
                  <Text
                    style={
                      styles
                        .cameraHintText
                    }
                  >
                    Keep your face
                    clearly visible
                  </Text>
                </View>
              </>
            )}

          </View>


          {/* scan btn*/}

          {!scanResult && (

            <TouchableOpacity
              style={[
                styles
                  .scanButton,

                isScanning &&
                  styles
                    .disabledButton,
              ]}
              activeOpacity={
                0.85
              }
              onPress={
                handleScanFace
              }
              disabled={
                isScanning
              }
            >

              <Text
                style={
                  styles
                    .scanButtonText
                }
              >
                Scan My Face
              </Text>

            </TouchableOpacity>
          )}


          {/* result */}

          {scanResult && (

            <View
              style={
                styles
                  .resultPanel
              }
            >

              {/* emotion card */}

              <View
                style={[
                  styles
                    .emotionCard,

                  {
                    borderColor:
                      scanResult
                        .color,
                  },
                ]}
              >

                <View
                  style={
                    styles
                      .emotionTopRow
                  }
                >

                  <View>

                    <Text
                      style={
                        styles
                          .smallLabel
                      }
                    >
                      Detected Emotion
                    </Text>


                    <Text
                      style={
                        styles
                          .primaryEmotion
                      }
                    >
                      {
                        scanResult
                          .displayName
                      }
                    </Text>

                  </View>


                  <Image
                    source={
                      scanResult
                        .icon
                    }
                    style={
                      styles
                        .emotionIcon
                    }
                    resizeMode="contain"
                  />

                </View>


                <View
                  style={
                    styles
                      .infoRow
                  }
                >

                  <View
                    style={[
                      styles
                        .infoPill,

                      {
                        borderColor:
                          scanResult
                            .color,
                      },
                    ]}
                  >

                    <Text
                      style={
                        styles
                          .infoLabel
                      }
                    >
                      Scan Time
                    </Text>


                    <Text
                      style={
                        styles
                          .infoValue
                      }
                    >
                      {
                        scanResult
                          .scanTimeSeconds
                      }{" "}
                      Sec
                    </Text>

                  </View>
                </View>


                <View
                  style={
                    styles
                      .confidenceRow
                  }
                >

                  <Text
                    style={
                      styles
                        .confidenceLabel
                    }
                  >
                    Confidence
                  </Text>


                  <View
                    style={
                      styles
                        .progressTrack
                    }
                  >

                    <View
                      style={[
                        styles
                          .progressFill,

                        {
                          width:
                            `${Math.round(
                              scanResult
                                .confidence *
                                100
                            )}%`,

                          backgroundColor:
                            scanResult
                              .color,
                        },
                      ]}
                    />

                  </View>


                  <Text
                    style={
                      styles
                        .confidencePercent
                    }
                  >
                    {
                      Math.round(
                        scanResult
                          .confidence *
                          100
                      )
                    }
                    %
                  </Text>

                </View>

              </View>


              {/* caption*/}

              <View
                style={[
                  styles
                    .captionBox,

                  {
                    backgroundColor:
                      scanResult
                        .softColor,

                    borderColor:
                      scanResult
                        .color,
                  },
                ]}
              >

                <Text
                  style={
                    styles
                      .captionText
                  }
                >
                  {
                    scanResult
                      .caption
                  }
                </Text>

              </View>


              {/* suggested activities*/}

              <Text
                style={
                  styles
                    .activitiesTitle
                }
              >
                Suggested for You
              </Text>


              <View
                style={
                  styles
                    .activitiesGrid
                }
              >

                {/* real activities */}

                {scanResult
                  .recommendedActivities
                  .map(
                    (
                      activity
                    ) => (

                      <TouchableOpacity
                        key={
                          `${activity.category}-${activity.id}`
                        }
                        activeOpacity={
                          0.85
                        }
                        style={[
                          styles
                            .activityCard,

                          {
                            backgroundColor:
                              scanResult
                                .softColor,

                            borderColor:
                              scanResult
                                .color,
                          },
                        ]}
                        onPress={
                          () =>
                            handleActivityPress(
                              activity
                            )
                        }
                      >

                        <Image
                          source={
                            activity
                              .image
                          }
                          style={
                            styles
                              .activityImage
                          }
                          resizeMode="cover"
                        />


                        <Text
                          style={
                            styles
                              .activityTitle
                          }
                          numberOfLines={
                            2
                          }
                        >
                          {
                            activity
                              .title
                          }
                        </Text>


                        <Text
                          style={
                            styles
                              .activityDescription
                          }
                          numberOfLines={
                            3
                          }
                        >
                          {
                            activity
                              .infoDescription
                          }
                        </Text>


                        <View
                          style={[
                            styles
                              .timeBadge,

                            {
                              borderColor:
                                scanResult
                                  .color,
                            },
                          ]}
                        >
                          <Text
                            style={
                              styles
                                .timeText
                            }
                          >
                            {
                              activity
                                .duration
                            }
                          </Text>
                        </View>

                      </TouchableOpacity>
                    )
                  )}


                {/* chatbot card */}

                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  style={[
                    styles
                      .activityCard,

                    styles
                      .supportCard,
                  ]}
                  onPress={
                    handleChatbotPress
                  }
                >

                  <Image
                    source={
                      CHATBOT_CARD_IMAGE
                    }
                    style={
                      styles
                        .supportCardImage
                    }
                    resizeMode="contain"
                  />


                  <Text
                    style={
                      styles
                        .activityTitle
                    }
                  >
                    Talk with Healio
                  </Text>


                  <Text
                    style={
                      styles
                        .activityDescription
                    }
                    numberOfLines={
                      3
                    }
                  >
                    Chat with Healio whenever you feel like talking.
                  </Text>


                  <View
                    style={
                      styles
                        .openBadge
                    }
                  >
                    <Text
                      style={
                        styles
                          .openBadgeText
                      }
                    >
                      Open Chat
                    </Text>
                  </View>

                </TouchableOpacity>


                {/* journal card */}

                <TouchableOpacity
                  activeOpacity={
                    0.85
                  }
                  style={[
                    styles
                      .activityCard,

                    styles
                      .journalCard,
                  ]}
                  onPress={
                    handleJournalPress
                  }
                >

                  <Image
                    source={
                      JOURNAL_CARD_IMAGE
                    }
                    style={
                      styles
                        .supportCardImage
                    }
                    resizeMode="contain"
                  />


                  <Text
                    style={
                      styles
                        .activityTitle
                    }
                  >
                    Write a Journal
                  </Text>


                  <Text
                    style={
                      styles
                        .activityDescription
                    }
                    numberOfLines={
                      3
                    }
                  >
                    Put your thoughts into words in your private journal.
                  </Text>


                  <View
                    style={
                      styles
                        .openBadge
                    }
                  >
                    <Text
                      style={
                        styles
                          .openBadgeText
                      }
                    >
                      Start Writing
                    </Text>
                  </View>

                </TouchableOpacity>

              </View>

            </View>
          )}

        </ScrollView>


        {/* scan overlay */}

        {isScanning && (

          <View
            style={
              styles
                .scanOverlay
            }
          >

            {capturedPhoto && (

              <Image
                source={{
                  uri:
                    capturedPhoto,
                }}
                style={
                  styles
                    .scanOverlayImage
                }
                resizeMode="cover"
              />
            )}


            <View
              style={
                styles.darkLayer
              }
            />


            <View
              style={
                styles
                  .progressCircle
              }
            >

              <Text
                style={
                  styles
                    .progressText
                }
              >
                {
                  scanProgress
                }
                %
              </Text>

            </View>


            <Text
              style={
                styles
                  .scanningText
              }
            >
              Analyzing expression...
            </Text>

          </View>
        )}

      </SafeAreaView>
    </View>
  );
}


/*styles*/

const styles =
  StyleSheet.create({

    background: {
      flex: 1,

      backgroundColor:
        "#c9f4e4",
    },


    safeArea: {
      flex: 1,
    },


    centerContainer: {
      flex: 1,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        34,
    },


    topBar: {
      height:
        70,

      marginTop:
        8,

      paddingHorizontal:
        34,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    backIcon: {
      fontSize:
        46,

      color:
        BLACK,

      marginTop:
        -6,
    },


    refreshIcon: {
      fontSize:
        34,

      color:
        BLACK,
    },


    screenTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        25,

      color:
        BLACK,
    },


    scrollContent: {
      paddingHorizontal:
        34,

      paddingBottom:
        120,

      alignItems:
        "center",
    },

    cameraCard: {
      width:
        "100%",

      height:
        CAMERA_CARD_HEIGHT,

      borderRadius:
        27,

      overflow:
        "hidden",

      backgroundColor:
        "#FFFFFF",

      borderWidth:
        1.7,

      borderColor:
        "#BFD8FF",

      shadowColor:
        "#000",

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.08,

      shadowRadius:
        8,

      elevation:
        4,
    },


    camera: {
      flex:
        1,
    },


    photoPreview: {
      width:
        "100%",

      height:
        "100%",
    },


    cameraHintContainer: {
      position:
        "absolute",

      left:
        0,

      right:
        0,

      bottom:
        22,

      alignItems:
        "center",
    },


    cameraHintText: {
      paddingHorizontal:
        15,

      paddingVertical:
        8,

      borderRadius:
        16,

      backgroundColor:
        "rgba(0,0,0,0.42)",

      color:
        "#FFFFFF",

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        12,
    },


    detectedFaceBox: {
      position:
        "absolute",
    },


    corner: {
      position:
        "absolute",

      width:
        24,

      height:
        24,

      borderColor:
        "#FFFFFF",
    },


    cornerTopLeft: {
      top:
        0,

      left:
        0,

      borderTopWidth:
        3,

      borderLeftWidth:
        3,

      borderTopLeftRadius:
        4,
    },


    cornerTopRight: {
      top:
        0,

      right:
        0,

      borderTopWidth:
        3,

      borderRightWidth:
        3,

      borderTopRightRadius:
        4,
    },


    cornerBottomLeft: {
      bottom:
        0,

      left:
        0,

      borderBottomWidth:
        3,

      borderLeftWidth:
        3,

      borderBottomLeftRadius:
        4,
    },


    cornerBottomRight: {
      bottom:
        0,

      right:
        0,

      borderBottomWidth:
        3,

      borderRightWidth:
        3,

      borderBottomRightRadius:
        4,
    },


    scanButton: {
      marginTop:
        36,

      height:
        55,

      paddingHorizontal:
        28,

      borderRadius:
        22,

      backgroundColor:
        GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      shadowColor:
        "#000",

      shadowOffset: {
        width:
          0,

        height:
          5,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        6,

      elevation:
        5,
    },


    disabledButton: {
      opacity:
        0.75,
    },


    scanButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        20,

      color:
        "#FFFFFF",
    },


    resultPanel: {
      width:
        width,

      marginTop:
        -250,

      backgroundColor:
        "#FFFFFF",

      borderTopLeftRadius:
        28,

      borderTopRightRadius:
        28,

      paddingHorizontal:
        28,

      paddingTop:
        55,

      paddingBottom:
        44,

      shadowColor:
        "#000",

      shadowOffset: {
        width:
          0,

        height:
          -4,
      },

      shadowOpacity:
        0.08,

      shadowRadius:
        8,

      elevation:
        6,
    },


    emotionCard: {
      borderWidth:
        1.5,

      borderRadius:
        18,

      padding:
        18,

      backgroundColor:
        "#FFFFFF",
    },


    emotionTopRow: {
      flexDirection:
        "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },


    smallLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        12,

      color:
        GRAY,

      marginBottom:
        4,
    },


    primaryEmotion: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        26,

      color:
        BLACK,
    },


    emotionIcon: {
      width:
        52,

      height:
        52,
    },


    infoRow: {
      flexDirection:
        "row",

      marginTop:
        14,
    },


    infoPill: {
      flex:
        1,

      height:
        48,

      borderRadius:
        16,

      borderWidth:
        1.2,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    infoLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10,

      color:
        GRAY,
    },


    infoValue: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      color:
        BLACK,

      marginTop:
        2,
    },


    confidenceRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop:
        17,
    },


    confidenceLabel: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        GRAY,

      marginRight:
        8,
    },


    progressTrack: {
      flex:
        1,

      height:
        4,

      borderRadius:
        2,

      backgroundColor:
        "#D7D7D7",

      overflow:
        "hidden",
    },


    progressFill: {
      height:
        "100%",

      borderRadius:
        2,
    },


    confidencePercent: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        12,

      color:
        BLACK,

      marginLeft:
        8,
    },


    captionBox: {
      marginTop:
        36,

      minHeight:
        72,

      borderRadius:
        18,

      borderWidth:
        1.2,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        20,
    },


    captionText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        16,

      lineHeight:
        24,

      color:
        BLACK,

      textAlign:
        "center",
    },



    activitiesTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        26,

      color:
        BLACK,

      marginTop:
        34,

      marginBottom:
        20,
    },


    activitiesGrid: {
      flexDirection:
        "row",

      flexWrap:
        "wrap",

      justifyContent:
        "space-between",
    },


    activityCard: {
      width:
        "47%",

      height:
        245,

      borderRadius:
        18,

      borderWidth:
        1.3,

      padding:
        12,

      marginBottom:
        22,

      backgroundColor:
        "#FFFFFF",
    },


    activityImage: {
      width:
        "100%",

      height:
        82,

      borderRadius:
        13,

      marginBottom:
        11,

      backgroundColor:
        "#FFFFFF",
    },


    supportCard: {
      backgroundColor:
        "#F2F7FF",

      borderColor:
        "#C9DAF2",
    },


    journalCard: {
      backgroundColor:
        "#F2FFF6",

      borderColor:
        "#C8E6D0",
    },


    supportCardImage: {
      width:
        "100%",

      height:
        82,

      marginBottom:
        11,
    },


    activityTitle: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        15,

      lineHeight:
        19,

      color:
        BLACK,
    },


    activityDescription: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      lineHeight:
        15,

      color:
        GRAY,

      marginTop:
        7,

      marginBottom:
        10,
    },


    timeBadge: {
      alignSelf:
        "flex-start",

      minWidth:
        45,

      height:
        20,

      borderRadius:
        10,

      borderWidth:
        1.2,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        7,

      marginTop:
        "auto",
    },


    timeText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        9,

      color:
        BLACK,
    },


    openBadge: {
      alignSelf:
        "flex-start",

      minHeight:
        23,

      borderRadius:
        12,

      backgroundColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        10,

      marginTop:
        "auto",

      borderWidth:
        1,

      borderColor:
        "#D7E1DA",
    },


    openBadgeText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        9.5,

      color:
        BLACK,
    },


    scanOverlay: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "#000000",

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex:
        20,
    },


    scanOverlayImage: {
      ...StyleSheet.absoluteFillObject,

      width:
        "100%",

      height:
        "100%",
    },


    darkLayer: {
      ...StyleSheet.absoluteFillObject,

      backgroundColor:
        "rgba(0,0,0,0.42)",
    },


    progressCircle: {
      width:
        96,

      height:
        96,

      borderRadius:
        48,

      borderWidth:
        7,

      borderColor:
        "#FFFFFF",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    progressText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        22,

      color:
        "#FFFFFF",
    },


    scanningText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        16,

      color:
        "#FFFFFF",

      marginTop:
        20,
    },



    permissionTitle: {
      fontFamily:
        "Itim_400Regular",

      fontSize:
        30,

      color:
        BLACK,

      marginBottom:
        12,
    },


    permissionText: {
      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        16,

      lineHeight:
        23,

      color:
        GRAY,

      textAlign:
        "center",

      marginBottom:
        28,
    },


    permissionButton: {
      width:
        "85%",

      height:
        55,

      borderRadius:
        18,

      backgroundColor:
        GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    permissionButtonText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        18,

      color:
        "#FFFFFF",
    },
  });