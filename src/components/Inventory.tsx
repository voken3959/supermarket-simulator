import React from "react";
import { useDrag, useDrop } from "react-dnd";
import useStore, { Item } from "../store/useStore";

const ITEM_TYPE = "CART_ITEM";

function DraggableItem({ item, index }: { item: Item; index: number }) {
  const [, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: item.id, index, name: item.name, price: item.price },
    collect: (m) => m
  }), [item, index]);

  return (
    <div ref={drag} className="item-row" style={{ cursor: "grab" }}>
      <div>
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div className="small">{item.price} $</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ fontWeight: 700 }}>{item.price}$</div>
        <button
          className="toggle"
          onClick={() => useStore.getState().removeItem(item.id)}
          title="Remove from cart"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function Inventory() {
  const items = useStore((s) => s.inventory);
  const total = items.reduce((s, it) => s + it.price, 0);

  // accept drops for removal (drop here to discard)
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (d: any) => {
      useStore.getState().removeItem(d.id);
      useStore.getState().pushLog(`Removed ${d.name} from cart (dropped)`);
    }
  }), []);

  return (
    <div>
      <div className="small" style={{ marginBottom: 8 }}>
        Click inside the game canvas to control player. Items auto-add on overlap.
      </div>

      <div ref={drop} className="inventory-list">
        {items.length === 0 && <div className="small">No items in cart yet.</div>}
        {items.map((it, idx) => (
          <DraggableItem key={it.id} item={it} index={idx} />
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="small">Total</div>
        <div style={{ fontWeight: 800 }}>{total} $</div>
      </div>
    </div>
  );
}
