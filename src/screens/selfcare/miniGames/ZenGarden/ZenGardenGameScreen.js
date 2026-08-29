import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  PanResponder,
  BackHandler,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useFocusEffect,
} from "@react-navigation/native";

import {
  Ionicons,
} from "@expo/vector-icons";

import Svg, {
  Path,
} from "react-native-svg";

import {
  useAudioPlayer,
  setAudioModeAsync,
} from "expo-audio";


const SAND_SOUND =
  require(
    "../../../../../assets/audio/selfcare/miniGames/zen_sand.mp3"
  );

const AMBIENT_SOUND =
  require(
    "../../../../../assets/audio/selfcare/miniGames/zen_ambient.mp3"
  );


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F6F3EC",

  surface:
    "#FFFEFB",

  surfaceSoft:
    "#F0EEE7",

  sand:
    "#EAD8B8",

  sandLight:
    "#F4E7D0",

  sandDark:
    "#BCA179",

  rakeLine:
    "rgba(123, 101, 70, 0.42)",

  rakeHighlight:
    "rgba(255, 249, 235, 0.68)",

  sage:
    "#A6BCA4",

  sageSoft:
    "#E2EBE0",

  sageDark:
    "#627C65",

  sageDarker:
    "#536C56",

  stone:
    "#A8AAA4",

  stoneLight:
    "#D2D3CE",

  stoneDark:
    "#747771",

  flower:
    "#EBC8C0",

  flowerDark:
    "#D19E95",

  flowerCenter:
    "#D8A968",

  blue:
    "#769CA9",

  blueSoft:
    "#E2EDF0",

  textPrimary:
    "#3D413D",

  textSecondary:
    "#747A72",

  textMuted:
    "#999B95",

  border:
    "#DED9CD",

  white:
    "#FFFFFF",

  disabled:
    "#BCBBB5",

  shadow:
    "#827663",
};


/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const OBJECT_EDGE_PADDING =
  32;

const OBJECT_HIT_RADIUS =
  38;

const DRAG_START_DISTANCE =
  4;


const TOOLS = [
  {
    id:
      "rake",

    label:
      "Rake",

    icon:
      "brush-outline",
  },

  {
    id:
      "stone",

    label:
      "Stone",

    icon:
      "ellipse-outline",
  },

  {
    id:
      "leaf",

    label:
      "Leaf",

    icon:
      "leaf-outline",
  },

  {
    id:
      "flower",

    label:
      "Flower",

    icon:
      "flower-outline",
  },
];


/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

const distanceBetween =
  (
    first,
    second
  ) => {

    if (
      !first ||
      !second
    ) {

      return Infinity;
    }


    const dx =
      first.x -
      second.x;

    const dy =
      first.y -
      second.y;


    return Math.sqrt(
      dx * dx +
      dy * dy
    );
  };


const pointsToPath =
  (
    points
  ) => {

    if (
      !points ||
      points.length === 0
    ) {

      return "";
    }


    return points
      .map(
        (
          point,
          index
        ) =>
          `${
            index === 0
              ? "M"
              : "L"
          } ${point.x} ${point.y}`
      )
      .join(" ");
  };


const cloneGardenState =
  (
    strokes,
    objects
  ) => ({
    strokes:
      strokes.map(
        (
          stroke
        ) => ({
          ...stroke,

          points:
            stroke.points.map(
              (
                point
              ) => ({
                ...point,
              })
            ),
        })
      ),

    objects:
      objects.map(
        (
          item
        ) => ({
          ...item,
        })
      ),
  });


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function ZenGardenGameScreen({
  navigation,
  route,
}) {

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    selectedTool,
    setSelectedTool,
  ] =
    useState(
      "rake"
    );


  const [
    strokes,
    setStrokes,
  ] =
    useState(
      []
    );


  const [
    objects,
    setObjects,
  ] =
    useState(
      []
    );


  const [
    history,
    setHistory,
  ] =
    useState(
      []
    );


  const [
    soundEnabled,
    setSoundEnabled,
  ] =
    useState(
      true
    );


  const [
    canvasSize,
    setCanvasSize,
  ] =
    useState({
      width:
        1,

      height:
        1,
    });


  const [
    activeObjectId,
    setActiveObjectId,
  ] =
    useState(
      null
    );


  /*
   * =======================================================
   * REFS
   * =======================================================
   */

  const toolRef =
    useRef(
      selectedTool
    );


  const strokesRef =
    useRef(
      strokes
    );


  const objectsRef =
    useRef(
      objects
    );


  const canvasSizeRef =
    useRef(
      canvasSize
    );


  const currentStrokeRef =
    useRef(
      []
    );


  const startPointRef =
    useRef(
      null
    );


  const draggingObjectIdRef =
    useRef(
      null
    );


  const dragOffsetRef =
    useRef({
      x:
        0,

      y:
        0,
    });


  const movedRef =
    useRef(
      false
    );


  const historyCapturedRef =
    useRef(
      false
    );


  useEffect(
    () => {

      toolRef.current =
        selectedTool;

    },
    [
      selectedTool,
    ]
  );


  useEffect(
    () => {

      strokesRef.current =
        strokes;

    },
    [
      strokes,
    ]
  );


  useEffect(
    () => {

      objectsRef.current =
        objects;

    },
    [
      objects,
    ]
  );


  useEffect(
    () => {

      canvasSizeRef.current =
        canvasSize;

    },
    [
      canvasSize,
    ]
  );


  /*
   * =======================================================
   * AUDIO
   * =======================================================
   */

  const sandPlayer =
    useAudioPlayer(
      SAND_SOUND
    );


  const ambientPlayer =
    useAudioPlayer(
      AMBIENT_SOUND
    );


  useEffect(
    () => {

      const configureAudio =
        async () => {

          try {

            await setAudioModeAsync({
              playsInSilentMode:
                true,
            });


            ambientPlayer.loop =
              true;


            ambientPlayer.volume =
              0.1;


            ambientPlayer.play();

          } catch (
            error
          ) {

            console.log(
              "Zen Garden audio setup error:",
              error
            );
          }
        };


      configureAudio();


      return () => {

        try {

          sandPlayer.pause();

          ambientPlayer.pause();

        } catch (
          error
        ) {

          // Safe cleanup.
        }
      };

    },
    []
  );


  /*
   * =======================================================
   * AUDIO HELPERS
   * =======================================================
   */

  const startSandSound =
    async () => {

      if (
        !soundEnabled
      ) {

        return;
      }


      try {

        sandPlayer.pause();


        await sandPlayer.seekTo(
          0
        );


        sandPlayer.volume =
          0.12;


        sandPlayer.play();

      } catch (
        error
      ) {

        console.log(
          "Zen sand sound error:",
          error
        );
      }
    };


  const stopSandSound =
    () => {

      try {

        sandPlayer.pause();

      } catch (
        error
      ) {

        // Safe.
      }
    };


  const stopAllAudio =
    () => {

      try {

        sandPlayer.pause();

        ambientPlayer.pause();

      } catch (
        error
      ) {

        // Safe.
      }
    };


  /*
   * =======================================================
   * NAVIGATION BACK
   * =======================================================
   *
   * All Self Care activity back buttons should return to
   * the main SelfCare screen instead of stepping backwards
   * through every screen in the activity flow.
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

        stopAllAudio();


        navigation.reset({
          index:
            1,

          routes: [
            {
              name:
                "HomeMain",
            },

            {
              name:
                "SelfCare",
            },
          ],
        });


        return true;
      },
      [
        navigation,
      ]
    );


  useFocusEffect(
    useCallback(
      () => {

        const subscription =
          BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackToSelfCare
          );


        return () => {

          subscription.remove();
        };

      },
      [
        handleBackToSelfCare,
      ]
    )
  );


  /*
   * =======================================================
   * HISTORY
   * =======================================================
   */

  const rememberCurrentGarden =
    () => {

      const snapshot =
        cloneGardenState(
          strokesRef.current,
          objectsRef.current
        );


      setHistory(
        (
          previous
        ) => [
          ...previous,
          snapshot,
        ]
      );
    };


  /*
   * =======================================================
   * OBJECT BOUNDARIES
   * =======================================================
   */

  const clampObjectPosition =
    (
      x,
      y
    ) => {

      const currentCanvas =
        canvasSizeRef.current;


      const safeWidth =
        Math.max(
          currentCanvas.width,
          OBJECT_EDGE_PADDING * 2
        );


      const safeHeight =
        Math.max(
          currentCanvas.height,
          OBJECT_EDGE_PADDING * 2
        );


      return {
        x:
          Math.max(
            OBJECT_EDGE_PADDING,
            Math.min(
              safeWidth -
                OBJECT_EDGE_PADDING,
              x
            )
          ),

        y:
          Math.max(
            OBJECT_EDGE_PADDING,
            Math.min(
              safeHeight -
                OBJECT_EDGE_PADDING,
              y
            )
          ),
      };
    };


  /*
   * =======================================================
   * HIT TEST
   * =======================================================
   *
   * Find the top-most garden object under the user's finger.
   * We search backwards so the newest / visually top object
   * is selected first.
   * =======================================================
   */

  const findObjectAtPoint =
    (
      x,
      y
    ) => {

      const currentObjects =
        objectsRef.current;


      for (
        let index =
          currentObjects.length -
          1;

        index >=
        0;

        index -=
        1
      ) {

        const item =
          currentObjects[
            index
          ];


        const distance =
          distanceBetween(
            {
              x,
              y,
            },
            {
              x:
                item.x,

              y:
                item.y,
            }
          );


        if (
          distance <=
          OBJECT_HIT_RADIUS
        ) {

          return item;
        }
      }


      return null;
    };


  /*
   * =======================================================
   * PLACE OBJECT
   * =======================================================
   */

  const placeObject =
    (
      type,
      x,
      y
    ) => {

      const position =
        clampObjectPosition(
          x,
          y
        );


      rememberCurrentGarden();


      const newObject = {
        id:
          `${Date.now()}-${Math.random()}`,

        type,

        x:
          position.x,

        y:
          position.y,

        rotation:
          Math.random() *
            30 -
          15,

        scale:
          0.9 +
          Math.random() *
            0.18,
      };


      setObjects(
        (
          previous
        ) => [
          ...previous,
          newObject,
        ]
      );


      setActiveObjectId(
        newObject.id
      );


      setTimeout(
        () => {

          setActiveObjectId(
            null
          );
        },
        350
      );
    };


  /*
   * =======================================================
   * MOVE OBJECT
   * =======================================================
   */

  const moveObject =
    (
      objectId,
      x,
      y
    ) => {

      const position =
        clampObjectPosition(
          x,
          y
        );


      setObjects(
        (
          previous
        ) =>
          previous.map(
            (
              item
            ) => {

              if (
                item.id !==
                objectId
              ) {

                return item;
              }


              return {
                ...item,

                x:
                  position.x,

                y:
                  position.y,
              };
            }
          )
      );
    };


  /*
   * =======================================================
   * PAN RESPONDER
   * =======================================================
   *
   * Behaviour:
   *
   * 1. Touch existing object
   *    → drag that object.
   *
   * 2. Empty sand + rake selected
   *    → draw rake stroke.
   *
   * 3. Empty sand + object tool selected
   *    → place the object immediately at touch position.
   *
   * Using the initial touch position instead of the release
   * position prevents the Android top-left placement issue.
   * =======================================================
   */

  const panResponder =
    useRef(
      PanResponder.create({

        onStartShouldSetPanResponder:
          () =>
            true,


        onMoveShouldSetPanResponder:
          () =>
            true,


        onPanResponderTerminationRequest:
          () =>
            false,


        onPanResponderGrant:
          (
            event
          ) => {

            const {
              locationX,
              locationY,
            } =
              event.nativeEvent;


            const startPoint = {
              x:
                locationX,

              y:
                locationY,
            };


            startPointRef.current =
              startPoint;


            movedRef.current =
              false;


            historyCapturedRef.current =
              false;


            /*
             * First priority:
             * touching an existing object.
             */

            const touchedObject =
              findObjectAtPoint(
                locationX,
                locationY
              );


            if (
              touchedObject
            ) {

              rememberCurrentGarden();


              historyCapturedRef.current =
                true;


              draggingObjectIdRef.current =
                touchedObject.id;


              dragOffsetRef.current = {
                x:
                  locationX -
                  touchedObject.x,

                y:
                  locationY -
                  touchedObject.y,
              };


              setActiveObjectId(
                touchedObject.id
              );


              return;
            }


            draggingObjectIdRef.current =
              null;


            /*
             * Rake mode.
             */

            if (
              toolRef.current ===
              "rake"
            ) {

              rememberCurrentGarden();


              historyCapturedRef.current =
                true;


              const firstPoint = {
                x:
                  locationX,

                y:
                  locationY,
              };


              currentStrokeRef.current = [
                firstPoint,
              ];


              setStrokes(
                (
                  previous
                ) => [
                  ...previous,
                  {
                    id:
                      `${Date.now()}-${Math.random()}`,

                    points: [
                      firstPoint,
                    ],
                  },
                ]
              );


              startSandSound();


              return;
            }


            /*
             * Object mode.
             *
             * Place immediately using the reliable initial
             * touch coordinates.
             */

            placeObject(
              toolRef.current,
              locationX,
              locationY
            );
          },


        onPanResponderMove:
          (
            event
          ) => {

            const {
              locationX,
              locationY,
            } =
              event.nativeEvent;


            const currentPoint = {
              x:
                locationX,

              y:
                locationY,
            };


            if (
              distanceBetween(
                startPointRef.current,
                currentPoint
              ) >
              DRAG_START_DISTANCE
            ) {

              movedRef.current =
                true;
            }


            /*
             * Drag existing object.
             */

            if (
              draggingObjectIdRef.current
            ) {

              const offset =
                dragOffsetRef.current;


              moveObject(
                draggingObjectIdRef.current,
                locationX -
                  offset.x,
                locationY -
                  offset.y
              );


              return;
            }


            /*
             * Rake stroke.
             */

            if (
              toolRef.current !==
              "rake"
            ) {

              return;
            }


            const lastPoint =
              currentStrokeRef
                .current[
                currentStrokeRef
                  .current
                  .length -
                  1
              ];


            const nextPoint = {
              x:
                locationX,

              y:
                locationY,
            };


            if (
              distanceBetween(
                lastPoint,
                nextPoint
              ) <
              5
            ) {

              return;
            }


            currentStrokeRef.current = [
              ...currentStrokeRef.current,
              nextPoint,
            ];


            setStrokes(
              (
                previous
              ) => {

                if (
                  previous.length ===
                  0
                ) {

                  return previous;
                }


                const updated = [
                  ...previous,
                ];


                updated[
                  updated.length -
                  1
                ] = {
                  ...updated[
                    updated.length -
                    1
                  ],

                  points:
                    currentStrokeRef.current,
                };


                return updated;
              }
            );
          },


        onPanResponderRelease:
          () => {

            stopSandSound();


            currentStrokeRef.current =
              [];


            draggingObjectIdRef.current =
              null;


            dragOffsetRef.current = {
              x:
                0,

              y:
                0,
            };


            setActiveObjectId(
              null
            );


            historyCapturedRef.current =
              false;
          },


        onPanResponderTerminate:
          () => {

            stopSandSound();


            currentStrokeRef.current =
              [];


            draggingObjectIdRef.current =
              null;


            dragOffsetRef.current = {
              x:
                0,

              y:
                0,
            };


            setActiveObjectId(
              null
            );


            historyCapturedRef.current =
              false;
          },
      })
    ).current;


  /*
   * =======================================================
   * UNDO
   * =======================================================
   */

  const handleUndo =
    () => {

      if (
        history.length ===
        0
      ) {

        return;
      }


      const lastState =
        history[
          history.length -
          1
        ];


      setStrokes(
        lastState.strokes
      );


      setObjects(
        lastState.objects
      );


      setActiveObjectId(
        null
      );


      setHistory(
        (
          previous
        ) =>
          previous.slice(
            0,
            -1
          )
      );
    };


  /*
   * =======================================================
   * CLEAR
   * =======================================================
   */

  const handleClear =
    () => {

      if (
        strokes.length ===
          0 &&
        objects.length ===
          0
      ) {

        return;
      }


      rememberCurrentGarden();


      setStrokes(
        []
      );


      setObjects(
        []
      );


      setActiveObjectId(
        null
      );
    };


  /*
   * =======================================================
   * SOUND TOGGLE
   * =======================================================
   */

  const handleSoundToggle =
    () => {

      if (
        soundEnabled
      ) {

        setSoundEnabled(
          false
        );


        stopAllAudio();


        return;
      }


      setSoundEnabled(
        true
      );


      try {

        ambientPlayer.loop =
          true;


        ambientPlayer.volume =
          0.1;


        ambientPlayer.play();

      } catch (
        error
      ) {

        console.log(
          "Zen ambient resume error:",
          error
        );
      }
    };


  /*
   * =======================================================
   * FINISH
   * =======================================================
   */

  const handleFinish =
    () => {

      stopAllAudio();


      navigation.navigate(
        "ZenGardenComplete",
        {
          ...(
            route?.params ||
            {}
          ),

          strokesCreated:
            strokes.length,

          objectsPlaced:
            objects.length,
        }
      );
    };


  /*
   * =======================================================
   * TOOL HINT
   * =======================================================
   */

  const gardenHint =
    selectedTool ===
    "rake"
      ? "Glide slowly through the sand"
      : `Tap to place a ${selectedTool} · drag any object to move it`;


  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={
          COLORS.background
        }
      />


      <View
        style={
          styles.container
        }
      >

        {/* =================================================
            HEADER
           ================================================= */}

        <View
          style={
            styles.header
          }
        >

          <TouchableOpacity
            style={
              styles.headerButton
            }
            onPress={
              handleBackToSelfCare
            }
            activeOpacity={
              0.72
            }
            accessibilityRole="button"
            accessibilityLabel="Return to Self Care"
          >
            <Ionicons
              name="chevron-back"
              size={
                25
              }
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>


          <View
            style={
              styles.headerCenter
            }
          >
            <Text
              style={
                styles.headerTitle
              }
            >
              Zen Garden
            </Text>


            <Text
              style={
                styles.headerSubtitle
              }
            >
              Make a little space to slow down
            </Text>
          </View>


          <TouchableOpacity
            style={[
              styles.headerButton,

              soundEnabled &&
                styles.headerButtonActive,
            ]}
            onPress={
              handleSoundToggle
            }
            activeOpacity={
              0.72
            }
            accessibilityRole="button"
            accessibilityLabel={
              soundEnabled
                ? "Mute Zen Garden sounds"
                : "Turn on Zen Garden sounds"
            }
          >
            <Ionicons
              name={
                soundEnabled
                  ? "volume-medium-outline"
                  : "volume-mute-outline"
              }
              size={
                21
              }
              color={
                soundEnabled
                  ? COLORS.sageDark
                  : COLORS.textSecondary
              }
            />
          </TouchableOpacity>

        </View>


        {/* =================================================
            TOOL CARD
           ================================================= */}

        <View
          style={
            styles.toolCard
          }
        >

          <Text
            style={
              styles.toolCardLabel
            }
          >
            CREATE
          </Text>


          <View
            style={
              styles.toolStrip
            }
          >
            {TOOLS.map(
              (
                tool
              ) => {

                const selected =
                  selectedTool ===
                  tool.id;


                return (
                  <TouchableOpacity
                    key={
                      tool.id
                    }
                    style={[
                      styles.toolButton,

                      selected &&
                        styles.toolButtonSelected,
                    ]}
                    onPress={
                      () =>
                        setSelectedTool(
                          tool.id
                        )
                    }
                    activeOpacity={
                      0.78
                    }
                    accessibilityRole="button"
                    accessibilityLabel={
                      `Select ${tool.label}`
                    }
                  >
                    <View
                      style={[
                        styles.toolIconCircle,

                        selected &&
                          styles.toolIconCircleSelected,
                      ]}
                    >
                      <Ionicons
                        name={
                          tool.icon
                        }
                        size={
                          20
                        }
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.sageDark
                        }
                      />
                    </View>


                    <Text
                      style={[
                        styles.toolText,

                        selected &&
                          styles.toolTextSelected,
                      ]}
                    >
                      {
                        tool.label
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

        </View>


        {/* =================================================
            GARDEN
           ================================================= */}

        <View
          style={
            styles.gardenSection
          }
        >

          <View
            style={
              styles.gardenHintRow
            }
          >
            <Ionicons
              name={
                selectedTool ===
                "rake"
                  ? "finger-print-outline"
                  : "move-outline"
              }
              size={
                16
              }
              color={
                COLORS.sageDark
              }
            />


            <Text
              style={
                styles.gardenHint
              }
            >
              {
                gardenHint
              }
            </Text>
          </View>


          <View
            style={
              styles.gardenOuter
            }
          >

            <View
              style={
                styles.garden
              }
              onLayout={
                (
                  event
                ) => {

                  const {
                    width,
                    height,
                  } =
                    event
                      .nativeEvent
                      .layout;


                  setCanvasSize({
                    width,

                    height,
                  });
                }
              }
              {...panResponder.panHandlers}
            >

              {/* Sand texture */}

              <View
                pointerEvents="none"
                style={
                  styles.sandGlowTop
                }
              />


              <View
                pointerEvents="none"
                style={
                  styles.sandGlowBottom
                }
              />


              <View
                pointerEvents="none"
                style={
                  styles.sandGlowCenter
                }
              />


              {/* Rake strokes */}

              <Svg
                pointerEvents="none"
                style={
                  StyleSheet.absoluteFillObject
                }
                width="100%"
                height="100%"
              >
                {strokes.map(
                  (
                    stroke
                  ) => {

                    const path =
                      pointsToPath(
                        stroke.points
                      );


                    return (
                      <React.Fragment
                        key={
                          stroke.id
                        }
                      >

                        <Path
                          d={
                            path
                          }
                          stroke={
                            COLORS.rakeLine
                          }
                          strokeWidth="5.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />


                        <Path
                          d={
                            path
                          }
                          stroke={
                            COLORS.rakeHighlight
                          }
                          strokeWidth="1.4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          transform="translate(0 4.5)"
                        />


                        <Path
                          d={
                            path
                          }
                          stroke={
                            "rgba(255,249,235,0.46)"
                          }
                          strokeWidth="1.2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          transform="translate(0 -4.5)"
                        />

                      </React.Fragment>
                    );
                  }
                )}
              </Svg>


              {/* Garden objects */}

              {objects.map(
                (
                  item
                ) => (

                  <GardenObject
                    key={
                      item.id
                    }
                    item={
                      item
                    }
                    active={
                      activeObjectId ===
                      item.id
                    }
                  />

                )
              )}

            </View>

          </View>

        </View>


        {/* =================================================
            SMALL STATUS
           ================================================= */}

        <View
          style={
            styles.statusRow
          }
        >

          <View
            style={
              styles.statusPill
            }
          >
            <Ionicons
              name="brush-outline"
              size={
                14
              }
              color={
                COLORS.blue
              }
            />

            <Text
              style={
                styles.statusText
              }
            >
              {strokes.length} {
                strokes.length ===
                1
                  ? "stroke"
                  : "strokes"
              }
            </Text>
          </View>


          <View
            style={
              styles.statusPill
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={
                14
              }
              color={
                COLORS.sageDark
              }
            />

            <Text
              style={
                styles.statusText
              }
            >
              {objects.length} {
                objects.length ===
                1
                  ? "object"
                  : "objects"
              }
            </Text>
          </View>

        </View>


        {/* =================================================
            ACTIONS
           ================================================= */}

        <View
          style={
            styles.actionRow
          }
        >

          <TouchableOpacity
            style={[
              styles.secondaryAction,

              history.length ===
                0 &&
                styles.disabledAction,
            ]}
            disabled={
              history.length ===
              0
            }
            onPress={
              handleUndo
            }
            activeOpacity={
              0.78
            }
          >
            <Ionicons
              name="arrow-undo-outline"
              size={
                18
              }
              color={
                history.length >
                0
                  ? COLORS.blue
                  : COLORS.disabled
              }
            />

            <Text
              style={[
                styles.secondaryActionText,

                history.length ===
                  0 &&
                  styles.disabledText,
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.secondaryAction,

              strokes.length ===
                0 &&
              objects.length ===
                0 &&
                styles.disabledAction,
            ]}
            disabled={
              strokes.length ===
                0 &&
              objects.length ===
                0
            }
            onPress={
              handleClear
            }
            activeOpacity={
              0.78
            }
          >
            <Ionicons
              name="refresh-outline"
              size={
                18
              }
              color={
                strokes.length >
                  0 ||
                objects.length >
                  0
                  ? COLORS.sageDark
                  : COLORS.disabled
              }
            />

            <Text
              style={[
                styles.secondaryActionText,

                strokes.length ===
                  0 &&
                objects.length ===
                  0 &&
                  styles.disabledText,
              ]}
            >
              Clear
            </Text>
          </TouchableOpacity>

        </View>


        {/* =================================================
            DONE
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >

          <TouchableOpacity
            style={
              styles.doneButton
            }
            onPress={
              handleFinish
            }
            activeOpacity={
              0.86
            }
          >
            <Text
              style={
                styles.doneText
              }
            >
              Finish Garden
            </Text>


            <View
              style={
                styles.doneIcon
              }
            >
              <Ionicons
                name="arrow-forward"
                size={
                  17
                }
                color={
                  COLORS.sageDark
                }
              />
            </View>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}


/*
 * =========================================================
 * GARDEN OBJECT
 * =========================================================
 */

function GardenObject({
  item,
  active,
}) {

  const commonStyle = [
    styles.objectPosition,

    {
      left:
        item.x,

      top:
        item.y,

      transform: [
        {
          translateX:
            -28,
        },

        {
          translateY:
            -28,
        },

        {
          rotate:
            `${item.rotation}deg`,
        },

        {
          scale:
            active
              ? item.scale *
                1.08
              : item.scale,
        },
      ],
    },

    active &&
      styles.objectActive,
  ];


  if (
    item.type ===
    "stone"
  ) {

    return (
      <View
        pointerEvents="none"
        style={
          commonStyle
        }
      >
        <View
          style={
            styles.gardenStoneShadow
          }
        />

        <View
          style={
            styles.gardenStone
          }
        >
          <View
            style={
              styles.gardenStoneHighlight
            }
          />

          <View
            style={
              styles.gardenStoneShade
            }
          />
        </View>
      </View>
    );
  }


  if (
    item.type ===
    "leaf"
  ) {

    return (
      <View
        pointerEvents="none"
        style={
          commonStyle
        }
      >
        <View
          style={
            styles.gardenLeaf
          }
        >
          <View
            style={
              styles.gardenLeafLine
            }
          />

          <View
            style={
              styles.gardenLeafVeinOne
            }
          />

          <View
            style={
              styles.gardenLeafVeinTwo
            }
          />
        </View>
      </View>
    );
  }


  return (
    <View
      pointerEvents="none"
      style={
        commonStyle
      }
    >
      <View
        style={
          styles.gardenFlower
        }
      >

        <View
          style={[
            styles.gardenPetal,

            styles.gardenPetalTop,
          ]}
        />


        <View
          style={[
            styles.gardenPetal,

            styles.gardenPetalRight,
          ]}
        />


        <View
          style={[
            styles.gardenPetal,

            styles.gardenPetalBottom,
          ]}
        />


        <View
          style={[
            styles.gardenPetal,

            styles.gardenPetalLeft,
          ]}
        />


        <View
          style={
            styles.gardenFlowerCenter
          }
        />

      </View>
    </View>
  );
}


/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({

    safeArea: {
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },


    container: {
      flex:
        1,

      backgroundColor:
        COLORS.background,
    },


    /*
     * =====================================================
     * HEADER
     * =====================================================
     */

    header: {
      minHeight:
        68,

      paddingHorizontal:
        20,

      paddingTop:
        4,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    headerButton: {
      width:
        42,

      height:
        42,

      borderRadius:
        21,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.surface,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        COLORS.shadow,

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      shadowOpacity:
        0.07,

      shadowRadius:
        4,

      elevation:
        2,
    },


    headerButtonActive: {
      backgroundColor:
        COLORS.sageSoft,

      borderColor:
        "#C7D6C6",
    },


    headerCenter: {
      flex:
        1,

      alignItems:
        "center",

      paddingHorizontal:
        8,
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        18,

      color:
        COLORS.textPrimary,
    },


    headerSubtitle: {
      marginTop:
        3,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * TOOL CARD
     * =====================================================
     */

    toolCard: {
      marginHorizontal:
        20,

      marginTop:
        8,

      paddingTop:
        11,

      paddingHorizontal:
        8,

      paddingBottom:
        8,

      borderRadius:
        25,

      backgroundColor:
        COLORS.surface,

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      shadowColor:
        COLORS.shadow,

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.06,

      shadowRadius:
        7,

      elevation:
        2,
    },


    toolCardLabel: {
      marginLeft:
        10,

      marginBottom:
        7,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        9,

      letterSpacing:
        1.5,

      color:
        COLORS.textMuted,
    },


    toolStrip: {
      flexDirection:
        "row",
    },


    toolButton: {
      flex:
        1,

      minHeight:
        62,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    toolButtonSelected: {
      backgroundColor:
        COLORS.sageDark,
    },


    toolIconCircle: {
      width:
        31,

      height:
        31,

      borderRadius:
        16,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.sageSoft,
    },


    toolIconCircleSelected: {
      backgroundColor:
        "rgba(255,255,255,0.16)",
    },


    toolText: {
      marginTop:
        5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        9.5,

      color:
        COLORS.textSecondary,
    },


    toolTextSelected: {
      color:
        COLORS.white,
    },


    /*
     * =====================================================
     * GARDEN
     * =====================================================
     */

    gardenSection: {
      flex:
        1,

      marginHorizontal:
        20,

      marginTop:
        13,

      minHeight:
        365,
    },


    gardenHintRow: {
      minHeight:
        34,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal:
        8,
    },


    gardenHint: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        11,

      color:
        COLORS.textSecondary,

      textAlign:
        "center",
    },


    gardenOuter: {
      flex:
        1,

      minHeight:
        340,

      padding:
        5,

      borderRadius:
        35,

      backgroundColor:
        "#DCC6A3",

      shadowColor:
        COLORS.shadow,

      shadowOffset: {
        width:
          0,

        height:
          7,
      },

      shadowOpacity:
        0.14,

      shadowRadius:
        12,

      elevation:
        4,
    },


    garden: {
      flex:
        1,

      minHeight:
        330,

      position:
        "relative",

      overflow:
        "hidden",

      borderRadius:
        30,

      backgroundColor:
        COLORS.sand,

      borderWidth:
        1,

      borderColor:
        "rgba(255,255,255,0.34)",
    },


    sandGlowTop: {
      position:
        "absolute",

      width:
        230,

      height:
        230,

      borderRadius:
        115,

      top:
        -120,

      left:
        -70,

      backgroundColor:
        "rgba(255,255,255,0.16)",
    },


    sandGlowBottom: {
      position:
        "absolute",

      width:
        260,

      height:
        260,

      borderRadius:
        130,

      right:
        -120,

      bottom:
        -120,

      backgroundColor:
        "rgba(153,119,76,0.06)",
    },


    sandGlowCenter: {
      position:
        "absolute",

      width:
        130,

      height:
        130,

      borderRadius:
        65,

      left:
        "33%",

      top:
        "32%",

      backgroundColor:
        "rgba(255,255,255,0.055)",
    },


    /*
     * =====================================================
     * GARDEN OBJECTS
     * =====================================================
     */

    objectPosition: {
      position:
        "absolute",

      width:
        56,

      height:
        56,

      alignItems:
        "center",

      justifyContent:
        "center",

      zIndex:
        20,
    },


    objectActive: {
      zIndex:
        40,
    },


    gardenStoneShadow: {
      position:
        "absolute",

      width:
        49,

      height:
        25,

      borderRadius:
        15,

      top:
        22,

      backgroundColor:
        "rgba(92,83,68,0.14)",

      transform: [
        {
          scaleX:
            1.08,
        },
      ],
    },


    gardenStone: {
      width:
        54,

      height:
        37,

      borderRadius:
        21,

      overflow:
        "hidden",

      backgroundColor:
        COLORS.stone,

      borderWidth:
        1,

      borderColor:
        COLORS.stoneDark,

      shadowColor:
        COLORS.stoneDark,

      shadowOffset: {
        width:
          0,

        height:
          3,
      },

      shadowOpacity:
        0.16,

      shadowRadius:
        4,

      elevation:
        3,
    },


    gardenStoneHighlight: {
      position:
        "absolute",

      width:
        24,

      height:
        8,

      borderRadius:
        6,

      left:
        8,

      top:
        6,

      backgroundColor:
        "rgba(255,255,255,0.32)",
    },


    gardenStoneShade: {
      position:
        "absolute",

      width:
        26,

      height:
        14,

      borderRadius:
        10,

      right:
        -4,

      bottom:
        -3,

      backgroundColor:
        "rgba(80,83,77,0.12)",
    },


    gardenLeaf: {
      width:
        50,

      height:
        30,

      borderTopLeftRadius:
        30,

      borderBottomRightRadius:
        30,

      backgroundColor:
        COLORS.sage,

      borderWidth:
        1,

      borderColor:
        COLORS.sageDark,

      alignItems:
        "center",

      justifyContent:
        "center",

      shadowColor:
        COLORS.sageDark,

      shadowOffset: {
        width:
          0,

        height:
          2,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        3,

      elevation:
        2,
    },


    gardenLeafLine: {
      width:
        36,

      height:
        1.2,

      backgroundColor:
        COLORS.sageDark,

      transform: [
        {
          rotate:
            "-18deg",
        },
      ],
    },


    gardenLeafVeinOne: {
      position:
        "absolute",

      width:
        12,

      height:
        1,

      left:
        12,

      top:
        10,

      backgroundColor:
        "rgba(92,118,95,0.62)",

      transform: [
        {
          rotate:
            "24deg",
        },
      ],
    },


    gardenLeafVeinTwo: {
      position:
        "absolute",

      width:
        11,

      height:
        1,

      right:
        12,

      bottom:
        9,

      backgroundColor:
        "rgba(92,118,95,0.55)",

      transform: [
        {
          rotate:
            "24deg",
        },
      ],
    },


    gardenFlower: {
      width:
        52,

      height:
        52,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    gardenPetal: {
      position:
        "absolute",

      width:
        22,

      height:
        22,

      borderRadius:
        12,

      backgroundColor:
        COLORS.flower,

      borderWidth:
        0.8,

      borderColor:
        COLORS.flowerDark,

      shadowColor:
        COLORS.flowerDark,

      shadowOffset: {
        width:
          0,

        height:
          1,
      },

      shadowOpacity:
        0.12,

      shadowRadius:
        2,
    },


    gardenPetalTop: {
      top:
        1,
    },


    gardenPetalBottom: {
      bottom:
        1,
    },


    gardenPetalLeft: {
      left:
        1,
    },


    gardenPetalRight: {
      right:
        1,
    },


    gardenFlowerCenter: {
      width:
        17,

      height:
        17,

      borderRadius:
        9,

      backgroundColor:
        COLORS.flowerCenter,

      borderWidth:
        1,

      borderColor:
        "#BF8D51",

      zIndex:
        4,
    },


    /*
     * =====================================================
     * STATUS
     * =====================================================
     */

    statusRow: {
      marginHorizontal:
        20,

      marginTop:
        10,

      flexDirection:
        "row",

      justifyContent:
        "center",

      gap:
        8,
    },


    statusPill: {
      minHeight:
        30,

      paddingHorizontal:
        12,

      borderRadius:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        COLORS.surfaceSoft,
    },


    statusText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        10,

      color:
        COLORS.textSecondary,
    },


    /*
     * =====================================================
     * ACTIONS
     * =====================================================
     */

    actionRow: {
      marginHorizontal:
        20,

      marginTop:
        10,

      flexDirection:
        "row",

      gap:
        10,
    },


    secondaryAction: {
      flex:
        1,

      height:
        44,

      borderRadius:
        17,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.surface,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    disabledAction: {
      opacity:
        0.5,
    },


    secondaryActionText: {
      marginLeft:
        6,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        12,

      color:
        COLORS.textSecondary,
    },


    disabledText: {
      color:
        COLORS.disabled,
    },


    /*
     * =====================================================
     * BOTTOM
     * =====================================================
     */

    bottomContainer: {
      paddingHorizontal:
        20,

      paddingTop:
        11,

      paddingBottom:
        15,
    },


    doneButton: {
      height:
        56,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.sageDark,

      shadowColor:
        COLORS.sageDarker,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.18,

      shadowRadius:
        7,

      elevation:
        3,
    },


    doneText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15.5,

      color:
        COLORS.white,
    },


    doneIcon: {
      width:
        28,

      height:
        28,

      marginLeft:
        10,

      borderRadius:
        14,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,
    },
  });