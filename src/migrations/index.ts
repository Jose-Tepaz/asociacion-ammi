import * as migration_20261103_195254_inicial from './20261103_195254_inicial';

export const migrations = [
  {
    up: migration_20261103_195254_inicial.up,
    down: migration_20261103_195254_inicial.down,
    name: '20261103_195254_inicial'
  },
];
