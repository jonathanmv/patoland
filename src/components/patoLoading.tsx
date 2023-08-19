import { Player } from "@lottiefiles/react-lottie-player";

export default function PatoLoading() {
  return (
    <div className="container mx-auto mt-12 max-w-xs">
      <Player
        autoplay
        loop
        src="/pato-lottie.json"
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
}
