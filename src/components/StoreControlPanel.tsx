import React from "react";
import useStore from "../store/useStore";
import { eventBus } from "../game/EventBus";

export default function StoreControlPanel() {
  const npcCount = useStore((s) => s.npcCount);
  const pushLog = useStore((s) => s.pushLog);
  const setNpcCount = useStore((s) => s.setNpcCount);

  const spawnItem = () => {
    // instruct game to spawn a random item
    eventBus.emit("cmd:spawnItem", {});
    pushLog("Spawn item command sent");
  };

  const toggleNpc = () => {
    const next = npcCount > 0 ? 0 : 3;
    setNpcCount(next);
    eventBus.emit("cmd:setNpc", next);
    pushLog(`Set NPC count to ${next}`);
  };

  const save = () => {
    const state = {
      money: useStore.getState().money,
      inventory: useStore.getState().inventory,
      logs: useStore.getState().logs
    };
    localStorage.setItem("supermarket_save", JSON.stringify(state));
    pushLog("Saved game state to localStorage");
  };

  const load = () => {
    const raw = localStorage.getItem("supermarket_save");
    if (raw) {
      try {
        const st = JSON.parse(raw);
        if (st.money) useStore.getState().setMoney(st.money);
        if (st.inventory) {
          useStore.getState().clearInventory();
          for (const it of st.inventory) useStore.getState().addItem(it);
        }
        pushLog("Loaded game state from localStorage");
      } catch (e) {
        pushLog("Failed to load save");
      }
    } else {
      pushLog("No save found");
    }
  };

  return (
    <div>
      <div className="panel-title">Control Panel</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button className="button" onClick={spawnItem}>Spawn Item</button>
        <button className="button" onClick={toggleNpc}>{npcCount > 0 ? "Disable NPCs" : "Enable NPCs"}</button>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button className="button" onClick={save}>Save</button>
        <button className="button" onClick={load}>Load</button>
      </div>
    </div>
  );
}
