import * as migration_20261103_195254_inicial from './20261103_195254_inicial';
import * as migration_20261103_211337_almacenamiento_blob from './20261103_211337_almacenamiento_blob';
import * as migration_20261104_180000_portada_corinto from './20261104_180000_portada_corinto';

export const migrations = [
  {
    up: migration_20261103_195254_inicial.up,
    down: migration_20261103_195254_inicial.down,
    name: '20261103_195254_inicial',
  },
  {
    up: migration_20261103_211337_almacenamiento_blob.up,
    down: migration_20261103_211337_almacenamiento_blob.down,
    name: '20261103_211337_almacenamiento_blob'
  },
  {
    up: migration_20261104_180000_portada_corinto.up,
    down: migration_20261104_180000_portada_corinto.down,
    name: '20261104_180000_portada_corinto',
  },
];
