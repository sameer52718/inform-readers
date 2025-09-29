"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("b/s");
  const [toUnit, setToUnit] = useState("b/s");
  const [result, setResult] = useState("");

  const toBitPerSecond = {
    "b/s": 1,
    "B/s": 8,
    "kb/s (SI)": 1000,
    "kB/s (SI)": 8000,
    "kb/s": 1024,
    "kB/s": 8192,
    "Mb/s (SI)": 1000000,
    "MB/s (SI)": 8000000,
    "Mb/s": 1048576,
    "MB/s": 8388608,
    "Gb/s (SI)": 1000000000,
    "GB/s (SI)": 8000000000,
    "Gb/s": 1073741824,
    "GB/s": 8589934592,
    "Tb/s (SI)": 1000000000000,
    "TB/s (SI)": 8000000000000,
    "Tb/s": 1099511627776,
    "TB/s": 8796093022208,
    ethernet: 10000000,
    "ethernet (fast)": 100000000,
    "ethernet (gigabit)": 1000000000,
    OC1: 51840000,
    OC3: 155520000,
    OC12: 622080000,
    OC24: 1244160000,
    OC48: 2488320000,
    OC192: 9953280000,
    OC768: 39813120000,
    "ISDN (single)": 64000,
    "ISDN (dual)": 128000,
    "modem (110)": 110,
    "modem (300)": 300,
    "modem (1200)": 1200,
    "modem (2400)": 2400,
    "modem (9600)": 9600,
    "modem (14.4k)": 14400,
    "modem (28.8k)": 28800,
    "modem (33.6k)": 33600,
    "modem (56k)": 56000,
    "SCSI (Async)": 12000000,
    "SCSI (Sync)": 40000000,
    "SCSI (Fast)": 80000000,
    "SCSI (Fast Ultra)": 160000000,
    "SCSI (Fast Wide)": 160000000,
    "SCSI (Fast Ultra Wide)": 320000000,
    "SCSI (Ultra-2)": 640000000,
    "SCSI (Ultra-3)": 1280000000,
    "SCSI (LVD Ultra80)": 640000000,
    "SCSI (LVD Ultra160)": 1280000000,
    "IDE (PIO mode 0)": 26400000,
    "IDE (PIO mode 1)": 41600000,
    "IDE (PIO mode 2)": 66400000,
    "IDE (PIO mode 3)": 88800000,
    "IDE (PIO mode 4)": 132800000,
    "IDE (DMA mode 0)": 33600000,
    "IDE (DMA mode 1)": 106400000,
    "IDE (DMA mode 2)": 132800000,
    "IDE (UDMA mode 0)": 132800000,
    "IDE (UDMA mode 1)": 200000000,
    "IDE (UDMA mode 2)": 264000000,
    "IDE (UDMA mode 3)": 400000000,
    "IDE (UDMA mode 4)": 528000000,
    "IDE (UDMA-33)": 264000000,
    "IDE (UDMA-66)": 528000000,
    USB: 12000000,
    firewire: 400000000,
    "T0 (payload)": 56000,
    "T0 (B8ZS payload)": 64000,
    "T1 (signal)": 1544000,
    "T1 (payload)": 1344000,
    "T1Z (payload)": 1544000,
    "T1C (signal)": 3152000,
    "T1C (payload)": 2688000,
    "T2 (signal)": 6312000,
    "T3 (signal)": 44736000,
    "T3 (payload)": 37632000,
    "T3Z (payload)": 43008000,
    "T4 (signal)": 274176000,
    "E.P.T.A. 1 (signal)": 2048000,
    "E.P.T.A. 1 (payload)": 1920000,
    "E.P.T.A. 2 (signal)": 8448000,
    "E.P.T.A. 2 (payload)": 7680000,
    "E.P.T.A. 3 (signal)": 34368000,
    "E.P.T.A. 3 (payload)": 30720000,
    H0: 384000,
    H11: 1536000,
    H12: 1920000,
    "VT1 (signal)": 1728000,
    "VT1 (payload)": 1544000,
    "VT2 (signal)": 2304000,
    "VT2 (payload)": 2048000,
    "VT6 (signal)": 6312000,
    "VT6 (payload)": 6000000,
    "STS1 (signal)": 51840000,
    "STS1 (payload)": 49500000,
    "STS3 (signal)": 155520000,
    "STS3 (payload)": 150336000,
    "STS3c (signal)": 155520000,
    "STS3c (payload)": 150336000,
    "STS12 (signal)": 622080000,
    "STS24 (signal)": 1244160000,
    "STS48 (signal)": 2488320000,
    "STS192 (signal)": 9953280000,
    "STM-1 (signal)": 155520000,
    "STM-4 (signal)": 622080000,
    "STM-16 (signal)": 2488320000,
    "STM-64 (signal)": 9953280000,
  };

  const units = Object.keys(toBitPerSecond);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toBitPerSecond) || !(toUnit in toBitPerSecond)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const valueInBitPerSecond = value * toBitPerSecond[fromUnit];
    const resultValue = valueInBitPerSecond / toBitPerSecond[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-red-500 text-2xl text-center mb-5">Data Transfer Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block mb-1 text-sm">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block mb-1 text-sm">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 max-h-36 overflow-y-auto"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block mb-1 text-sm">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 max-h-36 overflow-y-auto"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white font-bold border-none rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div
          className="mt-5 text-base text-gray-800 text-center"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </div>
    </div>
  );
}
