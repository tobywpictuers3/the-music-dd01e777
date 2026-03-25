import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import OrbitTopicButton from "./OrbitTopicButton";
import OrbitPresenter from "./OrbitPresenter";
import {
  ORBIT_SETTINGS,
} from "./orbit.constants";
import {
  angleFromTopClockwise,
  buildResolvedPresenterAssets,
  preloadImages,
  resolveAssetByAngle,
} from "./orbit.utils";
import type {
  OrbitItem,
  OrbitVariant,
  PresenterPoseKey,
  PresenterAssets,
} from "./orbit.types";

type CircleOrbitProps = {
  items: OrbitItem[];
  presenterAssets: PresenterAssets;
  onItemClick?: (item: OrbitItem) => void;
  selectedId?: string | null;
  className?: string;
  presenterAlt?: string;
  center?: ReactNode;
  variant?: OrbitVariant;
  lightTextureSrc?: string;
  darkTextureSrc?: string;
};

export default function CircleOrbit({
  items,
  presenterAssets,
  onItemClick,
  selectedId = null,
  className = "",
  presenterAlt = "המגיש",
  center,
  variant = "inner",
  lightTextureSrc,
  darkTextureSrc,
}: CircleOrbitProps) {
  const orbitZoneRef = useRef<HTMLDivElement | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activePose, setActivePose] = useState<PresenterPoseKey>("front");

  const resolvedAssets = useMemo(
    () => buildResolvedPresenterAssets(presenterAssets),
    [presenterAssets]
  );

  const settings = ORBIT_SETTINGS.sizeByVariant[variant];
  const assetsToPreload = useMemo(
    () => Array.from(new Set(Object.values(resolvedAssets))),
    [resolvedAssets]
  );

  useEffect(() => {
    preloadImages(assetsToPreload);
  }, [assetsToPreload]);

  function setFrontDefault() {
    setHoveredId(null);
    setActivePose("front");
  }

  function updateAvatarFromAnchor(buttonEl: HTMLElement) {
    const zoneEl = orbitZoneRef.current;
    const plusEl = buttonEl.querySelector<HTMLElement>('[data-plus-anchor="true"]');

    if (!zoneEl || !plusEl) {
      setActivePose("front");
      return;
    }

    const zoneRect = zoneEl.getBoundingClientRect();
    const plusRect = plusEl.getBoundingClientRect();

    const centerX = zoneRect.left + zoneRect.width / 2;
    const centerY = zoneRect.top + zoneRect.height / 2;

    const plusX = plusRect.left + plusRect.width / 2;
    const plusY = plusRect.top + plusRect.height / 2;

    const dx = plusX - centerX;
    const dy = plusY - centerY;

    const angle = angleFromTopClockwise(dx, dy);
    const { pose } = resolveAssetByAngle(angle, resolvedAssets);

    setActivePose(pose);
  }

  function handleOrbitEnter(
    e: ReactMouseEvent<HTMLButtonElement>,
    itemId: string
  ) {
    setHoveredId(itemId);

    const buttonEl = e.currentTarget;
    requestAnimationFrame(() => {
      updateAvatarFromAnchor(buttonEl);
    });
  }

  return (
    <>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitCounterSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes orbitAvatarFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .orbit-zone {
          position: relative;
          width: 100%;
          max-width: ${settings.zoneMaxWidth}px;
          height: ${settings.zoneHeight.base}px;
          --orbit-radius: ${settings.radius.base}px;
          --orbit-size: ${settings.itemSize.base}px;
        }

        .orbit-avatar-wrap {
          width: ${settings.avatarSize.base}px;
          height: ${settings.avatarSize.base}px;
        }

        @media (min-width: 768px) {
          .orbit-zone {
            height: ${settings.zoneHeight.md}px;
            --orbit-radius: ${settings.radius.md}px;
            --orbit-size: ${settings.itemSize.md}px;
          }

          .orbit-avatar-wrap {
            width: ${settings.avatarSize.md}px;
            height: ${settings.avatarSize.md}px;
          }
        }

        @media (min-width: 1024px) {
          .orbit-zone {
            height: ${settings.zoneHeight.lg}px;
            --orbit-radius: ${settings.radius.lg}px;
            --orbit-size: ${settings.itemSize.lg}px;
          }

          .orbit-avatar-wrap {
            width: ${settings.avatarSize.lg}px;
            height: ${settings.avatarSize.lg}px;
          }
        }

        .orbit-spin {
          animation: orbitSpin ${settings.spinSeconds}s linear infinite;
          transform-origin: center center;
        }

        .orbit-counter-spin {
          animation: orbitCounterSpin ${settings.spinSeconds}s linear infinite;
          transform-origin: center center;
        }

        .orbit-zone:hover .orbit-spin,
        .orbit-zone:hover .orbit-counter-spin,
        .orbit-zone:focus-within .orbit-spin,
        .orbit-zone:focus-within .orbit-counter-spin {
          animation-play-state: paused;
        }

        .orbit-avatar-float {
          animation: orbitAvatarFloat ${ORBIT_SETTINGS.avatarFloatSeconds}s ease-in-out infinite;
        }
      `}</style>

      <div
        ref={orbitZoneRef}
        className={`orbit-zone mx-auto ${className}`}
        onMouseLeave={setFrontDefault}
        onMouseMove={(e) => {
          const target = e.target as HTMLElement;
          const insideButton = target.closest('[data-orbit-button="true"]');

          if (!insideButton && activePose !== "front") {
            setFrontDefault();
          }
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10),rgba(0,0,0,0)_72%)] md:h-[500px] md:w-[500px] lg:h-[620px] lg:w-[620px]" />
          <div className="absolute left-1/2 top-1/2 h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(128,0,32,0.08),rgba(0,0,0,0)_72%)] md:h-[170px] md:w-[170px] lg:h-[210px] lg:w-[210px]" />
        </div>

        <div className="orbit-spin absolute inset-0">
          {items.map((item) => {
            const isActive = hoveredId === item.id || selectedId === item.id;

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${item.angle}deg) translateY(calc(var(--orbit-radius) * -1))`,
                }}
              >
                <div className="orbit-counter-spin">
                  <div style={{ transform: `rotate(${-item.angle}deg)` }}>
                    <OrbitTopicButton
                      item={item}
                      isActive={isActive}
                      onEnter={(e) => handleOrbitEnter(e as any, item.id)}
                      onClick={() => onItemClick?.(item)}
                      lightTextureSrc={lightTextureSrc}
                      darkTextureSrc={darkTextureSrc}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {center ? (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[8] -translate-x-1/2 -translate-y-1/2 opacity-85">
            {center}
          </div>
        ) : null}

        <OrbitPresenter
          presenterAssets={resolvedAssets}
          activePose={activePose}
          alt={presenterAlt}
          variant={variant}
        />
      </div>
    </>
  );
}
