"use client";

import { useEffect } from "react";
import { DateTime } from "luxon";

export default function WorldClockWidget({ city = "Karachi", zone = "Asia/Karachi" }) {
  useEffect(() => {
    class WorldClock extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `
          <div class="bg-white rounded-xl shadow-sm p-4">
            <h3 class="text-lg font-semibold text-gray-900">${city}</h3>
            <p class="text-xl font-mono text-gray-700" id="time"></p>
          </div>
        `;
        const updateTime = () => {
          const time = DateTime.now().setZone(zone).toFormat("HH:mm:ss");
          this.querySelector("#time").textContent = time;
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
      }
    }
    customElements.define("world-clock", WorldClock);
  }, [city, zone]);

  return <world-clock></world-clock>;
}
