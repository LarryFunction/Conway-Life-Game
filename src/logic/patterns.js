import { parseRLE } from './rle.js'

const RAW = [
  { name: '滑翔机 Glider', rle: 'x = 3, y = 3\nbo$2bo$3o!' },
  { name: '轻型飞船 LWSS', rle: 'x = 5, y = 4\nbo2bo$o4b$o3bo$4o!' },
  { name: '闪烁灯 Blinker', rle: 'x = 3, y = 1\n3o!' },
  { name: '蟾蜍 Toad', rle: 'x = 4, y = 2\nb3o$3o!' },
  { name: '方块 Block', rle: 'x = 2, y = 2\n2o$2o!' },
  { name: '蜂巢 Beehive', rle: 'x = 4, y = 3\nb2o$o2bo$b2o!' },
  { name: '十五期虫 Pentadecathlon', rle: 'x = 10, y = 3\n2bo4bo2b$2ob4ob2o$2bo4bo!' },
  {
    name: '脉冲星 Pulsar',
    rle: 'x = 13, y = 13\n2b3o3b3o2b$12b$o4bobo4bo$o4bobo4bo$o4bobo4bo$2b3o3b3o2b$12b$2b3o3b3o2b$o4bobo4bo$o4bobo4bo$o4bobo4bo$12b$2b3o3b3o2b!',
  },
  {
    name: '高斯帕滑翔机枪 Gosper Gun',
    rle: 'x = 36, y = 9\n24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4bobo$10bo5bo7bo$11bo3bo$12b2o!',
  },
  { name: 'R 五连体 R-pentomino', rle: 'x = 3, y = 3\nb2o$2o$bo!' },
  { name: '橡果 Acorn', rle: 'x = 7, y = 3\nbo$3bo$2o2b3o!' },
]

export const PATTERNS = RAW.map(({ name, rle }) => {
  const parsed = parseRLE(rle)
  return { name, width: parsed.width, height: parsed.height, cells: parsed.cells }
})
