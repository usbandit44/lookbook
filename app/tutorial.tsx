import AppButton from "@/components/ui/AppButton";
import images from "@/constants/images";
import { useRepo } from "@/hooks/RepoProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

type Slide = {
  image: any;
};

const TutorialPage = () => {
  const { userRepo } = useRepo();
  const router = useRouter();
  const posthog = usePostHog();

  const sliderRef = useRef<AppIntroSlider<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    posthog.capture("tutorial_started");
  }, []);

  const slides: Slide[] = [
    {
      image: images.slide1,
    },
    {
      image: images.slide2,
    },
    {
      image: images.slide3,
    },
    { image: images.slide4 },
    { image: images.slide5 },
    { image: images.slide6 },
    { image: images.slide7 },
  ];

  const goBack = () => {
    if (currentIndex > 0) {
      sliderRef.current?.goToSlide(currentIndex - 1, true);
    }
  };
  const goNext = () => {
    sliderRef.current?.goToSlide(currentIndex + 1, true);
  };
  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <LinearGradient
        colors={["#ffffff", "#d8d8d8"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.slide}
      >
        <ImageBackground
          source={item.image}
          style={styles.background}
          resizeMode="contain"
        />
      </LinearGradient>
    );
  };

  const renderNextButton = () => (
    // <View style={styles.button}>
    //   <Text style={styles.buttonText}>Next</Text>
    // </View>
    <AppButton
      type="text"
      style={{ paddingHorizontal: 22, paddingVertical: 10 }}
      onPress={goNext}
      label="Next"
    ></AppButton>
  );

  const renderDoneButton = () => (
    <AppButton
      type="text"
      style={{ paddingHorizontal: 22, paddingVertical: 10 }}
      onPress={async () => {
        await userRepo.completeTutorial();
        posthog.capture("tutorial_completed", { completion_method: "done" });
        router.navigate("/pages");
      }}
      label="Done"
    ></AppButton>
  );

  const renderPrevButton = () => (
    <AppButton
      type="text"
      style={{ paddingHorizontal: 22, paddingVertical: 10 }}
      onPress={goBack}
      label="Back"
    ></AppButton>
  );

  const renderSkipButton = () => (
    <AppButton
      type="text"
      style={styles.skipButton}
      onPress={async () => {
        await userRepo.completeTutorial();
        posthog.capture("tutorial_completed", {
          completion_method: "skipped",
          skipped_at_step: currentIndex + 1,
        });
        router.navigate("/pages");
      }}
      label="Skip"
    ></AppButton>
  );

  return (
    <View style={{ flex: 1 }}>
      {renderSkipButton()}
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderPrevButton={renderPrevButton}
        showPrevButton
        onSlideChange={(index) => {
          setCurrentIndex(index);
          posthog.capture("tutorial_step_viewed", {
            step: index + 1,
            total_steps: slides.length,
          });
        }}
        activeDotStyle={styles.activeDot}
        dotStyle={styles.dot}
      />
    </View>
  );
};

export default TutorialPage;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  button: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  skipButton: {
    position: "absolute",
    top: 10,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  activeDot: {
    backgroundColor: "white",
  },
});
