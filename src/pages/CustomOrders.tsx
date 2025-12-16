import React, { useEffect, useState } from "react";
import { fetchCustomOrders, deleteCustomOrder } from "../services/api";
import { useToast } from "../context/ToastContext";
import "./styles/CustomOrders.css";
import Confirm from '../components/ui/Confirm';

interface Order {
  id: number;
  description: string;
  image: string;
  status: string;
}

const CustomOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const email = localStorage.getItem("email") || "";
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchCustomOrders(email)
      .then((data) => {
        if (Array.isArray(data)) {
          // SORT ASCENDING — id 1 first, id 10 last
          const sorted = [...data].sort((a, b) => a.id - b.id);
          setOrders(sorted);
        }
      })
      .catch(() => showToast("Failed to load orders"));
  }, [email, showToast]);

  const cancelOrder = async (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;

    try {
      await deleteCustomOrder(pendingDeleteId);
      setOrders((prev) => prev.filter((o) => o.id !== pendingDeleteId));
      showToast("Order cancelled successfully");
    } catch (e) {
      console.error(e);
      showToast("Failed to cancel order");
    } finally {
      setPendingDeleteId(null);
      setShowConfirm(false);
    }
  };

  return (
    <div className="custom-orders-page">
      <h2>Your Custom Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You have no custom orders yet.</p>
      ) : (
        <div className="custom-orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="custom-order-card">
              <div className="order-img-wrapper">
                <img src={order.image} alt="wear" loading="lazy" />
              </div>

              <span
                className={`custom-order-status ${
                  order.status === "completed" ? "status-completed" : "status-pending"
                }`}
              >
                {order.status}
              </span>

              <p className="order-desc">{order.description}</p>

              <button
                className="cancel-btn"
                onClick={() => cancelOrder(order.id)}
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showConfirm && (
        <Confirm
          title="Cancel Order?"
          message="Are you sure you want to cancel this order?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setPendingDeleteId(null);
            setShowConfirm(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomOrders;
