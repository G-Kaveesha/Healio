import React, {
  useCallback,
  useEffect,
  useMemo,
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
  Alert,
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


/*
 * =========================================================
 * COLORS
 * =========================================================
 */

const COLORS = {
  background:
    "#F5F3EE",

  card:
    "#FFFFFF",

  canvas:
    "#FFFFFF",

  peach:
    "#F4D7C3",

  peachDark:
    "#D9895B",

  sky:
    "#DCEBF2",

  skyDark:
    "#628FA2",

  mint:
    "#E0ECE2",

  mintDark:
    "#668B70",

  lilac:
    "#E8E2F4",

  lilacDark:
    "#8876B4",

  rose:
    "#F3DDE4",

  roseDark:
    "#CB7D94",

  textPrimary:
    "#374044",

  textSecondary:
    "#748085",

  textMuted:
    "#A3A9AB",

  border:
    "#E5E0D8",

  white:
    "#FFFFFF",

  disabled:
    "#BFC1BE",

  toolbar:
    "#FBFAF7",
};


/*
 * =========================================================
 * PALETTE
 * =========================================================
 */

const PALETTE = [
  {
    id:
      "charcoal",

    name:
      "Charcoal",

    color:
      "#3E4549",
  },

  {
    id:
      "blue",

    name:
      "Blue",

    color:
      "#66A6C4",
  },

  {
    id:
      "green",

    name:
      "Green",

    color:
      "#72AC82",
  },

  {
    id:
      "purple",

    name:
      "Purple",

    color:
      "#9B82CD",
  },

  {
    id:
      "pink",

    name:
      "Pink",

    color:
      "#DE839D",
  },

  {
    id:
      "orange",

    name:
      "Orange",

    color:
      "#E79A62",
  },

  {
    id:
      "yellow",

    name:
      "Yellow",

    color:
      "#DDB94F",
  },

  {
    id:
      "teal",

    name:
      "Teal",

    color:
      "#5AA8A1",
  },
];


/*
 * =========================================================
 * DRAWING TOOLS
 * =========================================================
 */

const TOOLS = [
  {
    id:
      "pen",

    title:
      "Pen",

    icon:
      "pencil-outline",
  },

  {
    id:
      "brush",

    title:
      "Brush",

    icon:
      "brush-outline",
  },
];


const SIZE_OPTIONS = [
  {
    id:
      "small",

    label:
      "Thin",

    previewSize:
      5,
  },

  {
    id:
      "medium",

    label:
      "Medium",

    previewSize:
      9,
  },

  {
    id:
      "large",

    label:
      "Thick",

    previewSize:
      14,
  },
];


const PEN_WIDTHS = [
  2.5,
  4.5,
  7,
];


const BRUSH_WIDTHS = [
  8,
  14,
  22,
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


/*
 * Creates a softer path than directly joining every
 * coordinate with straight line segments.
 */

const pointsToSmoothPath =
  (
    points
  ) => {

    if (
      !points ||
      points.length ===
        0
    ) {

      return "";
    }


    if (
      points.length ===
      1
    ) {

      const point =
        points[0];


      return (
        `M ${point.x} ${point.y} ` +
        `L ${point.x + 0.1} ${point.y + 0.1}`
      );
    }


    if (
      points.length ===
      2
    ) {

      return (
        `M ${points[0].x} ${points[0].y} ` +
        `L ${points[1].x} ${points[1].y}`
      );
    }


    let path =
      `M ${points[0].x} ${points[0].y}`;


    for (
      let index =
        1;

      index <
      points.length -
        1;

      index +=
      1
    ) {

      const current =
        points[
          index
        ];


      const next =
        points[
          index +
            1
        ];


      const middleX =
        (
          current.x +
          next.x
        ) /
        2;


      const middleY =
        (
          current.y +
          next.y
        ) /
        2;


      path +=
        ` Q ${current.x} ${current.y} ` +
        `${middleX} ${middleY}`;
    }


    const finalPoint =
      points[
        points.length -
        1
      ];


    path +=
      ` L ${finalPoint.x} ${finalPoint.y}`;


    return path;
  };


/*
 * =========================================================
 * SCREEN
 * =========================================================
 */

export default function ColorUnwindCanvasScreen({
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
      "pen"
    );


  const [
    selectedColor,
    setSelectedColor,
  ] =
    useState(
      PALETTE[0].color
    );


  const [
    selectedSizeIndex,
    setSelectedSizeIndex,
  ] =
    useState(
      1
    );


  const [
    strokes,
    setStrokes,
  ] =
    useState(
      []
    );


  const [
    redoStack,
    setRedoStack,
  ] =
    useState(
      []
    );


  const [
    isDrawing,
    setIsDrawing,
  ] =
    useState(
      false
    );


  /*
   * =======================================================
   * REFS
   * =======================================================
   */

  const selectedToolRef =
    useRef(
      selectedTool
    );


  const selectedColorRef =
    useRef(
      selectedColor
    );


  const selectedSizeRef =
    useRef(
      selectedSizeIndex
    );


  const currentStrokeIdRef =
    useRef(
      null
    );


  const currentPointsRef =
    useRef(
      []
    );


  const startedAtRef =
    useRef(
      Date.now()
    );


  useEffect(
    () => {

      selectedToolRef.current =
        selectedTool;

    },
    [
      selectedTool,
    ]
  );


  useEffect(
    () => {

      selectedColorRef.current =
        selectedColor;

    },
    [
      selectedColor,
    ]
  );


  useEffect(
    () => {

      selectedSizeRef.current =
        selectedSizeIndex;

    },
    [
      selectedSizeIndex,
    ]
  );


  /*
   * =======================================================
   * BACK TO SELF CARE
   * =======================================================
   */

  const handleBackToSelfCare =
    useCallback(
      () => {

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
   * CURRENT WIDTH
   * =======================================================
   */

  const getStrokeWidth =
    (
      tool,
      sizeIndex
    ) => {

      if (
        tool ===
        "brush"
      ) {

        return (
          BRUSH_WIDTHS[
            sizeIndex
          ] ||
          BRUSH_WIDTHS[1]
        );
      }


      return (
        PEN_WIDTHS[
          sizeIndex
        ] ||
        PEN_WIDTHS[1]
      );
    };


  /*
   * =======================================================
   * PAN RESPONDER
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


            const tool =
              selectedToolRef.current;


            const color =
              selectedColorRef.current;


            const sizeIndex =
              selectedSizeRef.current;


            const strokeWidth =
              getStrokeWidth(
                tool,
                sizeIndex
              );


            const id =
              `${Date.now()}-${Math.random()}`;


            const firstPoint = {
              x:
                locationX,

              y:
                locationY,
            };


            currentStrokeIdRef.current =
              id;


            currentPointsRef.current = [
              firstPoint,
            ];


            setRedoStack(
              []
            );


            setIsDrawing(
              true
            );


            setStrokes(
              (
                previous
              ) => [
                ...previous,

                {
                  id,

                  tool,

                  color,

                  width:
                    strokeWidth,

                  opacity:
                    tool ===
                    "brush"
                      ? 0.78
                      : 1,

                  points: [
                    firstPoint,
                  ],
                },
              ]
            );
          },


        onPanResponderMove:
          (
            event
          ) => {

            if (
              !currentStrokeIdRef.current
            ) {

              return;
            }


            const {
              locationX,
              locationY,
            } =
              event.nativeEvent;


            const nextPoint = {
              x:
                locationX,

              y:
                locationY,
            };


            const existingPoints =
              currentPointsRef.current;


            const lastPoint =
              existingPoints[
                existingPoints.length -
                  1
              ];


            /*
             * Do not store dozens of almost-identical
             * coordinates.
             */

            if (
              distanceBetween(
                lastPoint,
                nextPoint
              ) <
              2.2
            ) {

              return;
            }


            currentPointsRef.current = [
              ...existingPoints,
              nextPoint,
            ];


            const currentId =
              currentStrokeIdRef.current;


            setStrokes(
              (
                previous
              ) =>
                previous.map(
                  (
                    stroke
                  ) => {

                    if (
                      stroke.id !==
                      currentId
                    ) {

                      return stroke;
                    }


                    return {
                      ...stroke,

                      points:
                        currentPointsRef.current,
                    };
                  }
                )
            );
          },


        onPanResponderRelease:
          () => {

            currentStrokeIdRef.current =
              null;


            currentPointsRef.current =
              [];


            setIsDrawing(
              false
            );
          },


        onPanResponderTerminate:
          () => {

            currentStrokeIdRef.current =
              null;


            currentPointsRef.current =
              [];


            setIsDrawing(
              false
            );
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
        strokes.length ===
        0
      ) {

        return;
      }


      const lastStroke =
        strokes[
          strokes.length -
          1
        ];


      setStrokes(
        (
          previous
        ) =>
          previous.slice(
            0,
            -1
          )
      );


      setRedoStack(
        (
          previous
        ) => [
          ...previous,
          lastStroke,
        ]
      );
    };


  /*
   * =======================================================
   * REDO
   * =======================================================
   */

  const handleRedo =
    () => {

      if (
        redoStack.length ===
        0
      ) {

        return;
      }


      const strokeToRestore =
        redoStack[
          redoStack.length -
          1
        ];


      setRedoStack(
        (
          previous
        ) =>
          previous.slice(
            0,
            -1
          )
      );


      setStrokes(
        (
          previous
        ) => [
          ...previous,
          strokeToRestore,
        ]
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
        0
      ) {

        return;
      }


      Alert.alert(
        "Clear drawing?",
        "This will remove everything from your canvas.",
        [
          {
            text:
              "Cancel",

            style:
              "cancel",
          },

          {
            text:
              "Clear",

            style:
              "destructive",

            onPress:
              () => {

                setStrokes(
                  []
                );


                setRedoStack(
                  []
                );
              },
          },
        ]
      );
    };


  /*
   * =======================================================
   * COLORS USED
   * =======================================================
   */

  const colorsUsed =
    useMemo(
      () => {

        return new Set(
          strokes.map(
            (
              stroke
            ) =>
              stroke.color
          )
        ).size;

      },
      [
        strokes,
      ]
    );


  /*
   * =======================================================
   * FINISH
   * =======================================================
   */

  const handleFinish =
    () => {

      const drawingTimeSeconds =
        Math.max(
          1,

          Math.round(
            (
              Date.now() -
              startedAtRef.current
            ) /
            1000
          )
        );


      navigation.navigate(
        "ColorUnwindComplete",
        {
          ...(
            route?.params ||
            {}
          ),

          activityId:
            route?.params
              ?.activityId ||
            "color-unwind",

          category:
            route?.params
              ?.category ||
            "miniGames",

          strokeCount:
            strokes.length,

          colorsUsed,

          drawingTimeSeconds,
        }
      );
    };


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
              Color & Unwind
            </Text>

            <Text
              style={
                styles.headerSubtitle
              }
            >
              Draw freely
            </Text>
          </View>


          <TouchableOpacity
            style={[
              styles.headerButton,

              strokes.length ===
                0 &&
                styles.headerButtonDisabled,
            ]}
            onPress={
              handleClear
            }
            disabled={
              strokes.length ===
              0
            }
            activeOpacity={
              0.72
            }
            accessibilityRole="button"
            accessibilityLabel="Clear drawing"
          >
            <Ionicons
              name="trash-outline"
              size={
                20
              }
              color={
                strokes.length >
                0
                  ? COLORS.roseDark
                  : COLORS.disabled
              }
            />
          </TouchableOpacity>

        </View>


        {/* =================================================
            SMALL INTRO
           ================================================= */}

        <View
          style={
            styles.canvasHeader
          }
        >
          <View>
            <Text
              style={
                styles.canvasTitle
              }
            >
              Your canvas
            </Text>

            <Text
              style={
                styles.canvasSubtitle
              }
            >
              There is no right way to fill it.
            </Text>
          </View>


          <View
            style={
              styles.strokeCountPill
            }
          >
            <Ionicons
              name="sparkles-outline"
              size={
                14
              }
              color={
                COLORS.lilacDark
              }
            />

            <Text
              style={
                styles.strokeCountText
              }
            >
              {strokes.length}
            </Text>
          </View>
        </View>


        {/* =================================================
            DRAWING CANVAS
           ================================================= */}

        <View
          style={
            styles.canvasOuter
          }
        >

          <View
            style={
              styles.canvas
            }
            {...panResponder.panHandlers}
          >

            {strokes.length ===
              0 &&
              !isDrawing && (

                <View
                  pointerEvents="none"
                  style={
                    styles.emptyCanvas
                  }
                >
                  <View
                    style={
                      styles.emptyCanvasIcon
                    }
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={
                        27
                      }
                      color={
                        COLORS.skyDark
                      }
                    />
                  </View>


                  <Text
                    style={
                      styles.emptyCanvasTitle
                    }
                  >
                    Start anywhere
                  </Text>


                  <Text
                    style={
                      styles.emptyCanvasText
                    }
                  >
                    Touch the page and let your hand move.
                  </Text>
                </View>
              )}


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
                ) => (

                  <Path
                    key={
                      stroke.id
                    }
                    d={
                      pointsToSmoothPath(
                        stroke.points
                      )
                    }
                    stroke={
                      stroke.color
                    }
                    strokeWidth={
                      stroke.width
                    }
                    strokeOpacity={
                      stroke.opacity
                    }
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                )
              )}

            </Svg>

          </View>

        </View>


        {/* =================================================
            TOOL BAR
           ================================================= */}

        <View
          style={
            styles.toolPanel
          }
        >

          {/* Tool selection */}

          <View
            style={
              styles.toolTopRow
            }
          >

            <View
              style={
                styles.toolSelector
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
                        styles.toolChoice,

                        selected &&
                          styles.toolChoiceSelected,
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
                    >
                      <Ionicons
                        name={
                          tool.icon
                        }
                        size={
                          18
                        }
                        color={
                          selected
                            ? COLORS.white
                            : COLORS.textSecondary
                        }
                      />

                      <Text
                        style={[
                          styles.toolChoiceText,

                          selected &&
                            styles.toolChoiceTextSelected,
                        ]}
                      >
                        {
                          tool.title
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}

            </View>


            {/* Undo / Redo */}

            <View
              style={
                styles.historyButtons
              }
            >

              <TouchableOpacity
                style={[
                  styles.historyButton,

                  strokes.length ===
                    0 &&
                    styles.historyButtonDisabled,
                ]}
                onPress={
                  handleUndo
                }
                disabled={
                  strokes.length ===
                  0
                }
                activeOpacity={
                  0.72
                }
              >
                <Ionicons
                  name="arrow-undo-outline"
                  size={
                    19
                  }
                  color={
                    strokes.length >
                    0
                      ? COLORS.skyDark
                      : COLORS.disabled
                  }
                />
              </TouchableOpacity>


              <TouchableOpacity
                style={[
                  styles.historyButton,

                  redoStack.length ===
                    0 &&
                    styles.historyButtonDisabled,
                ]}
                onPress={
                  handleRedo
                }
                disabled={
                  redoStack.length ===
                  0
                }
                activeOpacity={
                  0.72
                }
              >
                <Ionicons
                  name="arrow-redo-outline"
                  size={
                    19
                  }
                  color={
                    redoStack.length >
                    0
                      ? COLORS.skyDark
                      : COLORS.disabled
                  }
                />
              </TouchableOpacity>

            </View>

          </View>


          {/* Colors */}

          <View
            style={
              styles.colorSection
            }
          >
            <Text
              style={
                styles.controlLabel
              }
            >
              COLOR
            </Text>


            <View
              style={
                styles.paletteRow
              }
            >

              {PALETTE.map(
                (
                  item
                ) => {

                  const selected =
                    selectedColor ===
                    item.color;


                  return (
                    <TouchableOpacity
                      key={
                        item.id
                      }
                      style={[
                        styles.paletteOuter,

                        selected &&
                          styles.paletteOuterSelected,
                      ]}
                      onPress={
                        () =>
                          setSelectedColor(
                            item.color
                          )
                      }
                      activeOpacity={
                        0.8
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        `Select ${item.name}`
                      }
                    >
                      <View
                        style={[
                          styles.paletteDot,

                          {
                            backgroundColor:
                              item.color,
                          },
                        ]}
                      >
                        {selected && (

                          <Ionicons
                            name="checkmark"
                            size={
                              14
                            }
                            color={
                              COLORS.white
                            }
                          />

                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}

            </View>
          </View>


          {/* Width */}

          <View
            style={
              styles.sizeSection
            }
          >

            <Text
              style={
                styles.controlLabel
              }
            >
              SIZE
            </Text>


            <View
              style={
                styles.sizeRow
              }
            >

              {SIZE_OPTIONS.map(
                (
                  item,
                  index
                ) => {

                  const selected =
                    selectedSizeIndex ===
                    index;


                  return (
                    <TouchableOpacity
                      key={
                        item.id
                      }
                      style={[
                        styles.sizeButton,

                        selected &&
                          styles.sizeButtonSelected,
                      ]}
                      onPress={
                        () =>
                          setSelectedSizeIndex(
                            index
                          )
                      }
                      activeOpacity={
                        0.78
                      }
                    >

                      <View
                        style={[
                          styles.sizePreview,

                          {
                            width:
                              item.previewSize,

                            height:
                              item.previewSize,

                            borderRadius:
                              item.previewSize /
                              2,

                            backgroundColor:
                              selected
                                ? selectedColor
                                : COLORS.textSecondary,
                          },
                        ]}
                      />


                      <Text
                        style={[
                          styles.sizeText,

                          selected &&
                            styles.sizeTextSelected,
                        ]}
                      >
                        {
                          item.label
                        }
                      </Text>

                    </TouchableOpacity>
                  );
                }
              )}

            </View>

          </View>

        </View>


        {/* =================================================
            FINISH
           ================================================= */}

        <View
          style={
            styles.bottomContainer
          }
        >

          <TouchableOpacity
            style={
              styles.finishButton
            }
            onPress={
              handleFinish
            }
            activeOpacity={
              0.86
            }
            accessibilityRole="button"
            accessibilityLabel="Finish drawing"
          >

            <Text
              style={
                styles.finishText
              }
            >
              Finish Drawing
            </Text>


            <View
              style={
                styles.finishIcon
              }
            >
              <Ionicons
                name="arrow-forward"
                size={
                  17
                }
                color={
                  COLORS.peachDark
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
     * Header
     */

    header: {
      height:
        64,

      paddingHorizontal:
        18,

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
        COLORS.card,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    headerButtonDisabled: {
      opacity:
        0.55,
    },


    headerCenter: {
      flex:
        1,

      alignItems:
        "center",
    },


    headerTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        17,

      color:
        COLORS.textPrimary,
    },


    headerSubtitle: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    /*
     * Canvas heading
     */

    canvasHeader: {
      minHeight:
        54,

      marginHorizontal:
        21,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    canvasTitle: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        16,

      color:
        COLORS.textPrimary,
    },


    canvasSubtitle: {
      marginTop:
        2,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    strokeCountPill: {
      minWidth:
        47,

      height:
        29,

      paddingHorizontal:
        10,

      borderRadius:
        15,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.lilac,
    },


    strokeCountText: {
      marginLeft:
        4,

      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        11,

      color:
        COLORS.lilacDark,
    },


    /*
     * Canvas
     */

    canvasOuter: {
      flex:
        1,

      minHeight:
        300,

      marginHorizontal:
        20,

      padding:
        5,

      borderRadius:
        29,

      backgroundColor:
        "#E8E3DB",

      shadowColor:
        "#8C857B",

      shadowOffset: {
        width:
          0,

        height:
          6,
      },

      shadowOpacity:
        0.11,

      shadowRadius:
        10,

      elevation:
        3,
    },


    canvas: {
      flex:
        1,

      minHeight:
        290,

      position:
        "relative",

      overflow:
        "hidden",

      borderRadius:
        24,

      backgroundColor:
        COLORS.canvas,
    },


    emptyCanvas: {
      ...StyleSheet.absoluteFillObject,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    emptyCanvasIcon: {
      width:
        54,

      height:
        54,

      borderRadius:
        19,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.sky,
    },


    emptyCanvasTitle: {
      marginTop:
        11,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        14,

      color:
        "#858D90",
    },


    emptyCanvasText: {
      marginTop:
        4,

      fontFamily:
        "JosefinSans_400Regular",

      fontSize:
        10.5,

      color:
        COLORS.textMuted,
    },


    /*
     * Toolbar
     */

    toolPanel: {
      marginHorizontal:
        20,

      marginTop:
        11,

      padding:
        11,

      borderRadius:
        24,

      backgroundColor:
        COLORS.toolbar,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    toolTopRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    toolSelector: {
      flex:
        1,

      height:
        42,

      flexDirection:
        "row",

      padding:
        3,

      borderRadius:
        15,

      backgroundColor:
        "#EFEEE9",
    },


    toolChoice: {
      flex:
        1,

      borderRadius:
        12,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    toolChoiceSelected: {
      backgroundColor:
        COLORS.skyDark,
    },


    toolChoiceText: {
      marginLeft:
        5,

      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        10.5,

      color:
        COLORS.textSecondary,
    },


    toolChoiceTextSelected: {
      color:
        COLORS.white,
    },


    historyButtons: {
      marginLeft:
        9,

      flexDirection:
        "row",
    },


    historyButton: {
      width:
        38,

      height:
        38,

      marginLeft:
        6,

      borderRadius:
        13,

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.white,

      borderWidth:
        1,

      borderColor:
        COLORS.border,
    },


    historyButtonDisabled: {
      opacity:
        0.55,
    },


    /*
     * Color controls
     */

    colorSection: {
      marginTop:
        11,
    },


    controlLabel: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        8.5,

      letterSpacing:
        1.2,

      color:
        COLORS.textMuted,

      marginBottom:
        7,
    },


    paletteRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },


    paletteOuter: {
      width:
        36,

      height:
        36,

      borderRadius:
        18,

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        2,

      borderColor:
        "transparent",
    },


    paletteOuterSelected: {
      borderColor:
        COLORS.textPrimary,
    },


    paletteDot: {
      width:
        27,

      height:
        27,

      borderRadius:
        14,

      alignItems:
        "center",

      justifyContent:
        "center",
    },


    /*
     * Size
     */

    sizeSection: {
      marginTop:
        9,
    },


    sizeRow: {
      flexDirection:
        "row",

      gap:
        7,
    },


    sizeButton: {
      flex:
        1,

      height:
        35,

      borderRadius:
        13,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      borderWidth:
        1,

      borderColor:
        COLORS.border,

      backgroundColor:
        COLORS.white,
    },


    sizeButtonSelected: {
      backgroundColor:
        COLORS.lilac,

      borderColor:
        "#CABFE2",
    },


    sizePreview: {
      marginRight:
        5,
    },


    sizeText: {
      fontFamily:
        "JosefinSans_600SemiBold",

      fontSize:
        9,

      color:
        COLORS.textSecondary,
    },


    sizeTextSelected: {
      color:
        COLORS.lilacDark,
    },


    /*
     * Bottom
     */

    bottomContainer: {
      paddingHorizontal:
        20,

      paddingTop:
        10,

      paddingBottom:
        14,
    },


    finishButton: {
      height:
        55,

      borderRadius:
        20,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      backgroundColor:
        COLORS.peachDark,

      shadowColor:
        COLORS.peachDark,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      shadowOpacity:
        0.16,

      shadowRadius:
        7,

      elevation:
        3,
    },


    finishText: {
      fontFamily:
        "JosefinSans_700Bold",

      fontSize:
        15,

      color:
        COLORS.white,
    },


    finishIcon: {
      width:
        28,

      height:
        28,

      marginLeft:
        9,

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