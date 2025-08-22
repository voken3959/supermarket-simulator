import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import GameScene from "./game/GameScene";
import Inventory from "./components/Inventory";
import StoreControlPanel from "./components/StoreControlPanel";
import { eventBus } from "./game/EventBus";
import useStore from "./store/useStore";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const money = useStore((s) => s.money);
  const items = useStore((s) => s.inventory);
  const logs = useStore((s) => s.logs);

  useEffect(() => {
    // subscribe to pickups from the game (ensures global state can be updated here for UI)
    const off = eventBus.on("pickup", (e) => {
      useStore.getState().addItem(e.item);
    });
    const offMoney = eventBus.on("money", (m: number) => useStore.getState().setMoney(m));
    const offLog = eventBus.on("log", (msg: string) => useStore.getState().pushLog(msg));

    return () => {
      off();
      offMoney();
      offLog();
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    if (gameRef.current) return; // already created

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1100,
      height: 700,
      parent: mountRef.current,
      backgroundColor: "#071029",
      physics: {
        default: "arcade",
        arcade: {
          debug: false
        }
      },
      scene: [new GameScene()]
    };

    gameRef.current = new Phaser.Game(config);
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const checkout = () => {
    const total = items.reduce((s, it) => s + it.price, 0);
    if (total === 0) return;
    if (money < total) {
      alert("Not enough money to checkout!");
      return;
    }
    useStore.getState().setMoney(money - total);
    useStore.getState().clearInventory();
    eventBus.emit("checkout", { total, items });
    eventBus.emit("log", `Checked out ${items.length} items for $${total}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="game-wrap">
          <div className="header">
            <div style={{ color: "var(--muted)" }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Supermarket Simulator</div>
              <div className="small">Play, manage, observe NPCs, and test behaviors</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <div className="small">Money</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{money} $</div>
              </div>
            </div>
          </div>

          <div className="canvas-container" style={{ flex: 1 }}>
            <div style={{ width: "100%", height: "100%" }} ref={mountRef} />
          </div>
        </div>

        <div className="side-panel">
          <div>
            <div className="panel-title">Store Dashboard</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <div>
                <div className="small">Cart</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{items.length} items</div>
              </div>
              <div>
                <div className="small">NPCs</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{useStore.getState().npcCount}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="panel-title">Inventory / Cart</div>
            <Inventory />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="button" onClick={checkout}>Checkout</button>
              <button
                className="button"
                style={{ background: "#374151", color: "white" }}
                onClick={() => { useStore.getState().clearInventory(); }}
              >
                Clear
              </button>
            </div>
            <div style={{ marginTop: 8 }} className="checkout-area small">
              Drag items to reorder or remove. Use checkout to purchase cart contents.
            </div>
          </div>

          <StoreControlPanel />

          <div style={{ marginTop: "auto" }}>
            <div className="panel-title">Event Log</div>
            <div className="ledger">
              {logs.slice().reverse().map((l, idx) => <div key={idx}>{l}</div>)}
            </div>
            <div style={{ marginTop: 8 }}>
              <div className="panel-title">Controls</div>
              <div className="small">Move: WASD / Arrow keys</div>
              <div className="small">Pick up: walk over items</div>
              <div className="hint">This build enables many advanced systems — we can remove or extend any of them.</div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
