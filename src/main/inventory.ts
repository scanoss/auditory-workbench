import { ipcMain } from 'electron';
import { Inventory } from '../api/types';
import { IpcEvents } from '../ipc-events';
import { defaultProject } from './workspace/ProjectTree';

ipcMain.handle(
  IpcEvents.INVENTORY_GET,
  async (event, invget: Partial<Inventory>) => {
    let inv: any;
    try {
      inv = await defaultProject.scans_db.inventories.get(invget);
      return { status: 'ok', message: inv, data: inv };
    } catch (e) {
      console.log('Catch an error: ', e);
      return { status: 'fail' };
    }
  }
);

ipcMain.handle(IpcEvents.INVENTORY_CREATE, async (event, arg: Inventory) => {
  let created: any;
  try {
    created = await defaultProject.scans_db.inventories.create(arg);
    arg.id = created;
    defaultProject.attachInventory(arg);
    defaultProject.saveScanProject();
    return { status: 'ok', message: 'Inventory created', data: arg };
  } catch (e) {
    console.log('Catch an error on inventory: ', e);
    return { status: 'fail' };
  }
});

/**
 * INVENTORY_CREATE = 'INVENTORY_CREATE',
  INVENTORY_GET = 'INVENTORY_GET',
  INVENTORY_DELETE = 'INVENTORY_DELETE',
  INVENTORY_UPDATE = 'INVENTORY_UPDATE',
  INVENTORY_ATTACH_FILE = 'INVENTORY_ATTACH_FILE',
  INVENTORY_DETACH_FILE = 'INVENTORY_DETACH_FILE',
 */
