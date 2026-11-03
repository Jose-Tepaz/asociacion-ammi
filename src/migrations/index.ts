import * as migration_20261103_195254_inicial from './20261103_195254_inicial';
import * as migration_20261103_211337_almacenamiento_blob from './20261103_211337_almacenamiento_blob';

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
];
