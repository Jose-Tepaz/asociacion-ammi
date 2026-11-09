import * as migration_20261103_195254_inicial from './20261103_195254_inicial';
import * as migration_20261103_211337_almacenamiento_blob from './20261103_211337_almacenamiento_blob';
import * as migration_20261104_180000_portada_corinto from './20261104_180000_portada_corinto';
import * as migration_20261105_140000_quienes_somos from './20261105_140000_quienes_somos';
import * as migration_20261106_120000_frase_pueblos from './20261106_120000_frase_pueblos';
import * as migration_20261105_120000_logo_encabezado from './20261105_120000_logo_encabezado';
import * as migration_20261105_130000_logo_pie from './20261105_130000_logo_pie';

export const migrations = [
  {
    up: migration_20261103_195254_inicial.up,
    down: migration_20261103_195254_inicial.down,
    name: '20261103_195254_inicial',
  },
  {
    up: migration_20261103_211337_almacenamiento_blob.up,
    down: migration_20261103_211337_almacenamiento_blob.down,
    name: '20261103_211337_almacenamiento_blob',
  },
  {
    up: migration_20261104_180000_portada_corinto.up,
    down: migration_20261104_180000_portada_corinto.down,
    name: '20261104_180000_portada_corinto',
  },
  {
    up: migration_20261105_140000_quienes_somos.up,
    down: migration_20261105_140000_quienes_somos.down,
    name: '20261105_140000_quienes_somos',
  },
  {
    up: migration_20261105_120000_logo_encabezado.up,
    down: migration_20261105_120000_logo_encabezado.down,
    name: '20261105_120000_logo_encabezado',
  },
  {
    up: migration_20261105_130000_logo_pie.up,
    down: migration_20261105_130000_logo_pie.down,
    name: '20261105_130000_logo_pie'
  },
  {
    up: migration_20261106_120000_frase_pueblos.up,
    down: migration_20261106_120000_frase_pueblos.down,
    name: '20261106_120000_frase_pueblos'
  },
];
