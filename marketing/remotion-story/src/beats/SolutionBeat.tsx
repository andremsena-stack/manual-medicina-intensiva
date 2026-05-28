import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { PhoneFrame } from "../components/PhoneFrame";
import { modules } from "../modules";
import { beatColors, fontStack, palette } from "../theme";
import type { CalcScenario, SolutionBeat as SolutionBeatT } from "../types";

interface Props {
  payload: SolutionBeatT["payload"];
}

// Solution: dois modos.
//   - module-grid: cards do app entrando em cascata + cursor avança até o destaque.
//   - calculator-demo: tela de uma calculadora real com slider/valor animando.
//     Cenário escolhido via payload.calcScenario:
//       'noradrenalina' (Mod 5), 'iot-rsi' (Mod 1), 'reposicao-sodio' (Mod 6).
export const SolutionBeat: React.FC<Props> = ({ payload }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.solution;

  // Layout sempre desenhado no palco-base (1080x1920). A composicao
  // StoryVideo cuida do scale pra qualquer aspect ratio.
  const phoneWidth = 620;
  const titleSize = 68;
  const subtitleSize = 30;

  return (
    <AbsoluteFill style={{ fontFamily: fontStack, color: c.text }}>
      <Backdrop from={c.bgFrom} to={c.bgTo} accent={c.accent} />

      <AbsoluteFill
        style={{
          padding: "100px 70px 60px",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            opacity: spring({ frame, fps, config: { damping: 16 } }),
            textAlign: "center",
            maxWidth: 920,
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: c.accent,
              marginBottom: 18,
            }}
          >
            Manual Virtus
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {payload.title}
          </div>
          {payload.subtitle ? (
            <div
              style={{
                fontSize: subtitleSize,
                fontWeight: 500,
                color: palette.whiteDim,
                marginTop: 14,
              }}
            >
              {payload.subtitle}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 56 }}>
          {payload.mode === "module-grid" ? (
            <ModuleGridDemo
              highlightId={payload.highlightModuleId}
              width={phoneWidth}
            />
          ) : (
            <CalculatorDemo
              width={phoneWidth}
              scenario={payload.calcScenario ?? "noradrenalina"}
            />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Module grid demo ----------

const ModuleGridDemo: React.FC<{ highlightId?: number; width?: number }> = ({
  highlightId,
  width = 620,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = beatColors.solution;
  const k = width / 620; // fator de escala em relacao ao layout base

  return (
    <PhoneFrame width={width}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(170deg, #0a1d2e 0%, #0d2438 55%, #123c69 100%)",
          padding: `${70 * k}px ${26 * k}px ${26 * k}px`,
          color: palette.white,
        }}
      >
        <div
          style={{
            fontSize: 14 * k,
            letterSpacing: 3,
            color: palette.cyanBright,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Início
        </div>
        <div
          style={{
            fontSize: 30 * k,
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: 6 * k,
            marginBottom: 22 * k,
          }}
        >
          Módulos clínicos
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12 * k,
          }}
        >
          {modules.map((m, i) => {
            const start = 6 + i * 5;
            const enter = spring({
              frame: frame - start,
              fps,
              config: { damping: 14 },
            });
            const isHighlight = highlightId === m.id;
            const highlightPulse = isHighlight
              ? 1 + Math.sin((frame - 60) / 5) * 0.04
              : 1;
            const familyColor =
              m.family === "calc"
                ? palette.amber
                : m.family === "ref"
                ? "#a78bfa"
                : palette.cyanBright;

            return (
              <div
                key={m.id}
                style={{
                  opacity: enter,
                  transform: `translateY(${(1 - enter) * 22}px) scale(${
                    enter * 0.04 + 0.96
                  }) scale(${highlightPulse})`,
                  background: isHighlight
                    ? `linear-gradient(160deg, ${palette.cyan}30, ${palette.cyanBright}10)`
                    : "rgba(255,255,255,0.04)",
                  border: isHighlight
                    ? `1.5px solid ${palette.cyanBright}`
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16 * k,
                  padding: 16 * k,
                  minHeight: 132 * k,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isHighlight
                    ? `0 0 ${24 * k}px ${palette.cyanBright}55`
                    : undefined,
                }}
              >
                <div style={{ width: 34 * k, height: 34 * k, color: familyColor }}>
                  {m.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10 * k,
                      letterSpacing: 2,
                      color: palette.whiteFaint,
                      fontWeight: 600,
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: 16 * k,
                      fontWeight: 700,
                      lineHeight: 1.15,
                      marginTop: 4 * k,
                    }}
                  >
                    {m.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cursor que desce ate o modulo destacado */}
        {highlightId ? <Cursor toModuleId={highlightId} k={k} /> : null}
      </div>
    </PhoneFrame>
  );
};

const Cursor: React.FC<{ toModuleId: number; k: number }> = ({
  toModuleId,
  k,
}) => {
  const frame = useCurrentFrame();
  const idx = toModuleId - 1;
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  const targetX = (50 + col * 264) * k;
  const targetY = (200 + row * 144) * k;
  const startX = 240 * k;
  const startY = 80 * k;

  const x = interpolate(frame, [12, 70], [startX, targetX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [12, 70], [startY, targetY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tap = interpolate(frame, [72, 80], [1, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tapFade = interpolate(frame, [72, 95], [0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 56 * k,
          height: 56 * k,
          borderRadius: "50%",
          background: "rgba(48,241,230,0.95)",
          boxShadow: `0 0 ${24 * k}px rgba(48,241,230,0.65)`,
          border: "2px solid rgba(255,255,255,0.95)",
          transform: `translate(-50%, -50%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 60 * k,
          height: 60 * k,
          borderRadius: "50%",
          background: "transparent",
          border: "3px solid rgba(48,241,230,1)",
          transform: `translate(-50%, -50%) scale(${tap})`,
          opacity: tapFade,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// ---------- Calculator demo (multi-cenário) ----------

const CalculatorDemo: React.FC<{
  width?: number;
  scenario: CalcScenario;
}> = ({ width = 620, scenario }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = width / 620;
  // Conteúdo desenhado no tamanho base e escalado pra qualquer largura de phone.
  const baseW = 620 - 24;
  const baseH = (baseW * 19.5) / 9;
  const enter = spring({ frame, fps, config: { damping: 16 } });

  return (
    <PhoneFrame width={width}>
      <div
        style={{
          width: baseW,
          height: baseH,
          transform: `scale(${k})`,
          transformOrigin: "top left",
          background:
            "linear-gradient(170deg, #0a1d2e 0%, #0d2438 55%, #123c69 100%)",
          padding: "70px 22px 22px",
          color: palette.white,
          opacity: enter,
        }}
      >
        {scenario === "noradrenalina" ? (
          <NoradrenalinaScreen />
        ) : scenario === "iot-rsi" ? (
          <IotRsiScreen />
        ) : (
          <ReposicaoSodioScreen />
        )}
      </div>
    </PhoneFrame>
  );
};

// ---- Header reutilizável ----

const CalcHeader: React.FC<{
  modulo: string;
  titulo: string;
  subtitulo: string;
}> = ({ modulo, titulo, subtitulo }) => (
  <>
    <div
      style={{
        fontSize: 12,
        letterSpacing: 3,
        color: palette.cyanBright,
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {modulo}
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 800,
        lineHeight: 1.1,
        marginTop: 6,
      }}
    >
      {titulo}
    </div>
    <div
      style={{
        fontSize: 14,
        color: palette.whiteDim,
        marginBottom: 18,
      }}
    >
      {subtitulo}
    </div>
  </>
);

// ---- Resultado em destaque (cartão cyan) ----

const ResultCard: React.FC<{
  label: string;
  value: string;
  unit: string;
  footnote?: string;
}> = ({ label, value, unit, footnote }) => (
  <>
    <div
      style={{
        marginTop: 28,
        padding: 22,
        borderRadius: 18,
        background: `linear-gradient(160deg, ${palette.cyanBright}1a, ${palette.cyan}10)`,
        border: `1.5px solid ${palette.cyanBright}88`,
        boxShadow: `0 0 30px ${palette.cyanBright}33`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 2,
          color: palette.cyanBright,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          marginTop: 4,
          letterSpacing: -1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        <span
          style={{
            fontSize: 22,
            color: palette.whiteDim,
            marginLeft: 8,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
    {footnote ? (
      <div
        style={{
          marginTop: 14,
          fontSize: 11,
          color: palette.whiteFaint,
          lineHeight: 1.4,
        }}
      >
        {footnote}
      </div>
    ) : null}
  </>
);

// ---- Cenário 1: Noradrenalina (Mod 5) ----

const NoradrenalinaScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const peso = 72;
  const concentracao = 0.064; // mcg/mL na bag
  const targetDose = interpolate(frame, [10, 70], [0.05, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ml = (targetDose * peso * 60) / (concentracao * 1000);

  return (
    <>
      <CalcHeader
        modulo="Módulo 5 / Vasoativos"
        titulo="Noradrenalina"
        subtitulo="Bomba de infusão contínua"
      />
      <Field label="Peso" value={`${peso} kg`} />
      <Field
        label="Concentração"
        value={`${(concentracao * 1000).toFixed(0)} mcg/mL`}
      />

      {/* Slider de dose alvo */}
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontSize: 14,
            color: palette.whiteDim,
          }}
        >
          <span>Dose alvo</span>
          <span
            style={{
              color: palette.cyanBright,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {targetDose.toFixed(2)} mcg/kg/min
          </span>
        </div>
        <Slider
          progress={(targetDose - 0.05) / 0.25}
        />
      </div>

      <ResultCard
        label="Vazão da bomba"
        value={ml.toFixed(1)}
        unit="mL/h"
        footnote="Cálculo validado. Revisar protocolo institucional antes de programar a bomba."
      />
    </>
  );
};

// ---- Cenário 2: Sequência rápida de intubação (Mod 1) ----
// Mostra cálculo simultâneo de 3 fármacos da SRI por peso.

const IotRsiScreen: React.FC = () => {
  const frame = useCurrentFrame();
  // Peso anima de 60 → 90 kg, doses recalculam em tempo real.
  const peso = interpolate(frame, [10, 65], [60, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fármacos da sequência rápida (RSI):
  //   Etomidato      0,3 mg/kg · concentração 2 mg/mL
  //   Fentanil       3 mcg/kg  · concentração 50 mcg/mL
  //   Succinilcolina 1,5 mg/kg · concentração 20 mg/mL
  const etoMg = 0.3 * peso;
  const etoMl = etoMg / 2;
  const fenMcg = 3 * peso;
  const fenMl = fenMcg / 50;
  const sucMg = 1.5 * peso;
  const sucMl = sucMg / 20;

  return (
    <>
      <CalcHeader
        modulo="Módulo 1 / IOT"
        titulo="Sequência rápida"
        subtitulo="Doses por peso, prontas para puxar"
      />

      <Field label="Peso" value={`${peso.toFixed(0)} kg`} />

      {/* Slider de peso */}
      <div style={{ marginTop: 4, marginBottom: 16 }}>
        <Slider progress={(peso - 60) / 30} />
      </div>

      {/* Lista de fármacos com dose e volume */}
      <DrugRow
        nome="Etomidato"
        dose={`${etoMg.toFixed(1)} mg`}
        volume={`${etoMl.toFixed(1)} mL`}
        regra="0,3 mg/kg"
      />
      <DrugRow
        nome="Fentanil"
        dose={`${fenMcg.toFixed(0)} mcg`}
        volume={`${fenMl.toFixed(1)} mL`}
        regra="3 mcg/kg"
      />
      <DrugRow
        nome="Succinilcolina"
        dose={`${sucMg.toFixed(1)} mg`}
        volume={`${sucMl.toFixed(1)} mL`}
        regra="1,5 mg/kg"
      />

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 14,
          background: `linear-gradient(160deg, ${palette.cyanBright}1a, ${palette.cyan}10)`,
          border: `1.5px solid ${palette.cyanBright}88`,
          fontSize: 12,
          color: palette.whiteDim,
          lineHeight: 1.45,
        }}
      >
        Pronto para puxar. Revise alergias, hemodinâmica e contraindicações
        antes de administrar.
      </div>
    </>
  );
};

// ---- Cenário 3: Reposição de sódio (Mod 6) ----
// Hiponatremia → NaCl 3 % por Adrogue-Madias.

const ReposicaoSodioScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const peso = 70;
  const naAtual = 122;
  // Meta de elevação em 24 h: anima de 4 → 8 mEq/L.
  const metaSubida = interpolate(frame, [10, 65], [4, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Adrogue-Madias para NaCl 3 % (513 mEq/L):
  //   ΔNa⁺ por L = (Na infundido − Na sérico) / (ACT + 1)
  const act = 0.6 * peso; // homem
  const deltaPorL = (513 - naAtual) / (act + 1);
  const litros = metaSubida / deltaPorL;
  const vazao = (litros * 1000) / 24; // mL/h

  return (
    <>
      <CalcHeader
        modulo="Módulo 6 / Sódio"
        titulo="Reposição de Na⁺"
        subtitulo="Hiponatremia — NaCl 3 % por Adrogue-Madias"
      />

      <Field label="Peso" value={`${peso} kg`} />
      <Field label="Na⁺ atual" value={`${naAtual} mEq/L`} />

      {/* Slider de meta de elevação */}
      <div style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
            fontSize: 14,
            color: palette.whiteDim,
          }}
        >
          <span>Meta em 24 h</span>
          <span
            style={{
              color: palette.cyanBright,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{metaSubida.toFixed(1)} mEq/L
          </span>
        </div>
        <Slider progress={(metaSubida - 4) / 4} />
      </div>

      <ResultCard
        label="Vazão de NaCl 3 %"
        value={vazao.toFixed(0)}
        unit="mL/h"
        footnote={`Volume estimado em 24 h: ${(litros * 1000).toFixed(
          0,
        )} mL. Limite seguro: 8 mEq/L em 24 h.`}
      />
    </>
  );
};

// ---- Linha de fármaco (usada na sequência de IOT) ----

const DrugRow: React.FC<{
  nome: string;
  dose: string;
  volume: string;
  regra: string;
}> = ({ nome, dose, volume, regra }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 8,
    }}
  >
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, color: palette.white }}>
        {nome}
      </div>
      <div style={{ fontSize: 11, color: palette.whiteFaint, marginTop: 2 }}>
        {regra}
      </div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: palette.cyanBright,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {dose}
      </div>
      <div
        style={{
          fontSize: 12,
          color: palette.whiteDim,
          marginTop: 2,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {volume}
      </div>
    </div>
  </div>
);

// ---- Slider visual reutilizável ----

const Slider: React.FC<{ progress: number }> = ({ progress }) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div
      style={{
        position: "relative",
        height: 8,
        borderRadius: 4,
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${palette.cyan}, ${palette.cyanBright})`,
          borderRadius: 4,
          boxShadow: `0 0 14px ${palette.cyanBright}88`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${p * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: palette.white,
          boxShadow: `0 0 0 4px ${palette.cyanBright}55`,
        }}
      />
    </div>
  );
};

const Field: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      marginBottom: 10,
      fontSize: 16,
    }}
  >
    <span style={{ color: palette.whiteDim }}>{label}</span>
    <span style={{ fontWeight: 700, color: palette.white }}>{value}</span>
  </div>
);
