import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { VirtusMark } from "../components/VirtusMark";
import { beatColors, fontStack, palette } from "../theme";
import type { CtaBeat as CtaBeatT } from "../types";

interface Props {
  payload: CtaBeatT["payload"];
}

// CTA: botao pulsante + preco + handle no rodape.
export const CtaBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.cta;

  const mark = spring({ frame, fps, config: { damping: 14 } });
  const headline = spring({ frame: frame - 6, fps, config: { damping: 16 } });
  const price = spring({ frame: frame - 16, fps, config: { damping: 18 } });
  const btnAppear = spring({
    frame: frame - 28,
    fps,
    config: { damping: 16 },
  });
  const btnPulse = 1 + Math.sin((frame - 40) / 5) * 0.025;

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      {/* Aro luminoso de fundo */}
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            width: 1100,
            height: 1100,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c.accent}26 0%, transparent 60%)`,
            opacity: interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          padding: "120px 80px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: mark,
            transform: `scale(${mark})`,
          }}
        >
          <VirtusMark size={140} />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              opacity: headline,
              transform: `translateY(${(1 - headline) * 22}px)`,
              maxWidth: 880,
            }}
          >
            {payload.headline}
          </div>

          {/* Modo novo: 3 tiers de assinatura lado-a-lado */}
          {payload.tiers && payload.tiers.length > 0 ? (
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 16,
                justifyContent: "center",
                opacity: price,
                transform: `translateY(${(1 - price) * 16}px)`,
              }}
            >
              {payload.tiers.map((tier, i) => {
                const tierIn = Math.max(
                  0,
                  Math.min(1, (frame - (18 + i * 6)) / 14)
                );
                return (
                  <div
                    key={tier.label}
                    style={{
                      opacity: tierIn,
                      transform: `translateY(${(1 - tierIn) * 24}px) scale(${
                        tier.highlight ? 1.04 : 1
                      })`,
                      width: 230,
                      padding: "24px 18px",
                      borderRadius: 22,
                      background: tier.highlight
                        ? `linear-gradient(160deg, ${palette.cyan}30, ${palette.cyanBright}10)`
                        : "rgba(255,255,255,0.04)",
                      border: tier.highlight
                        ? `2px solid ${palette.cyanBright}`
                        : "1.5px solid rgba(255,255,255,0.1)",
                      boxShadow: tier.highlight
                        ? `0 0 30px ${palette.cyanBright}55`
                        : undefined,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: tier.highlight
                          ? palette.cyanBright
                          : palette.whiteDim,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {tier.label}
                    </div>
                    <div
                      style={{
                        fontSize: 44,
                        fontWeight: 900,
                        lineHeight: 1,
                        color: palette.white,
                        letterSpacing: -1,
                      }}
                    >
                      {tier.price}
                    </div>
                    {tier.caption ? (
                      <div
                        style={{
                          fontSize: 16,
                          color: palette.whiteFaint,
                          marginTop: 8,
                          lineHeight: 1.3,
                        }}
                      >
                        {tier.caption}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Modo legado: preco unico (caso `tiers` nao tenha sido fornecido) */}
          {payload.price && !payload.tiers ? (
            <div
              style={{
                marginTop: 36,
                opacity: price,
                transform: `translateY(${(1 - price) * 16}px)`,
              }}
            >
              {payload.priceCaption ? (
                <div
                  style={{
                    fontSize: 22,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: c.accent,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {payload.priceCaption}
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  gap: 12,
                  lineHeight: 1,
                }}
              >
                <div
                  style={{
                    fontSize: 130,
                    fontWeight: 900,
                    letterSpacing: -3,
                    color: palette.white,
                    textShadow: `0 0 30px ${c.accent}55`,
                    lineHeight: 1,
                  }}
                >
                  {payload.price}
                </div>
                {payload.pricePeriod ? (
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 600,
                      color: palette.whiteDim,
                      letterSpacing: -0.5,
                    }}
                  >
                    {payload.pricePeriod}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            opacity: btnAppear,
            transform: `translateY(${(1 - btnAppear) * 28}px) scale(${btnPulse})`,
            background: `linear-gradient(135deg, ${palette.cyanBright}, ${palette.cyan})`,
            color: palette.inkDeep,
            fontSize: 42,
            fontWeight: 800,
            padding: "26px 64px",
            borderRadius: 999,
            boxShadow: `0 18px 40px ${c.accent}55, 0 0 0 6px rgba(48,241,230,0.12)`,
            letterSpacing: 0.5,
          }}
        >
          {payload.button}
        </div>

        {payload.handle ? (
          <div
            style={{
              fontSize: 26,
              color: palette.whiteDim,
              marginTop: 12,
              letterSpacing: 1,
            }}
          >
            {payload.handle}
          </div>
        ) : (
          <div style={{ height: 0 }} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
