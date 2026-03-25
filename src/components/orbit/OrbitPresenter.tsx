import type {
  PresenterPoseKey,
  ResolvedPresenterAssets,
} from "./orbit.types";
import { ORBIT_SETTINGS } from "./orbit.constants";

type OrbitPresenterProps = {
  presenterAssets: ResolvedPresenterAssets;
  activePose: PresenterPoseKey;
  alt?: string;
  variant?: "inner" | "home";
};

const ORDER: PresenterPoseKey[] = [
  "front",
  "upRight",
  "right",
  "downRight",
  "downLeft",
  "left",
  "upLeft",
];

export default function OrbitPresenter({
  presenterAssets,
  activePose,
  alt = "המגיש",
}: OrbitPresenterProps) {
  return (
    <div className="absolute left-1/2 top-1/2 z-[12] -translate-x-1/2 -translate-y-1/2">
      <div className="orbit-avatar-wrap orbit-avatar-float relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.62),rgba(0,0,0,0.10)_72%,transparent)]" />
        <div className="absolute bottom-4 h-20 w-44 rounded-full bg-primary/16 blur-3xl md:h-24 md:w-56" />

        {ORDER.map((key) => (
          <img
            key={key}
            src={presenterAssets[key]}
            alt={alt}
            className="absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition-opacity"
            style={{
              opacity: activePose === key ? 1 : 0,
              transitionDuration: `${ORBIT_SETTINGS.avatarSwitchMs}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
