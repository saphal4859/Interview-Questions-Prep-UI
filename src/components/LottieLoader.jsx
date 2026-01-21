import Lottie from "lottie-react";
import dogWalking from "../assets/svg/dog-walking.json";

export default function LottieLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <Lottie
        animationData={dogWalking}
        loop
        autoplay
        style={{ width: 260, height: 260 }}
      />
    </div>
  );
}