// Define the static list of buffs for SC2.
const Enum = require('python-enum')

const Buffs = Enum.IntEnum('Buffs', {
  // The list of buffs, as generated by bin/gen_data.py.
  BansheeCloak: 7,
  BlindingCloud: 83,
  BlindingCloudStructure: 38,
  CarryHarvestableVespeneGeyserGas: 273,
  CarryHarvestableVespeneGeyserGasProtoss: 274,
  CarryHarvestableVespeneGeyserGasZerg: 275,
  CarryHighYieldMineralFieldMinerals: 272,
  CarryMineralFieldMinerals: 271,
  ChannelSnipeCombat: 145,
  Charging: 30,
  ChronoBoostEnergyCost: 281,
  CloakFieldEffect: 29,
  Contaminated: 36,
  EMPDecloak: 16,
  FungalGrowth: 17,
  GhostCloak: 6,
  GhostHoldFire: 12,
  GhostHoldFireB: 13,
  GravitonBeam: 5,
  GuardianShield: 18,
  ImmortalOverload: 102,
  InhibitorZoneTemporalField: 289,
  LockOn: 116,
  LurkerHoldFire: 136,
  LurkerHoldFireB: 137,
  MedivacSpeedBoost: 89,
  NeuralParasite: 22,
  OracleRevelation: 49,
  OracleStasisTrapTarget: 129,
  OracleWeapon: 99,
  ParasiticBomb: 132,
  ParasiticBombSecondaryUnitSearch: 134,
  ParasiticBombUnitKU: 133,
  PowerUserWarpable: 8,
  PsiStorm: 28,
  QueenSpawnLarvaTimer: 11,
  RavenScramblerMissile: 277,
  RavenShredderMissileArmorReduction: 280,
  RavenShredderMissileTint: 279,
  Slow: 33,
  Stimpack: 27,
  StimpackMarauder: 24,
  SupplyDrop: 25,
  TemporalField: 121,
  ViperConsumeStructure: 59,
  VoidRaySpeedUpgrade: 288,
})

module.exports = { Buffs }
