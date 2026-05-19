import assert from "node:assert/strict";

function numeric(value, label) {
  const parsed = Number(value);
  if (value === "" || value === null || value === undefined || !Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} invalido`);
  }
  return parsed;
}

function assertClose(actual, expected, message) {
  assert.ok(Math.abs(actual - expected) < 0.0001, `${message}: esperado ${expected}, obtido ${actual}`);
}

function mgToMcg(mg) {
  return numeric(mg, "mg") * 1000;
}

function concentrationMcgMl(drugAmountMg, finalVolumeMl) {
  return mgToMcg(drugAmountMg) / numeric(finalVolumeMl, "volume final");
}

function doseToRate({ doseMcgKgMin, weightKg, concentrationMcgMl }) {
  const dose = numeric(doseMcgKgMin, "dose");
  const weight = numeric(weightKg, "peso");
  const concentration = numeric(concentrationMcgMl, "concentracao");
  return (dose * weight * 60) / concentration;
}

function rateToDose({ rateMlH, weightKg, concentrationMcgMl }) {
  const rate = numeric(rateMlH, "vazao");
  const weight = numeric(weightKg, "peso");
  const concentration = numeric(concentrationMcgMl, "concentracao");
  return (rate * concentration) / (weight * 60);
}

function pbwMale(heightCm) {
  return 50 + 0.91 * (numeric(heightCm, "altura") - 152.4);
}

function pbwFemale(heightCm) {
  return 45.5 + 0.91 * (numeric(heightCm, "altura") - 152.4);
}

function tidalVolumes(pbwKg) {
  const pbw = numeric(pbwKg, "PBW");
  return {
    vt4: pbw * 4,
    vt6: pbw * 6,
    vt8: pbw * 8
  };
}

function activeInputMode({ dose, rate }) {
  const hasDose = String(dose ?? "").trim().length > 0;
  const hasRate = String(rate ?? "").trim().length > 0;

  if (hasDose && hasRate) {
    throw new Error("dose e vazao nao podem ser entradas simultaneas");
  }

  if (hasDose) {
    return "dose";
  }

  if (hasRate) {
    return "rate";
  }

  return "empty";
}

assertClose(concentrationMcgMl(16, 250), 64, "concentracao final");
assert.equal(mgToMcg(16), 16000, "conversao mg para mcg");

const rate = doseToRate({ doseMcgKgMin: 0.1, weightKg: 70, concentrationMcgMl: 64 });
assertClose(rate, 6.5625, "dose para vazao");
assertClose(rateToDose({ rateMlH: rate, weightKg: 70, concentrationMcgMl: 64 }), 0.1, "vazao para dose");

assertClose(pbwMale(170), 66.016, "PBW masculino");
assertClose(pbwFemale(170), 61.516, "PBW feminino");

const volumes = tidalVolumes(pbwMale(170));
assertClose(volumes.vt4, 264.064, "volume corrente 4 mL/kg");
assertClose(volumes.vt6, 396.096, "volume corrente 6 mL/kg");
assertClose(volumes.vt8, 528.128, "volume corrente 8 mL/kg");

assert.equal(activeInputMode({ dose: "0.1", rate: "" }), "dose", "modo dose");
assert.equal(activeInputMode({ dose: "", rate: "6.5" }), "rate", "modo vazao");
assert.equal(activeInputMode({ dose: "", rate: "" }), "empty", "modo vazio");
assert.throws(() => activeInputMode({ dose: "0.1", rate: "6.5" }), /simultaneas/, "bloqueio dose/vazao");
assert.throws(() => doseToRate({ doseMcgKgMin: "", weightKg: 70, concentrationMcgMl: 64 }), /dose invalido/);
assert.throws(() => doseToRate({ doseMcgKgMin: 0.1, weightKg: -1, concentrationMcgMl: 64 }), /peso invalido/);

console.log("Testes minimos de calculadoras aprovados.");
