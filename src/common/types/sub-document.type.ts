export type CPU = {
  CPUTechnology: string //12th Generation Intel® Core i7
  cacheMemory: string // 12 MB Cache
  detail: string //  10 Core, 12 Threads, up to 4.80 GHz
}

export type Ram = {
  type: string // DDR4
  bus: string //3200Mhz
  capacity: string // 16GB
}

export type HardDrive = {
  capacity: string // 512GB
  type: string // M.2 PCIe NVMe Solid State Drive (M.2 SSD)
}

export type Monitor = {
  size: string  //15.6 inch
  resolution: string // 1920*160 (FHD)
}

export type Size = {
  height: string,
  width: string,
  depth: string
}

export type Audio = {
  audio: string // 3.5mm stereo Earjack
  speaker: string // 2 stereo speaker
}